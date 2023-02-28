const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave:false,
  devServer: {
    open: true,
    proxy: {

    }
  },
  // chainWebpack:(config) => {
  //   config.alias.set('@', resolve('src')) 
  // }
})
