const Sequelize = require('sequelize');

// Option 1: Passing parameters separately
const sequelize = new Sequelize('casascoimbra', 'root', 'root', {
    host: 'localhost',
    dialect: 'mysql',
    port: 8889
});

//MODELS
const User = require('../models').User;
const Casa = require('../models').Casa;
const Divisao = require('../models').Divisao;
const Foto = require('../models').Foto;


//Connect to DB
sequelize.authenticate().then(() => { console.log('Connected to database'); });

module.exports = { sequelize: sequelize, User: User, Casa: Casa, Foto: Foto, Divisao: Divisao }
