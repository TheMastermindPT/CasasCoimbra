/* eslint-disable import/order */

// MODULES
// require('dotenv').config();

const PORT = process.env.PORT || 5000;
const isProd = process.env.NODE_ENV === 'production' || null;
const express = require('express');
const path = require('path');

const app = express();
const webpack = require('webpack');
const bodyParser = require('body-parser');
const config = require('../../config/webpack.dev');
const db = require('../../models');
const http = require('http');

const compiler = webpack(config);
const webpackDevMiddleware = require('webpack-dev-middleware')(
  compiler,
  config.devServer
);
const webpackHotMiddleware = require('webpack-hot-middleware')(compiler);
const cookieParser = require('cookie-parser');
const exphbs = require('express-handlebars');
const auth = require('./routes/auth');
const api = require('./routes/api');

// MIDDLEWARES
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

app.use(bodyParser.json());
app.use(cookieParser());
if (!isProd) {
  app.use(webpackDevMiddleware);
  app.use(webpackHotMiddleware);
}
const staticMiddleware = express.static('dist');
app.use(staticMiddleware);

const trimFirstAndLast = string => {
  string = string.replace(/"/g, '');
  return string;
};

const hbs = exphbs.create({
  extname: 'hbs',
  defaultLayout: 'main',
  layoutsDir: path.join(process.cwd(), '/src/views/layouts'),
  partialsDir: path.join(process.cwd(), '/src/views/partials'),
  helpers: {
    indexed(context, index) {
      let string = JSON.stringify(context[index].path);
      string = trimFirstAndLast(string);
      return string;
    },
    json(context) {
      let string = JSON.stringify(context);
      string = trimFirstAndLast(string);
      return string;
    }
  }
});

app.engine('hbs', hbs.engine);

app.set('views', path.join(process.cwd(), '/src/views'));
app.set('view engine', 'hbs');

// ROUTES
app.use('/admin', auth);
app.use('/api/casas', api);

app.get('/', (req, res, next) => {
  res.render('home', {
    script: 'home',
    host() {
      if (!isProd) {
        return `http://localhost:${PORT}`;
      }
      return '/scripts';
    },
    style() {
      if (isProd) {
        return '/styles/home.css';
      }
    }
  });
});

app.get('/admin/login', (req, res) => {
  res.render('login', {
    script: 'login',
    host() {
      if (!isProd) {
        return `http://localhost:${PORT}`;
      }
      return '/scripts';
    },
    style() {
      if (isProd) {
        return '/styles/login.css';
      }
    }
  });
});

app.get('/admin/dashboard', (req, res) => {
  res.render('admin', {
    script: 'admin',
    host() {
      if (!isProd) {
        return `http://localhost:${PORT}`;
      }
      return '/scripts';
    },
    style() {
      if (isProd) {
        return '/styles/admin.css';
      }
    }
  });
});

// SERVER
db.sequelize.sync().then(function() {
  http.createServer(app).listen(PORT, function() {
    console.log(`Express server listening on port ${PORT}`);
  });
});

// SERVER
// app.listen(PORT, () => {
//   console.log('Server is listening');
// });
