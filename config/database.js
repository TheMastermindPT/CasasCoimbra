const Sequelize = require('sequelize');
const env = require('../.env');
const { User, Casa, Divisao, Foto } = require('../models');


if (!global.hasOwnProperty('db')) {
  let sequelize;
  // Option 1: Passing parameters separately
  if (process.env.DATABASE_URL) {
    sequelize = new Sequelize(    
    "postgres://wsqjoftvrcasoj:2c2fd17610760741c6a5a0c1c4e8ae8278274489574d016dfe136b808901a09b@ec2-54-247-125-38.eu-west-1.compute.amazonaws.com:5432/d8hl2ld4fimmnt");
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
