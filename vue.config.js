module.exports = {
  css: {
    loaderOptions: {
      // 向 CSS 相关的 loader 传递选项
      less: {
        javascriptEnabled: true
      }
    }
  }
  // devServer: {
  //   disableHostCheck: true,
  //   port: 8080,
  //   proxy: {
  //     '/api': {
  //       // target: 'http://129.211.114.37:4449',
  //       target: 'http://10.88.120.154:4449',
  //       ws: false,
  //       changeOrigin: true,
  //       pathRewrite: {
  //         '^/api': '/api/v1'
  //       }
  //     }
  //   }
  // }
}
