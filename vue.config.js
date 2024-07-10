/*
 * @Author: diaochan
 * @Date: 2024-06-15 15:25:41
 * @LastEditors: diaochan
 * @LastEditTime: 2024-07-10 22:18:09
 * @Description: 
 */
const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: '/dreammaker/',
  devServer: {
    proxy: {
      '/site': {
        target: 'https://unidt.ontheway168.cn', // 目标服务器地址
        changeOrigin: true, // 是否改变源地址
        rewrite: (path) => path.replace(/^\/api/, ''), // 重写路径
      },
    }
  }
})
