const path = require('path'); // 引入path模块
function resolve(dir) {
  return path.join(__dirname, dir) //path.join(_dirname)设置绝对路径
}
module.exports = {
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