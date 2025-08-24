<template>
  <router-view/>
  <!-- 微信浏览器提示弹窗 -->
  <div v-if="showWechatAlert" class="wechat-alert-overlay" @click="hideWechatAlert">
    <div class="wechat-alert-modal" @click.stop>
      <div class="wechat-alert-header">
        <svg class="wechat-alert-icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
          <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z" fill="#faad14"/>
          <path d="M464 688a48 48 0 1 0 96 0 48 48 0 1 0-96 0zm24-112h48c4.4 0 8-3.6 8-8V296c0-4.4-3.6-8-8-8h-48c-4.4 0-8 3.6-8 8v272c0 4.4 3.6 8 8 8z" fill="#faad14"/>
        </svg>
        <h3>建议使用默认浏览器</h3>
      </div>
      <div class="wechat-alert-content">
        <p>为了获得更好的体验效果，建议您复制链接并使用默认浏览器打开：</p>
        <div class="wechat-alert-steps">
          <div class="step-item">
            <span class="step-number">1</span>
            <span>点击右上角 ⋯ 菜单</span>
          </div>
          <div class="step-item">
            <span class="step-number">2</span>
            <span>选择"在浏览器中打开"</span>
          </div>
        </div>
      </div>
      <div class="wechat-alert-footer">
        <!-- <button class="wechat-alert-btn-secondary" @click="hideWechatAlert">
          继续在微信中使用
        </button> -->
        <button class="wechat-alert-btn-primary" @click="copyCurrentUrl">
          复制链接
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { isWechatBrowser } from '@/utils/lib'

export default {
  name: 'App',
  data() {
    return {
      showWechatAlert: false
    }
  },
  mounted() {
    // 页面加载时检测微信浏览器
    this.checkWechatBrowser()
  },
  methods: {
    checkWechatBrowser() {
      if (isWechatBrowser()) {
        // 检查是否已经显示过提示（使用 sessionStorage）
        const hasShownAlert = sessionStorage.getItem('wechat-alert-shown')
        if (!hasShownAlert) {
          this.showWechatAlert = true
          sessionStorage.setItem('wechat-alert-shown', 'true')
        }
      }
    },
    hideWechatAlert() {
      this.showWechatAlert = false
    },
    async copyCurrentUrl() {
      try {
        const currentUrl = window.location.href
        if (navigator.clipboard && window.isSecureContext) {
          // 使用现代 API
          await navigator.clipboard.writeText(currentUrl)
        } else {
          // 降级方案
          const textArea = document.createElement('textarea')
          textArea.value = currentUrl
          textArea.style.position = 'fixed'
          textArea.style.left = '-999999px'
          textArea.style.top = '-999999px'
          document.body.appendChild(textArea)
          textArea.focus()
          textArea.select()
          document.execCommand('copy')
          textArea.remove()
        }
        
        // 提示复制成功
        this.showCopySuccess()
        
        // 自动隐藏弹窗
        // setTimeout(() => {
        //   this.hideWechatAlert()
        // }, 1500)
      } catch (error) {
        console.error('复制失败:', error)
        alert('复制失败，请手动复制链接')
      }
    },
    showCopySuccess() {
      // 创建临时提示
      const toast = document.createElement('div')
      toast.className = 'copy-success-toast'
      toast.textContent = '链接已复制到剪贴板'
      document.body.appendChild(toast)
      
      // 显示动画
      setTimeout(() => {
        toast.classList.add('show')
      }, 10)
      
      // 自动移除
      setTimeout(() => {
        toast.classList.remove('show')
        setTimeout(() => {
          document.body.removeChild(toast)
        }, 300)
      }, 2000)
    }
  }
}
</script>

<style>
@import url(./assets/iconfont/iconfont.css);
*{
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}
@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
.fadeIn{
  animation: fadeIn .3s linear forwards;
}
@keyframes fadeOut {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
.fadeOut{
  animation: fadeOut .3s linear forwards;
}
@keyframes scaleUp {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(1.1);
    z-index: 10;
  }
}
.scaleUp{
  animation: scaleUp .1s linear forwards;
}
@-webkit-keyframes fadeInDownBig {
  from {
    opacity: 0;
    -webkit-transform: translate3d(0, -2000px, 0);
    transform: translate3d(0, -2000px, 0);
  }

  to {
    opacity: 1;
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
  }
}
@keyframes fadeInDownBig {
  from {
    opacity: 0;
    -webkit-transform: translate3d(0, -2000px, 0);
    transform: translate3d(0, -2000px, 0);
  }

  to {
    opacity: 1;
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
  }
}
.fadeInDownBig {
  animation: fadeInDownBig 1s linear forwards;
}
@-webkit-keyframes fadeInLeftBig {
  from {
    opacity: 0;
    -webkit-transform: translate3d(-2000px, 0, 0);
    transform: translate3d(-2000px, 0, 0);
  }

  to {
    opacity: 1;
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
  }
}
@keyframes fadeInLeftBig {
  from {
    opacity: 0;
    -webkit-transform: translate3d(-2000px, 0, 0);
    transform: translate3d(-2000px, 0, 0);
  }

  to {
    opacity: 1;
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
  }
}
.fadeInLeftBig {
  animation: fadeInLeftBig 1s linear forwards;
}
@-webkit-keyframes fadeInDown {
  from {
    opacity: 0;
    -webkit-transform: translate3d(0, -100%, 0);
    transform: translate3d(0, -100%, 0);
  }

  to {
    opacity: 1;
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
  }
}
@keyframes fadeInDown {
  from {
    opacity: 0;
    -webkit-transform: translate3d(0, -100%, 0);
    transform: translate3d(0, -100%, 0);
  }

  to {
    opacity: 1;
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
  }
}
.fadeInDown {
  animation: fadeInDown .5s linear forwards;
}
@-webkit-keyframes fadeInLeft {
  from {
    opacity: 0;
    -webkit-transform: translate3d(-100%, 0, 0);
    transform: translate3d(-100%, 0, 0);
  }

  to {
    opacity: 1;
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
  }
}
@keyframes fadeInLeft {
  from {
    opacity: 0;
    -webkit-transform: translate3d(-100%, 0, 0);
    transform: translate3d(-100%, 0, 0);
  }

  to {
    opacity: 1;
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
  }
}
.fadeInLeft{
  animation: fadeInLeft 1s linear forwards;
}

/* 微信浏览器提示弹窗样式 */
.wechat-alert-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  padding: 20px;
  animation: fadeIn 0.3s ease-out;
}

.wechat-alert-modal {
  background: #fff;
  border-radius: 16px;
  max-width: 400px;
  width: 100%;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  animation: scaleUpBounce 0.4s ease-out;
  overflow: hidden;
}

@keyframes scaleUpBounce {
  0% {
    transform: scale(0.7);
    opacity: 0;
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.wechat-alert-header {
  padding: 24px 24px 16px;
  text-align: center;
  border-bottom: 1px solid #f0f0f0;
}

.wechat-alert-icon {
  width: 48px;
  height: 48px;
  margin-bottom: 12px;
}

.wechat-alert-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.wechat-alert-content {
  padding: 20px 24px;
}

.wechat-alert-content p {
  font-size: 14px;
  color: #666;
  line-height: 1.5;
  margin-bottom: 16px;
  text-align: center;
}

.wechat-alert-steps {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 16px;
}

.step-item {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  font-size: 14px;
  color: #333;
}

.step-item:last-child {
  margin-bottom: 0;
}

.step-number {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  background: #1890ff;
  color: #fff;
  border-radius: 50%;
  font-size: 12px;
  font-weight: 600;
  margin-right: 12px;
  flex-shrink: 0;
}

.wechat-alert-footer {
  padding: 16px 24px 24px;
  display: flex;
  gap: 12px;
}

.wechat-alert-btn-secondary,
.wechat-alert-btn-primary {
  flex: 1;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  outline: none;
}

.wechat-alert-btn-secondary {
  background: #f5f5f5;
  color: #666;
}

.wechat-alert-btn-secondary:hover {
  background: #e8e8e8;
}

.wechat-alert-btn-primary {
  background: #1890ff;
  color: #fff;
}

.wechat-alert-btn-primary:hover {
  background: #40a9ff;
}

.wechat-alert-btn-primary:active {
  background: #096dd9;
}

/* 复制成功提示 */
.copy-success-toast {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.8);
  color: #fff;
  padding: 12px 20px;
  border-radius: 6px;
  font-size: 14px;
  z-index: 10000;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.copy-success-toast.show {
  opacity: 1;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .wechat-alert-overlay {
    padding: 16px;
  }
  
  .wechat-alert-modal {
    max-width: none;
    margin: 0 auto;
  }
  
  .wechat-alert-header,
  .wechat-alert-content,
  .wechat-alert-footer {
    padding-left: 20px;
    padding-right: 20px;
  }
  
  .wechat-alert-footer {
    flex-direction: column;
  }
  
  .wechat-alert-btn-secondary,
  .wechat-alert-btn-primary {
    padding: 14px 16px;
  }
}
</style>
