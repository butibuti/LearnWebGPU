module.exports = { 

    //開発用
    mode: 'development',
    devtool: 'inline-source-map',
    //公開用
    //mode: 'production',

    watch: true,

    entry: './src/3DtoDotTool/index_3DtoDotTool.ts', 
    output: {
      path: __dirname + '/public/source',
      filename: 'index_3DtoDotTool.js'
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