'use strict';

const path = require('path');
const DashboardPlugin = require('webpack-dashboard/plugin');
// const webpack = require('webpack');
// const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
// const JavaScriptObfuscator = require('webpack-obfuscator');
// const ExtractTextPlugin = require('extract-text-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const isProd = process.env.NODE_ENV === 'production';
// var BrotliPlugin = require('brotli-webpack-plugin');

module.exports = [{
  context: path.join(__dirname, '../../'),
  entry: {
    main: './src/client/ts/main',
    // 'main.min': './src/client/ts/main'
  },
  output: {
    path: path.resolve(__dirname, '../../dist/assets/js'),
    filename: '[name].js',
    library: '[name]',
    publicPath: 'dist/assets/js/',
    chunkFilename: 'modules/module-[name].js',
  },

  // Enable sourcemaps for debugging webpack's output.
  devtool: isProd ? false : 'inline-source-map',

  resolve: {
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: ['.ts', '.tsx', '.js', '.json'],
  },

  module: {
    rules: [
      // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
      {
        test: /\.tsx?$/,
        exclude: /\.?(test|spec)\.tsx?$/,
        use: ['ts-loader']
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader'],
      },
    ],
  },
  optimization: {
    minimize: isProd,
    namedModules: true,
    namedChunks: true,
    // runtimeChunk: true,

    splitChunks: {
      // // // include all types of chunks
      // // chunks: 'all',
      // // // name(module) {
      // // //   // console.log('---MODULE', module.rawRequest.replace(/(\.|\/|!|index.ts|node_modules)/g, ''));
      // // //   // return module.rawRequest.replace(/(\.|\/|!|index.ts|node_modules)/g, '');
      // // //   return;
      // // // }
      chunks: 'async',
      minSize: 10000,
      maxSize: 0,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      // automaticNameDelimiter: '~',
      // name: true,
      // // cacheGroups: {
      // // vendor: {
      // //   chunks: 'initial',
      // //   name: 'vendor',
      // //   test: 'vendor',
      // //   enforce: true
      // // reuseExistingChunk: true,
      // // },
      // // commons: {
      // //   test: /[\\/]node_modules[\\/]/,
      // //   name: 'vendors',
      // //   chunks: 'all',
      // // reuseExistingChunk: true,
      // // },
      // // default: {
      // //   minChunks: 2,
      // //   priority: -20,
      // //   reuseExistingChunk: true,
      // // },
      // // },
    },
    // minimizer: [
    //   new UglifyJsPlugin({
    //     include: /\.min\.js$/
    //   })
    // ]
  },
  plugins: isProd ? [
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
    }),
    // new JavaScriptObfuscator({
    //   rotateUnicodeArray: true
    // }),
  ]
    :
    [
      new DashboardPlugin(),

    ],
}];
