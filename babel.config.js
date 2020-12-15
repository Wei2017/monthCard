module.exports = {
  presets: [
    "@vue/cli-plugin-babel/preset"
  ],
  "plugins": [
    ['@babel/plugin-syntax-dynamic-import'],
    ['import',{   //安装 npm i babel-plugin-import -D 并配置 显示vant ui样式
        libraryName: 'vant',
        libraryDirectory: 'es',
        style: true
      },'vant']
  ]
};
