import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { debounce } from '@/utils/lib'

createApp(App).use(router).mount('#app')

const resize = () => {
  const screenWidth = window.innerWidth;
  document.documentElement.style.fontSize = `${parseInt(screenWidth/100)}px`;
}
window.addEventListener('resize', debounce(function() {
  resize();
}, 1000));
resize();