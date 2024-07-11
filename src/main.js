/*
 * @Author: diaochan
 * @Date: 2024-06-15 19:23:52
 * @LastEditors: diaochan
 * @LastEditTime: 2024-07-11 12:25:54
 * @Description: 
 */
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { debounce } from '@/utils/lib'
import 'vue3-toastify/dist/index.css';

createApp(App).use(router).mount('#app')

const resize = () => {
  const screenWidth = window.innerWidth;
  document.documentElement.style.fontSize = `${parseInt(screenWidth/100)}px`;
}
window.addEventListener('resize', debounce(function() {
  resize();
}, 1000));
resize();