const path = require('path');
const webpack = require('webpack');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const HandlebarsPlugin = require("handlebars-webpack-plugin");

module.exports = {
  entry: {
    home: ['webpack-hot-middleware/client?reload=true', './src/client/home.js'],
    login: ['webpack-hot-middleware/client?reload=true', './src/client/login.js'],
    admin: ['webpack-hot-middleware/client?reload=true', './src/client/admin.js']
  },
  mode: 'development',
  output: {
    filename: '[name]-bundle.js',
    path: path.resolve(__dirname, '../dist'),
    publicPath: 'http://localhost:3000/',
  },
  devServer: {
    contentBase: 'src',
    publicPath: '/',
    overlay: true,
    stats: {
      colors: true,
    },
    hot: true,
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: 'babel-loader',
          },
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.s?[ac]ss$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: { importLoaders: 1 }
          },
          'postcss-loader',
          {
            loader: 'sass-loader',
            options: {
              includePaths: [require('path').resolve(__dirname, 'node_modules')],
            },
          },
        ],
      },
      {
        test: /\.(html)$/,
        use: [
          {
            loader: 'html-loader',
            options: {
              attrs: ['img:src'],
            },
          },
        ],
      },
      {
        test: /\.hbs$/,
        use: [
          {
            loader: "handlebars-loader",
            options: {
              partialDirs: path.join(__dirname, '/../src/views/partials')
            }
          }
        ]
      },
      {
        test: /\.(jpg|png|gif|jpeg|svg|.ico|eot|ttf|woff)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'imgs/[path][name].[ext]',
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.LoaderOptionsPlugin({
      options: {
        handlebarsLoader: {}
      }
    })
  ],
  externals: {
    jquery: 'jQuery',
  },
};
