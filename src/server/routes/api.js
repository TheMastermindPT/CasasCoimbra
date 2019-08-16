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
    callback(null, path.join(`./dist/assets/temp`)); // here you can place your destination path
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
  fs.mkdir(folder, err => {
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
async function copyFiles(src, dest, file) {
  try {
    await fs.copy(src, dest);
    console.log('Photo was copied!');
    return file;
  } catch (err) {
    console.error(err);
  }
}

// Removes content from folder, uploads new photos and updates the DB
async function uploadFiles(res, files, divisao, tipo, nome, numero, idCasa) {
  try {
    const query = await Promise.map(files, file => {
      const newPath = `assets/casas/${nome}/${tipo}${numero}/${file.originalname}`;

      return db.Foto.findOrCreate({
        where: { path: newPath },
        defaults: {
          DivisaoIdDivisao: divisao,
          CasaIdCasa: idCasa,
          path: newPath
        }
      }).then(([foto, created]) => {
        if (created) {
          console.log('Created foto in DB');
          return foto;
        }
        return [];
      });
    });
    const done = await Promise.map(query, file => {
      if (!Array.isArray(file)) {
        const fileName = file.path.split('/').pop();
        // Promise.map awaits for returned promises as well.
        const src = path.join(`./dist/assets/temp/${fileName}`);
        const dest = path.join(
          `./dist/assets/casas/${nome}/${tipo}${numero}/${fileName}`
        );

        return copyFiles(src, dest, file);
      }
      return [];
    });
    return done;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

router.post('/preview', (req, res) => {
  // Check if the folder exists and moves file from Temp folder to new folder
  ensureExistsFolder(path.join(`dist/assets/temp/`), err => {
    if (err) {
      throw err;
    } else {
      upload(req, res, err => {
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

router.post('/uploadMulti', (req, res, next) => {
  // Check if the folder exists and moves file from Temp folder to new folder
  ensureExistsFolder(path.join(`dist/assets/temp/`), err => {
    if (err) {
      throw err;
    } else {
      uploadMulti(req, res, err => {
        if (err) {
          res.sendStatus(400);
          res.end();
        } else {
          const { divisao, tipo, nome, numero, idCasa } = req.body;
          const { files } = req;

          uploadFiles(
            res,
            files,
            divisao,
            tipo.toLowerCase(),
            nome,
            numero,
            idCasa
          )
            .then(done => res.send(done))
            .catch(err => {
              next();
            });
        }
      });
    }
  });
});

// Upload Test
router.post('/upload', (req, res, next) => {
  upload(req, res, err => {
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
      })
        .then(([casa, created]) => {
          let { nome } = req.body;
          nome = nome.toLowerCase().trim();

          // Check if file exists
          if (req.file != null) {
            fotoPath = `assets/casas/${nome}/${nome}${fileType}`;
            // Check if the folder exists and moves file from Temp folder to new folder
            ensureExistsFolder(path.join(`dist/assets/casas/${nome}`), err => {
              if (err) {
                throw err;
              } else {
                copyFiles(
                  path.join(`./dist/assets/temp/${req.file.originalname}`),
                  path.join(`./dist/${fotoPath}`)
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
            )
              .then()
              .catch(oops => next());
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
            )
              .then()
              .catch(oops => next());
          }
          res.end();
        })
        .catch(oops => next());
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
  })
    .then(casa => {
      // MAYBE CHANGE

      const foto = db.Foto.destroy({
        where: {
          CasaIdCasa: casa.idCasa
        }
      })
        .then(() => {
          const divisao = db.Divisao.destroy({
            where: {
              CasaIdCasa: casa.idCasa
            }
          })
            .then(() => {
              const home = db.Casa.destroy({
                where: {
                  idCasa: casa.idCasa
                }
              })
                .then(() => {
                  res.sendStatus(200);
                  res.end();
                })
                .catch(oops => next());
            })
            .catch(oops => next());
        })
        .catch(oops => next());
    })
    .catch(oops => next());
});

router.delete('/removePhoto', (req, res, next) => {
  let { filepath, idFoto } = req.body;
  filepath = filepath.slice(1);

  db.Foto.findOne({ where: { idFoto } }).then(foto => {
    fs.remove(`./dist/${filepath}`)
      .then(() => {
        foto
          .destroy({ where: { idFoto } })
          .then(() => {
            console.log('Foto file removed!');
            res.send({});
          })
          .catch(oops => next());
      })
      .catch(err => {
        console.error(err);
        next();
      });
  });
});

// GET Checks for queries and retreives specified data
router.get('/', (req, res, next) => {
  // If there are no queries in URL, retrieve all the homes in DB
  if (Object.keys(req.query).length === 0) {
    db.Casa.findAll()
      .then(casa => {
        res.setHeader('Content-Type', 'application/json');
        res.send(casa);
      })
      .catch(oops => next());
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
        // FIXED A BUG HERE FIELDS WAS NUMERO
        idCasa: parseInt(req.query.id, 10)
      }
    })
      .then(data => res.json(data))
      .catch(oops => next());
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
    })
      .then(data => res.json(data))
      .catch(oops => next());
  }

  // Get all the info about the division and pull the photos that are associated with it
  if (
    Object.keys(req.query)[0] === 'id' &&
    Object.keys(req.query)[1] === 'div' &&
    Object.keys(req.query)[2] === 'edit'
  ) {
    db.Casa.findOne({
      include: [
        {
          model: db.Divisao,
          include: {
            model: db.Foto,
            required: false,
            where: {
              DivisaoIdDivisao: req.query.div
            }
          },
          where: {
            idDivisao: req.query.div
          }
        }
      ],
      where: {
        numero: req.query.id
      }
    })
      .then(data => res.json(data))
      .catch(oops => next());
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
    })
      .then(data => {
        let casa = data;
        casa = JSON.stringify(casa);
        casa = JSON.parse(casa);
        return res.render('home', {
          casa,
          script: 'home',
          urlParameters: {
            idDivisao: req.query.div,
            idFoto: req.query.foto
          }
        });
      })
      .catch(oops => next());
  }
});

router.post('/editDivisions', (req, res, next) => {
  let {
    idCasa,
    idDivisao,
    tipo,
    numero,
    descricao,
    preco,
    disponivel,
    quando
  } = req.body;

  preco = parseInt(preco, 10);
  idDivisao = parseInt(idDivisao, 10) || 'create';
  disponivel = disponivel === 'true' ? 1 : 0;

  console.log(typeof idDivisao);

  if (typeof idDivisao === 'number') {
    return db.Divisao.update(
      {
        tipo,
        numero,
        descricao,
        preco,
        disponivel,
        quando: quando || null
      },
      { where: { idDivisao } }
    )
      .then(divisao => {
        console.log('updated');
        res.send({ action: 'updated' });
      })
      .catch(oops => next());
  }

  return db.Divisao.create({
    CasaIdCasa: idCasa,
    tipo,
    numero,
    descricao,
    preco,
    disponivel,
    quando: quando || null
  })
    .then(created => {
      res.send({ created, action: 'created' });
    })
    .catch(oops => next());
});

router.delete('/deleteDivision', (req, res, next) => {
  const { idDivisao, nome, tipo, numero } = req.body;

  db.Divisao.findOne({
    where: { idDivisao },
    include: [
      {
        model: db.Foto,
        required: false
      }
    ]
  })
    .then(divisao => {
      if (divisao !== null) {
        db.Foto.destroy({
          where: {
            DivisaoIdDivisao: divisao.idDivisao
          }
        }).then(() => {
          db.Divisao.destroy({
            where: {
              idDivisao: divisao.idDivisao
            }
          }).then(() => {
            fs.remove(`./dist/assets/casas/${nome}/${tipo}${numero}`)
              .then()
              .catch(oops => next());
            res.send({ delete: true });
            res.end();
          });
        });
      }
    })
    .catch(oops => next());
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
