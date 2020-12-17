const path = require('path'); // 引入path模块

const { env: { BASE_URL }, VUE_CLI_SERVICE: { mode } } = process;
const resolve = dir => path.join(__dirname, dir); //path.join(_dirname)设置绝对路径

module.exports = {
  // 修改为相对路径
  publicPath: BASE_URL,
  devServer: {
    headers: { 'Access-Control-Allow-Origin': '*' },
    overlay: {
      // warnings: true,
      errors: true
    },
    proxy: {
      '/api': {
        target: 'https://mtest.scsonic.cn',
        changeOrigin: true,
      }
    }
  },
  css: {
    requireModuleExtension: true, //修改为false 会导致vant-ui样式出不来
    loaderOptions: {
      css: {
        // 这里的选项会传递给 css-loader 否则无法在main.js中引入css样式表
        importLoaders: 1,
      },
      less: {
        // 这里的选项会传递给 postcss-loader
        importLoaders: 1,
      }
    }
  },
  chainWebpack: (config) => {
    config.plugins.delete('preload')
    config.plugins.delete('prefetch')
    config.resolve.alias
      //第一个参数：别名 第二个参数：路径
      .set('components', resolve('src/components'))
      .set('assets', resolve('src/assets'))
      .set('common', resolve('src/common'))
      .set('views', resolve('src/views'))
      .set('network', resolve('src/network'))
  },
  lintOnSave: false
}