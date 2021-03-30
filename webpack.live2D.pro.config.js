var path = require('path');

module.exports = {
  mode: 'production',
  target: ['web', 'es5'],
  entry: './src/live2D/main.ts',

  output: {
    path: __dirname + '/public/source',
    filename: 'index_live2D.js',
  },
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      '@framework': path.resolve(__dirname, './src/live2D/Framework')
    }
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        loader: 'ts-loader'
      }
    ]
  },
}
