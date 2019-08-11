const path = require('path');
const fs = require('fs-extra');
const multer = require('multer');
const bodyParser = require('body-parser');
const app = require('express');
const Promise = require('bluebird');
const { casas } = require('../../client/casas');
const db = require('../../../config/database');

const router = app.Router();
router.use(
  bodyParser.urlencoded({
    extended: true
  })
);
router.use(bodyParser.json());

Promise.config({
  longStackTraces: true,
  warnings: true // note, run node with --trace-warnings to see full stack traces for warnings
});

// SET STORAGE ENGINE
const storage = multer.diskStorage({
  destination(req, file, callback) {
    callback(null, path.join(`./src/assets/temp`)); // here you can place your destination path
  },
  filename(req, file, callback) {
    callback(null, `${file.originalname}`);
  }
});

// Check if file type is an image
const checkFileType = (file, callback) => {
  // Allow extension
  const fileTypes = /jpeg|jpg|png/;
  // Check Extension
  const extensionName = fileTypes.test(path.extname(file.originalname));
  // Check mimeType
  const mimeType = fileTypes.test(file.mimetype);

  if (extensionName && mimeType) {
    return callback(null, true);
  }
  callback('Only images allowed');
};

// Check if the folder already exists
const ensureExistsFolder = (folder, cb) => {
  fs.mkdir(folder, function(err) {
    if (err) {
      if (err.code == 'EEXIST') {
        cb(null); // ignore the error if the folder already exists
      } else {
        cb(err); // something else went wrong
      }
    } else cb(null); // successfully created folder
  });
};

// Upload Definitions
const upload = multer({
  storage,
  fileFilter(req, file, callback) {
    checkFileType(file, callback);
  }
}).single('casa');

const uploadMulti = multer({
  storage,
  fileFilter(req, file, callback) {
    checkFileType(file, callback);
  }
}).array('fotos', 10);

// Copies files
async function copyFiles(src, dest) {
  try {
    await fs.copy(src, dest);
    console.log('Photo was copied!');
  } catch (err) {
    console.error(err);
  }
}

// Removes content from folder, uploads new photos and updates the DB
async function uploadFiles(files, divisao, tipo, nome, numero, idCasa) {
  try {
    // Using Promise.map:
    Promise.map(files, function(fileName) {
      // Promise.map awaits for returned promises as well.
      const src = path.join(`./src/assets/temp/${fileName.originalname}`);
      const dest = path.join(
        `./src/assets/casas/${nome}/${tipo}${numero}/${fileName.originalname}`
      );
      return copyFiles(src, dest);
    }).then(function() {
      fs.readdir(
        path.join(`./src/assets/casas/${nome}/${tipo}${numero}`),
        (error, ficheiros) => {
          if (error) throw error;
          ficheiros.forEach((ficheiro, index) => {
            const newPath = `assets/casas/${nome}/${tipo}${numero}/${ficheiro}`;
            db.Foto.create({
              path: newPath,
              DivisaoIdDivisao: divisao,
              CasaIdCasa: idCasa
            }).then(() => {
              console.log('Foto path created');
            });
          });
        }
      );
    });
  } catch (failed) {
    console.log(failed);
  }
}

router.post('/preview', (req, res) => {
  // Check if the folder exists and moves file from Temp folder to new folder
  ensureExistsFolder(path.join(`src/assets/temp/`), err => {
    if (err) {
      throw err;
    } else {
      upload(req, res, function(err) {
        if (err) {
          res.sendStatus(400);
          res.end();
        } else {
          res.sendStatus(200);
          res.end();
        }
      });
    }
  });
});

router.post('/uploadMulti', (req, res) => {
  // Check if the folder exists and moves file from Temp folder to new folder
  ensureExistsFolder(path.join(`src/assets/temp/`), err => {
    if (err) {
      throw err;
    } else {
      uploadMulti(req, res, function(err) {
        if (err) {
          res.sendStatus(400);
          res.end();
        } else {
          const { divisao, tipo, nome, numero, idCasa } = req.body;
          const { files } = req;
          uploadFiles(files, divisao, tipo.toLowerCase(), nome, numero, idCasa);
          res.send(req.files);
        }
      });
    }
  });
});

// Upload Test
router.post('/upload', (req, res) => {
  upload(req, res, function(err) {
    if (err) {
      res.sendStatus(400);
      res.end();
    } else {
      let { mobilado, netTv } = req.body;
      let fotoPath;
      let fileType;
      let fileName;

      // Check if there is a file to be uploaded
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
          nome: req.body.nome,
          numero: req.body.numero,
          fotoMain: fileName,
          tipologia: req.body.tipologia,
          wc: req.body.wc,
          zona: req.body.zona,
          morada: req.body.morada,
          mobilado,
          proximo: req.body.proximo,
          netTv,
          despesas: req.body.despesas,
          mapa: req.body.mapa
        }
      }).then(([casa, created]) => {
        let { nome } = req.body;
        nome = nome.toLowerCase().trim();

        // Check if file exists
        if (req.file != null) {
          fotoPath = `assets/casas/${nome}/${nome}${fileType}`;
          // Check if the folder exists and moves file from Temp folder to new folder
          ensureExistsFolder(path.join(`src/assets/casas/${nome}`), err => {
            if (err) {
              throw err;
            } else {
              copyFiles(
                path.join(`./src/assets/temp/${req.file.originalname}`),
                path.join(`./src/${fotoPath}`)
              );
            }
          });
          // If file exists and home exists update the foto and the fields
          db.Casa.update(
            {
              fotoMain: fotoPath,
              tipologia: req.body.tipologia,
              wc: req.body.wc,
              zona: req.body.zona,
              morada: req.body.morada,
              mobilado,
              proximo: req.body.proximo,
              netTv,
              despesas: req.body.despesas,
              mapa: req.body.mapa
            },
            {
              where: { nome: req.body.nome }
            }
          ).then();
        } else if (!created) {
          // If there is no file update only the text fields
          db.Casa.update(
            {
              tipologia: req.body.tipologia,
              wc: req.body.wc,
              zona: req.body.zona,
              morada: req.body.morada,
              mobilado,
              proximo: req.body.proximo,
              netTv,
              despesas: req.body.despesas,
              mapa: req.body.mapa
            },
            {
              where: { nome: req.body.nome }
            }
          ).then();
        }
        res.end();
      });
    }
  });
});

// Delete Home
router.post('/delete', (req, res) => {
  db.Casa.findOne({
    where: { nome: req.body.nome },
    include: [
      {
        model: db.Divisao
      },
      {
        model: db.Foto
      }
    ]
  }).then(casa => {
    // MAYBE CHANGE

    const foto = db.Foto.destroy({
      where: {
        CasaIdCasa: casa.idCasa
      }
    }).then(() => {
      const divisao = db.Divisao.destroy({
        where: {
          CasaIdCasa: casa.idCasa
        }
      }).then(() => {
        const home = db.Casa.destroy({
          where: {
            idCasa: casa.idCasa
          }
        }).then(() => {
          res.sendStatus(200);
          res.end();
        });
      });
    });
  });
});

router.delete('/removePhoto', (req, res) => {
  db.Foto.findAll({ where: { idFoto: req.body.idFoto } })
    .then(fotos => {
      const { idFoto, idDivisao, nome, divisao } = req.body;
      const foto = fotos[0].path;

      db.Foto.destroy({ where: { idFoto: fotos[0].idFoto } }).then(() => {
        console.log('foto removed');
        res.sendStatus(200);
        res.end();
      });
      // if (foto.startsWith(`assets/casas/${nome}/${divisao}`)) {
      //   fs.remove(path.join(`src/${foto}`))
      //     .then(() => {})
      //     .catch(err => {
      //       console.error(err);
      //       res.end();
      //     });
      // }
    })
    .catch(err => console.error(err));
});

// GET Checks for queries and retreives specified data
router.get('/', (req, res) => {
  // If there are no queries in URL, retrieve all the homes in DB
  if (Object.keys(req.query).length === 0) {
    db.Casa.findAll().then(casa => {
      res.setHeader('Content-Type', 'application/json');
      res.send(casa);
      res.end();
    });
  }
  // If there is only id query, retrieve the Home with the associated ID
  if (
    Object.keys(req.query)[0] === 'id' &&
    Object.keys(req.query).length === 1
  ) {
    db.Casa.findOne({
      include: [
        {
          model: db.Divisao,
          include: {
            model: db.Foto
          }
        }
      ],
      where: {
        numero: parseInt(req.query.id, 10)
      }
    }).then(data => {
      return res.json(data);
    });
  }
  // Get the divison from the house and all the photos
  if (
    Object.keys(req.query)[0] === 'id' &&
    Object.keys(req.query)[1] === 'div' &&
    Object.keys(req.query)[2] === 'json'
  ) {
    db.Casa.findOne({
      include: [
        {
          model: db.Divisao,
          include: {
            model: db.Foto
            // where: {
            //     'DivisaoidDivisao': req.query.div
            // }
          }
        }
      ],
      where: {
        numero: req.query.id
      }
    }).then(data => {
      return res.json(data);
    });
  }

  // Get all the info about the division and pull the photos that are associated with it
  if (
    Object.keys(req.query)[0] === 'id' &&
    Object.keys(req.query)[1] === 'div'
  ) {
    db.Casa.findOne({
      include: [
        {
          model: db.Divisao,
          include: {
            model: db.Foto,
            where: {
              DivisaoidDivisao: req.query.div
            }
          }
        }
      ],
      where: {
        numero: req.query.id
      }
    }).then(data => {
      return res.json(data);
    });
  }

  // If there is id, div and foto queries fecth it from DB
  if (
    Object.keys(req.query)[0] === 'id' &&
    Object.keys(req.query)[1] === 'div' &&
    Object.keys(req.query)[2] === 'foto'
  ) {
    db.Casa.findOne({
      include: [
        {
          model: db.Divisao,
          include: { model: db.Foto },
          where: {
            idDivisao: req.query.div
          }
        }
      ],
      where: {
        numero: req.query.id
      }
    }).then(data => {
      let casa = data;
      casa = JSON.stringify(casa);
      casa = JSON.parse(casa);
      return casa.render('home', {
        casa,
        script: 'home',
        urlParameters: {
          idDivisao: req.query.div,
          idFoto: req.query.foto
        }
      });
    });
  }
});

// GET Division with photos
router.get('/:id/divisao=:idDivisao', (req, res) => {
  const idCasa = parseInt(req.params.id, 10);
  const idDivisao = parseInt(req.params.idDivisao, 10);

  db.Casa.findOne({
    where: { idCasa },
    include: [{ model: db.Divisao }, { model: db.Foto }]
  })
    .then(casa => {
      res.send(casa.divisao[idDivisao]);
    })
    .catch(err => {
      console.log(err);
    });

  // db.Divisao.findOne({ where: { 'CasaIdCasas': idCasa }, include: { model: db.Foto } }).then((divisao) => {
  //     res.send(divisao);
  // }).catch(err => { console.log(err); })
});

// POPULATE DATABASE
router.post('/create', (req, res) => {
  casas.forEach(casa => {
    db.Casa.create({
      nome: casa.casa,
      numero: casa.numero,
      fotoMain: casa.fotoMain,
      tipologia: casa.tipologia,
      wc: casa.wc,
      zona: casa.zona,
      morada: casa.morada,
      mobilado: casa.mobilado,
      proximo: casa.proximo,
      netTv: casa.netTV,
      despesas: casa.despesas,
      mapa: casa.mapa
    })
      .then(casaObj => {
        casa.divisoes.forEach(divisao => {
          db.Divisao.create({
            CasaIdCasa: casaObj.idCasa,
            tipo: divisao.tipo,
            numero: divisao.numero,
            descricao: divisao.descricao,
            preco: divisao.preco,
            disponivel: divisao.disponivel,
            quando: divisao.quando
          })
            .then(divisaoObj => {
              divisao.fotos.forEach(foto => {
                db.Foto.create({
                  CasaIdCasa: casaObj.idCasa,
                  DivisaoIdDivisao: divisaoObj.idDivisao,
                  path: foto.toString()
                })
                  .then(() => {
                    console.log('success');
                  })
                  .catch(err => console.log(err));
              });
              res.send(divisaoObj);
              res.end();
            })
            .catch(err => {
              console.log(err);
            });
        });
      })
      .catch(err => {
        console.log(err);
      });
  });
});

module.exports = router;
