var path = require('path');
var webpack = require('webpack')

console.log(process.argv);

module.exports = {
  entry: './www/flomioPlugin.ts',
  output: {
    libraryTarget: 'commonjs',
    path: path.resolve(__dirname, 'www'),
    filename: 'flomioPlugin.js'
  },
  // devtool: 'inline-source-map',
  externals: [
    'aws-sdk', 'bufferutil', 'utf-8-validate', 'cordova/exec'
  ],
  target: 'web',
  resolve: {
    extensions: ['.ts', '.js']
  },
  plugins: [
  ],
  module: {
      loaders: [{
          test: /\.ts$/,
          exclude: /node_modules\/(?!(ndef-lib)\/).*/,
          use: [
              {
                  loader: 'ts-loader'
              }
          ]
      }]
  }
};
