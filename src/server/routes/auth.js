const bcrypt = require('bcryptjs');
const app = require('express');
const db = require('../../../config/database');

const router = app.Router();
// ROUTES

router.post('/authentication', (req, res) => {
  let { username } = req.body;
  const { password } = req.body;

  if (username && password) {
    username = username.toLowerCase().trim();
    db.User.findOne({ where: { username } }).then(user => {
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
      return false;
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
      username,
      password,
      foto: null
    }).then(() => {
      res.send('user created!');
    });
  }
});

module.exports = router;
