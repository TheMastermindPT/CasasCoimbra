const path = require('path');
const MiniCSSExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = {
  entry: {
    home: './src/client/home.js',
    login: './src/client/login.js',
    admin: './src/client/admin.js'
  },
  mode: 'production',
  output: {
    // filename: 'scripts/[name].[hash].js',
    filename: 'scripts/[name]-bundle.js',
    path: path.resolve(__dirname, '../dist'),
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: 'babel-loader'
          }
        ],
        exclude: /node_modules/
      },
      {
        test: /\.s?[ac]ss$/,
        use: [
          {
            loader: MiniCSSExtractPlugin.loader
          },
          {
            loader: 'css-loader'
          },
          {
            loader: 'postcss-loader'
          },
          {
            loader: 'sass-loader',
            options: {
              includePaths: [path.resolve(__dirname, 'node_modules')]
            }
          }
        ]
      },
      {
        test: /\.hbs$/,
        use: [
          {
            loader: 'handlebars-loader',
            options: {
              partialDirs: path.join(__dirname, '/../src/views/partials')
            }
          }
        ]
      },
      {
        test: /\.(jpg|png|gif|jpeg|.ico|eot|ttf|woff)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: path.join(__dirname, '/../dist/assets/')
            }
          },
          {
            loader: 'image-webpack-loader',
            options: {
              mozjpeg: {
                progressive: true,
                quality: 65
              },
              // optipng.enabled: false will disable optipng
              optipng: {
                enabled: false
              },
              pngquant: {
                quality: '65-90',
                speed: 4
              },
              gifsicle: {
                interlaced: false
              },
              // the webp option will enable WEBP
              webp: {
                quality: 75
              }
            }
          }
        ]
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: path.join(__dirname, '/../dist/assets/svg')
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new OptimizeCssAssetsPlugin(),
    new MiniCSSExtractPlugin({
      filename: 'styles/[name].css'
    })
  ],
  externals: {
    jquery: 'jQuery'
  }
};
