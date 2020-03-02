const Sequelize = require('sequelize');
const { User, Casa, Divisao, Foto } = require('../models');

if (!global.hasOwnProperty('db')) {
  let sequelize;
  // Option 1: Passing parameters separately
  if (process.env.DATABASE_URL) {
    sequelize = new Sequelize('trqxjv9cvk44lyum', 'y9fmh98miynewqww', 'yd4fzsqjdz25kbmd', {
      host: 'cvktne7b4wbj4ks1.chr7pe7iynqr.eu-west-1.rds.amazonaws.com',
      dialect: 'mysql',
      port : 3306
    })
    console.log('production DB');
  } else {
    sequelize = new Sequelize('casascoimbra', 'root', 'root', {
      host: 'localhost',
      dialect: 'mysql',
      port: 8889
    });
    console.log('Local DB');
  }

  global.db = {
    Sequelize,
    sequelize,
    User,
    Casa,
    Foto,
    Divisao
  };

  // Connect to DB
  sequelize.authenticate().then(() => {
    console.log('Connected to database');
  });
}

module.exports = global.db;
