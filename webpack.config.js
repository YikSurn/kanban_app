var path = require('path');
var HtmlwebpackPlugin = require('html-webpack-plugin');
var webpack = require('webpack');
var merge = require('webpack-merge');
var Clean = require('clean-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var pkg = require('./package.json');

const TARGET = process.env.npm_lifecycle_event;
const PATHS = {
  app: path.join(__dirname, 'app'),
  build: path.join(__dirname, 'build')
};

process.env.BABEL_ENV = TARGET;

var common = {
  entry: PATHS.app,
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loaders: ['babel'],
        include: PATHS.app,
      }
    ]
  },
  plugins: [
    new HtmlwebpackPlugin({
      title: 'Kanban app'
    })
  ]
}

if (process.env.NODE_ENV === 'development') {
  console.log('developing like an ace');
}

if (TARGET === 'start' || !TARGET) {
  module.exports = merge(common, {
    output: {
      path: PATHS.app,
      filename: 'bundle.js'
    },
    module: {
      loaders: [
        {
          test: /\.css$/,
          loaders: ['style', 'css'],
          include: PATHS.app
        }
      ]
    },
    devtool: 'eval-source-map',
    devServer: {
      histroyApiFallback: true,
      hot: true,
      inline: true,
      progress: true,
      // quiet: true,

      // display only errors to reduce the amount of output
      stats: 'errors-only',

      // parse host and port from env so this is easy
      // to customize
      host: process.env.HOST,
      port: process.env.PORT
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
    ]
  });
}

if (TARGET === 'build' || TARGET === 'stats' || TARGET === 'deploy') {
  module.exports = merge(common, {
    entry: {
      app: PATHS.app,
      vendor: Object.keys(pkg.dependencies)
    },
    output: {
      path: PATHS.build,
      filename: '[name].[hash].js'
      // filename: '[name].[chunckhash].js'
    },
    devtool: 'source-map',
    module: {
      loaders: [
        {
          test: /\.css$/,
          loader: ExtractTextPlugin.extract('style', 'css'),
          include: PATHS.app
        }
      ]
    },
    plugins: [
      new Clean(['build']),
      new ExtractTextPlugin('styles.[hash].css'),
      new webpack.optimize.CommonsChunkPlugin(
        'vendor',
        '[name].[hash].js'
      ),
      new webpack.DefinePlugin({
        // this affects react lib size
        'process.env.NODE_ENV': JSON.stringify('production')
      }),
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false
          // warnings: true
        }
      })
    ]
  });
}
