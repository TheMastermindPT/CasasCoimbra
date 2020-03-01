const Sequelize = require('sequelize');
const { User, Casa, Divisao, Foto } = require('../models');

if (!global.hasOwnProperty('db')) {
  let sequelize;
  // Option 1: Passing parameters separately
  if (process.env.DATABASE_URL) {
    sequelize = new Sequelize(    
    "postgres://nszhhprjnicxxa:94670110c59ca4761ee70e4809e1f0066a968cd03b0fc1ae3787bb1509c1bd77@ec2-54-246-90-10.eu-west-1.compute.amazonaws.com:5432/dcccq7qv6adim9");
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
