const Sequelize = require('sequelize');
const { User, Casa, Divisao, Foto } = require('../models');


if (!global.hasOwnProperty('db')) {
  let sequelize;
  // Option 1: Passing parameters separately
  if (process.env.DATABASE_URL) {
    sequelize = new Sequelize(    
      "postgres://nzracvusgvssde:e2266f651afde48877f05624f5a002518e3dc45e8e0a9e5dee682125fbafc8bd@ec2-54-195-247-108.eu-west-1.compute.amazonaws.com:5432/d3r44jpn8rhhqq"
    );
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
