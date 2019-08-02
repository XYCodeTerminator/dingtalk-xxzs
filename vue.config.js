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
      '/': {
        target: 'http://9bv9xj.natappfree.cc',
        // target: 'http://ytsw.info:4449',
        ws: false,
        changeOrigin: true
      }
    }
  }
}
