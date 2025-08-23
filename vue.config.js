/*
 * @Author: diaochan
 * @Date: 2024-06-15 15:25:41
 * @LastEditors: diaochan
 * @LastEditTime: 2025-08-23 18:24:58
 * @Description: 
 */
const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: '/dreammaker/',
  devServer: {
    https: true, // 启用HTTPS
    proxy: {
      '/site': {
        target: 'https://unidt.ontheway168.cn', // 目标服务器地址
        changeOrigin: true, // 是否改变源地址
        rewrite: (path) => path.replace(/^\/api/, ''), // 重写路径
      },
    }
  }
})
