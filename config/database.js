const Sequelize = require('sequelize');
const { User, Casa, Divisao, Foto } = require('../models');

if (!global.hasOwnProperty('db')) {
  let sequelize;
  // Option 1: Passing parameters separately
  if (process.env.DATABASE_URL) {
    sequelize = new Sequelize(    
    "postgres://hpzssqxlftvmow:5deb4fab2c75c9b6f3291d14597fbb307b7f24b2230e41f2f8430d08b5b168ba@ec2-46-137-84-173.eu-west-1.compute.amazonaws.com:5432/d6pnii2gpt1ro1");
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
