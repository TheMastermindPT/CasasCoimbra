const bcrypt = require('bcryptjs');
const app = require('express');
const router = app.Router();
import { casas } from '../../client/casas';
const db = require('../../../config/database');

//ROUTES

router.get('/login', (req, res, next) => {
    res.render('login', { 'script': 'login' });
});

router.get('/dashboard', (req, res, next) => {
    res.render('admin', { 'script': 'admin' });
});

router.post('/authentication', (req, res) => {
    let { username, password } = req.body;

    if (username && password) {
        username = username.toLowerCase().trim();
        db.User.findOne({ where: { username: username } }).then(user => {
            if (user) {
                const output = bcrypt.compareSync(password, user.password);
                if (output) {
                    res.cookie('auth', 2);
                    res.redirect('/admin/dashboard');
                    return true;
                }
            }
            res.cookie('auth', 1);
            res.redirect('/admin/login');
        });
    }
});


router.post('/create', (req, res) => {

    let { username, password } = req.body;
    const salt = bcrypt.genSaltSync(10);
    password = bcrypt.hashSync(password, salt);

    if (username && password) {
        username = username.toLowerCase().trim();
        db.User.create({
            'username': username,
            'password': password,
            'foto': null
        }).then(user => {
            res.send('user created!');
        });
    }
});

module.exports = router;