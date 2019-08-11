/* eslint-disable import/order */
import express from 'express';
import path from 'path';

// MODULES
const app = express();
const webpack = require('webpack');
const bodyParser = require('body-parser');
const config = require('../../config/webpack.dev');

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
app.use(webpackDevMiddleware);
app.use(webpackHotMiddleware);
const staticMiddleware = express.static('src');
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
    split(context, index) {
      let string = JSON.stringify(context);
      string = trimFirstAndLast(string);
      const fotosPaths = string.split(',');
      return fotosPaths[index];
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
  res.render('home', { script: 'home' });
});

// SERVER
app.listen(3000, () => {
  console.log('Server is listening');
});
