module.exports = { 

    //開発用
    mode: 'development',
    devtool: 'inline-source-map',

    watch: true,

    entry: './src/GLSL/index_GLSLTest.ts', 
    output: {
      path: __dirname + '/public/source',
      filename: 'index_GLSLTest.js'
    },
    
    module: {
      rules: [
          {
              test: /\.ts$/,
              loader: 'ts-loader'
          },
          {
            test: /\.(jpe?g|png|gif|ico|svg)$/i,
            loader:"url-loader",
            options:{
              limit:2048,
              name:"./img/[name].[ext]"
            }
          }
      ]
    },
    resolve: {
      extensions: ['.ts', '.js']
    }
  };