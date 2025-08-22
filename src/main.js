/*
 * @Author: diaochan
 * @Date: 2024-06-15 19:23:52
 * @LastEditors: diaochan
 * @LastEditTime: 2025-08-22 14:28:58
 * @Description: 
 */
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { debounce } from '@/utils/lib'
import faceApiLoader from '@/utils/faceApiLoader'
import 'vue3-toastify/dist/index.css';

// 创建应用实例
const app = createApp(App)

// 应用启动时预加载模型（后台进行，不阻塞界面）
router.beforeEach(async (to, from, next) => {
  // 只在首次进入应用时预加载模型
  if (!from.name && to.path.includes('journey')) {
    console.log('开始预加载Face-API.js模型...');
    // 不等待模型加载完成，让用户界面先显示
    faceApiLoader.preloadModels(['tinyFaceDetector']).then(() => {
      console.log('Face-API.js模型预加载完成');
    }).catch(error => {
      console.warn('Face-API.js模型预加载失败:', error);
    });
  }
  next();
});

app.use(router).mount('#app')

const resize = () => {
  // const screenWidth = window.innerWidth;
  // document.documentElement.style.fontSize = `${parseInt(screenWidth/100)}px`;
  
  // 检测横竖屏状态
  const isLandscape = window.innerWidth > window.innerHeight;
  
  // 检测是否为手机端
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
                   window.innerWidth <= 768;
  
  const appElement = document.getElementById('app');
  
  if (appElement) {
    // 移除之前的横竖屏和设备类型 class
    appElement.classList.remove('landscape', 'portrait', 'mobile', 'desktop');
    
    // 添加当前屏幕方向的 class
    if (isLandscape) {
      appElement.classList.add('landscape');
    } else {
      appElement.classList.add('portrait');
    }
    
    // 添加设备类型 class
    if (isMobile) {
      appElement.classList.add('mobile');
    } else {
      appElement.classList.add('desktop');
    }
  }
}
window.addEventListener('resize', debounce(function() {
  resize();
}, 1000));
resize();