const Sequelize = require('sequelize');
const { User, Casa, Divisao, Foto } = require('../models');

if (!global.hasOwnProperty('db')) {
  let sequelize;
  // Option 1: Passing parameters separately
  if (process.env.DATABASE_URL) {
    sequelize = new Sequelize(
      'postgres://xkuhxnxspuahmv:9f93069def35df5237f6aece9c0c2e4b073a1f20d967420c2723f1fc1c0a390f@ec2-54-247-85-251.eu-west-1.compute.amazonaws.com:5432/d49agogrvjeoo2'
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
