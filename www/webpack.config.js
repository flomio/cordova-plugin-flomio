var path = require('path');

module.exports = {
  entry: './flomioPlugin.ts',
  output: {
    libraryTarget: 'commonjs',
    path: path.resolve(__dirname, 'build'),
    filename: 'flomioPlugin.js'
  },
  externals: [
      "cordova",
      "cordova/exec"
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
          exclude: /node_modules/,
          use: [
              {
                  loader: 'ts-loader'
              }
          ]
      }]
  }
};
