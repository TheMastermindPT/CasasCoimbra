const app = require('express');
const router = app.Router();
import { casas } from '../../client/casas';
import { parse } from 'handlebars';
const db = require('../../../config/database');
const multer = require('multer');
const path = require('path');
const fs = require('fs');


//SET STORAGE ENGINE
const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, path.join(`./src/assets/temp`));//here you can place your destination path
    },
    filename: function (req, file, callback) {
        callback(null, `${file.originalname}`);
    }
})

//Check if file type is an image
const checkFileType = (file, callback) => {
    // Allow extension
    const fileTypes = /jpeg|jpg|png/;
    //Check Extension
    const extensionName = fileTypes.test(path.extname(file.originalname));
    //Check mimeType
    const mimeType = fileTypes.test(file.mimetype);

    if (extensionName && mimeType) {
        return callback(null, true);
    }
    callback('Only images allowed');
}

//Check if the folder already exists
const ensureExistsFolder = (path, cb) => {
    fs.mkdir(path, function (err) {
        if (err) {
            if (err.code == 'EEXIST') {
                cb(null)// ignore the error if the folder already exists
            }
            else {
                cb(err); // something else went wrong
            }
        } else cb(null); // successfully created folder
    });
}

//Upload Definitions
const upload = multer({
    storage: storage,
    fileFilter: function (req, file, callback) {
        checkFileType(file, callback);
    }
}).single('casa');


router.post('/preview', (req, res, next) => {
    //Check if the folder exists and moves file from Temp folder to new folder
    ensureExistsFolder(path.join(`src/assets/temp/`), err => {
        if (err) {
            throw err;
        } else {
            upload(req, res, function (err) {
                if (err) {
                    res.sendStatus(400);
                    res.end();
                } else {
                    let fileType = req.file.originalname.split('.').pop();
                    fileType = '.' + fileType;

                    fs.readFile(path.join(`./src/assets/temp/${req.file.originalname}`), function (err, data) {
                        if (err) throw err;
                        fs.writeFile(path.join(`./src/assets/temp/casa${req.body.numero}${fileType}`), data, function (err) {
                            if (err) throw err;
                        });
                    });
                    res.end();
                }
            });
        }
    });
});

//Upload Test
router.post('/upload', (req, res, next) => {
    upload(req, res, function (err) {
        if (err) {
            res.sendStatus(400);
            res.end();
        } else {
            let mobilado = req.body.mobilado;
            let netTv = req.body.netTv;
            let fotoPath;
            let fileType;
            let fileName;

            //Check if there is a file to be uploaded
            if (req.file != null) {
                fileType = path.extname(req.file.originalname);
                fileName = req.file.filename;
            }

            if (mobilado === 'on') {
                mobilado = 1;
            } else {
                mobilado = 0;
            }

            if (netTv === 'on') {
                netTv = 1;
            } else {
                netTv = 0;
            }

            db.Casa.findOrCreate({
                where: { nome: req.body.nome },
                defaults: {
                    'nome': req.body.nome,
                    'numero': req.body.numero,
                    'fotoMain': fileName,
                    'tipologia': req.body.tipologia,
                    'wc': req.body.wc,
                    'zona': req.body.zona,
                    'morada': req.body.morada,
                    'mobilado': mobilado,
                    'proximo': req.body.proximo,
                    'netTv': netTv,
                    'despesas': req.body.despesas,
                    'mapa': req.body.mapa
                }
            }).then(([casa, created]) => {
                //Check if file exists
                if (req.file != null) {
                    fotoPath = `assets/casas/casa${casa.numero}/casa${casa.numero}${fileType}`;
                    //Check if the folder exists and moves file from Temp folder to new folder
                    ensureExistsFolder(path.join(`src/assets/casas/casa${casa.numero}`), err => {
                        if (err) {
                            throw err;
                        } else {
                            fs.readFile(path.join(`./src/assets/temp/casa${req.body.numero}${fileType}`), function (err, data) {
                                if (err) throw err;
                                fs.writeFile(path.join(`./src/assets/casas/casa${casa.numero}/casa${casa.numero}${fileType}`), data, function (err) {
                                    if (err) throw err;
                                });
                            });
                        }
                    });
                    //If file exists and home exists update the foto and the fields
                    db.Casa.update(
                        {
                            'fotoMain': fotoPath,
                            'tipologia': req.body.tipologia,
                            'wc': req.body.wc,
                            'zona': req.body.zona,
                            'morada': req.body.morada,
                            'mobilado': mobilado,
                            'proximo': req.body.proximo,
                            'netTv': netTv,
                            'despesas': req.body.despesas,
                            'mapa': req.body.mapa
                        },
                        {
                            where: { nome: req.body.nome }
                        }
                    ).then();
                } else {
                    //If there is no file update only the text fields
                    if (!created) {
                        db.Casa.update(
                            {
                                'tipologia': req.body.tipologia,
                                'wc': req.body.wc,
                                'zona': req.body.zona,
                                'morada': req.body.morada,
                                'mobilado': mobilado,
                                'proximo': req.body.proximo,
                                'netTv': netTv,
                                'despesas': req.body.despesas,
                                'mapa': req.body.mapa
                            },
                            {
                                where: { nome: req.body.nome }
                            }
                        ).then();
                    }
                }
                res.end();
            });
        }
    });
});


router.post('/delete', (req, res, next) => {
    db.Casa.findOne(
        {
            where: { 'nome': req.body.nome },
            include: [
                {
                    model: db.Divisao
                },
                {
                    model: db.Foto
                }
            ]
        }
    ).then(casa => {

        db.Foto.destroy({
            where: {
                'CasaIdCasa': casa.idCasa,
            }
        }).then();

        db.Divisao.destroy({
            where: {
                'CasaIdCasa': casa.idCasa,
            }
        }).then();

        db.Casa.destroy({
            where: {
                'idCasa': casa.idCasa,
            }
        }).then();
        res.end();
    });
});


//Checks for queries and retreives specified data
router.get('/', (req, res, next) => {

    //If there are no queries in URL, retrieve all the homes in DB
    if (Object.keys(req.query).length === 0) {
        db.Casa.findAll().then(casa => {
            res.setHeader('Content-Type', 'application/json');
            res.send(casa);
            res.end();
        });
    }
    //If there is only id query, retrieve the Home with the associated ID
    if (Object.keys(req.query)[0] === 'id' && Object.keys(req.query).length === 1) {
        db.Casa.findOne({
            include: [
                {
                    model: db.Divisao,
                    include: { model: db.Foto }
                }
            ],
            where: {
                'numero': parseInt(req.query.id)
            }
        }).then(data => {
            return res.json(data);
        });
    }
    //If there is id, div and foto queries fecth it from DB
    if (Object.keys(req.query)[0] === 'id' && Object.keys(req.query)[1] === 'div' && Object.keys(req.query)[2] === 'json') {
        db.Casa.findOne({
            include: [
                {
                    model: db.Divisao,
                    include: {
                        model: db.Foto,
                        // where: {
                        //     'DivisaoidDivisao': req.query.div
                        // }
                    },
                }
            ],
            where: {
                'numero': req.query.id
            }
        }).then(data => {
            return res.json(data);
        });
    }
    //If there is id, div and foto queries fecth it from DB
    if (Object.keys(req.query)[0] === 'id' && Object.keys(req.query)[1] === 'div' && Object.keys(req.query)[2] === 'foto') {
        db.Casa.findOne({
            include: [
                {
                    model: db.Divisao,
                    include: { model: db.Foto },
                    where: {
                        'idDivisao': req.query.div,
                    }
                }
            ],
            where: {
                'numero': req.query.id
            }
        }).then(data => {
            data = JSON.stringify(data);
            data = JSON.parse(data);
            return res.render('home', {
                data: data,
                script: 'home',
                urlParameters: {
                    'idDivisao': req.query.div,
                    'idFoto': req.query.foto
                }
            });
        });
    }
});


//GET Division with photos
router.get('/:id/divisao=:idDivisao', (req, res) => {
    const idCasa = parseInt(req.params.id);
    const idDivisao = parseInt(req.params.idDivisao);
    const url = req.originalUrl;

    db.Casa.findOne({ where: { 'idCasa': idCasa }, include: [{ model: db.Divisao }, { model: db.Foto }] }).then((casa) => {
        res.send(casa.divisao[idDivisao]);
    }).catch(err => { console.log(err); })

    // db.Divisao.findOne({ where: { 'CasaIdCasas': idCasa }, include: { model: db.Foto } }).then((divisao) => {
    //     res.send(divisao);
    // }).catch(err => { console.log(err); })

});

// POPULATE DATABASE
router.post('/create', (req, res) => {
    casas.forEach(casa => {
        db.Casa.create({
            'nome': casa.casa,
            'numero': casa.numero,
            'fotoMain': casa.fotoMain,
            'tipologia': casa.tipologia,
            'wc': casa.wc,
            'zona': casa.zona,
            'morada': casa.morada,
            'mobilado': casa.mobilado,
            'proximo': casa.proximo,
            'netTv': casa.netTV,
            'despesas': casa.despesas,
            'mapa': casa.mapa
        }).then(casaObj => {
            casa.divisoes.forEach(divisao => {
                db.Divisao.create({
                    'CasaIdCasa': casaObj.idCasa,
                    'tipo': divisao.tipo,
                    'numero': divisao.numero,
                    'descricao': divisao.descricao,
                    'preco': divisao.preco,
                    'disponivel': divisao.disponivel,
                    'quando': divisao.quando,
                }).then((divisaoObj) => {
                    db.Foto.create({
                        'CasaIdCasa': casaObj.idCasa,
                        'DivisaoIdDivisao': divisaoObj.idDivisao,
                        'path': divisao.fotos.toString()
                    }).then(() => { console.log('success'); }).catch(err => console.log(err));

                }).catch(err => { console.log(err); })
            });
        }).catch(err => { console.log(err); })
    });
});

module.exports = router;
