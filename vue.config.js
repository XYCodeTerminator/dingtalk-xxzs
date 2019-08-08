module.exports = {
  css: {
    loaderOptions: {
      // 向 CSS 相关的 loader 传递选项
      less: {
        javascriptEnabled: true
      }
    }
  },
  devServer: {
    disableHostCheck: true,
    port: 8080,
    proxy: {
      '/test': {
        target: 'http://reuqg3.natappfree.cc',
        ws: false,
        changeOrigin: true,
        pathRewrite: {
          '^/test': '/'
        }
      },
      '/api': {
        target: 'http://129.211.114.37:4449',
        ws: false,
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/api/v1'
        }
      }
    }
  }
}
