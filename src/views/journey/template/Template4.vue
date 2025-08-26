<!--
 * @Author: diaochan
 * @Date: 2024-06-15 15:02:00
 * @LastEditors: diaochan
 * @LastEditTime: 2025-08-26 18:46:23
 * @Description: 
-->
<template>

  <CustomVideo ref="CustomVideoRef" />
  <Loading text="数据加载中 请耐心等待..." v-if="loading" />
  <div id="template4" class="container" :style="{'background-image': `url(${data.bgUrl})`}">
    <div class="left">
      <!-- 图片加载中状态 -->
      <div v-if="isCarouselLoading" class="imageCarousel carousel-loading">
        <div class="loading-content">
          <div class="loading-spinner"></div>
          <p class="loading-text">图片生成中...</p>
          <div class="loading-progress">
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: loadingProgress + '%' }"></div>
            </div>
            <span class="progress-text">{{ loadedCount }}/{{ totalCount }}</span>
          </div>
        </div>
      </div>
      
      <!-- 图片轮播组件 -->
      <ImageCarousel
        v-else
        :images="images"
        :auto-play="true"
        :auto-play-interval="4000"
        :visible-count="3"
        :height="imageCarouselHeight"
        class="imageCarousel"
      />
    </div>
    <div class="right">
      <div class="rightContent">
        <div class="title hide" id="title">#{{selectedOption.name}}</div>
        <div class="content hide" id="content">{{info.content}}</div>
        <div class="qrCodeWrap hide" id="qrCodeWrap">
          <div class="qrCode">
            <vue-qrcode
              v-if="images && images.length && !isCarouselLoading"
              :value="galleryUrl"
              type="image/png"
              :color="{ dark: '#000000ff' }"
            />
            <div v-else class="qrCodePlaceholder">
              <span v-if="isCarouselLoading">图片生成中...</span>
              <span v-else>暂无二维码</span>
            </div>
          </div>
          <div class="btnbox">
            <CustomButton theme="yellow" @click="handlePrint">
              <span class="iconfont icon-printer" style="font-size: 1.5rem;margin-right: 10px;"></span>
              <span>打印照片</span>
            </CustomButton>
            <CustomButton theme="blue" @click="reStart">
              <span class="iconfont icon-refresh" style="font-size: 1.2rem;margin-right: 10px;"></span>
              <span>重新体验</span>
            </CustomButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import Loading from '@/components/loading';
import VueQrcode from 'vue-qrcode'
import CustomButton from '@/components/CustomButton.vue'
import CustomVideo from '@/components/CustomVideo.vue';
import ImageCarousel from '@/components/ImageCarousel.vue';
import {post} from '@/server/request';


export default {
  name: 'Template4View',
  props: ['data', 'userInfo', 'selectedOption', 'sceneInfo', 'isInteractive', 'syntheticImages'],
  emits: ['reStart', 'initAudio', 'userInteractive', 'printPhoto'],

  components: {
    Loading,
    CustomButton,
    CustomVideo,
    VueQrcode,
    ImageCarousel
  },
  data(){
    return {
      loading: false,
      info: {
        content: '',
        image: ''
      },
      images: [],
      imageCarouselHeight: window.innerWidth > window.innerHeight ? 'auto' : window.innerWidth
    }
  },
  computed: {
    // 生成图片集合页面的URL
    galleryUrl() {
      if (!this.images || this.images.length === 0) {
        return '';
      }
      
      // 获取当前域名和协议
      const baseUrl = window.location.origin;
      const pathname = window.location.pathname;
      
      // 限制图片数量，最多10张，避免URL过长
      const maxImagesForGallery = 10;
      const limitedImages = this.images.slice(0, maxImagesForGallery);
      
      // 编码图片URL参数
      const imageParams = limitedImages
        .map(imageUrl => encodeURIComponent(imageUrl))
        .join(',');
        
        // console.log(`${baseUrl}${pathname}#/gallery?images=${imageParams}`)
      // 生成完整的图片集合页面URL
      return `${baseUrl}${pathname}#/gallery?images=${imageParams}`;
    },
    
    // 判断是否需要显示加载状态
    isCarouselLoading() {
      if (!this.syntheticImages || this.syntheticImages.length === 0) {
        return false;
      }
      
      // 如果有任何项目的loading为true，则显示加载状态
      return this.syntheticImages.some(item => item.loading === true);
    },
    
    // 计算已加载的图片数量
    loadedCount() {
      if (!this.syntheticImages || this.syntheticImages.length === 0) {
        return 0;
      }
      
      return this.syntheticImages.filter(item => !item.loading && item.img).length;
    },
    
    // 计算总图片数量
    totalCount() {
      return this.syntheticImages ? this.syntheticImages.length : 0;
    },
    
    // 计算加载进度百分比
    loadingProgress() {
      if (this.totalCount === 0) {
        return 0;
      }
      
      return Math.round((this.loadedCount / this.totalCount) * 100);
    }
  },
  watch: {
    // 监听syntheticImages变化，实时更新images数组
    syntheticImages: {
      handler(newValue) {
        if (newValue && newValue.length > 0) {
          // 只包含已加载完成的图片
          this.images = newValue
            .filter(item => !item.loading && item.img)
            .sort((a, b) => a.sort - b.sort)
            .map(item => item.img);
        }
      },
      deep: true,
      immediate: true
    }
  },
  async mounted() {
    // images已经在watcher中处理，这里只需要处理其他逻辑
    await this.synthetize();
    document.getElementById('template4').classList.add('fadeIn');
    setTimeout(() => {
      document.getElementById('title').classList.add('fadeInDown');
      document.getElementById('content').classList.add('fadeIn');
      document.getElementById('qrCodeWrap').classList.add('fadeIn');
    }, 800)
    // 通知父组件初始化音频
    this.$emit('initAudio', {
      sceneAudio: this.sceneInfo?.launchAudio,
      plotAudio: this.data?.audio,
      audioLevel: this.data?.audioLevel
    });
    if(this.data && this.data.video){
      this.$refs.CustomVideoRef.init(this.data.video)
    }
  },
  methods: {
    getInteractive(){
      // 通知父组件用户已交互，可以播放音频
      this.$emit('userInteractive', {
        sceneAudio: this.sceneInfo?.launchAudio,
        plotAudio: this.data?.audio,
        audioLevel: this.data?.audioLevel
      });
    },
    async synthetize(){
      const { photoPath, activeGender } = this.userInfo;
      this.loading = true;
      const res = await post({
        url: '/site/api/aiContent',
        params: {
          id: this.data.id,
          img: photoPath,
          gender: activeGender.text
        }
      })
      setTimeout(() => {
        this.loading = false;
      })
      // 确保返回的数据有默认值，避免undefined错误
      this.info = {
        content: '',
        ...(res.Data || {})
      };
    },
    reStart(){
      this.$emit('reStart');
    },
    handlePrint(){
      this.$emit('printPhoto');
    }
  }
}
</script>

<style scoped>
.container{
  width: 100%;
  height: 100vh;
  background-size: cover;
  background-position: center center;
  display: flex;
  justify-content: center;
  align-items: center;
}
.hide{
  opacity: 0;
}
.left{
  width: 50%;
}
.imageCarousel{
  width: 40%;
  position: absolute;
  left: 10%;
  top: 50%;
  transform: translateY(-50%);
}
.right{
  width: 50%;
}
.rightContent{
  width: 70%;
  background-color: #fff;
  padding: 2rem;
  box-sizing: border-box;
  border-radius: 0.6rem;
  box-shadow: .3rem .1rem .8rem 0 rgba(0, 0, 0, .25);
}
.title{
  color: #2F52C1;
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 2rem;
}
.content{
  color: #535F6E;
  font-size: 1.26rem;
  margin-bottom: 2rem;
}
.qrCodeWrap{
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}
.qrCode{
  width: 8rem;
  height: 8rem;
  background-color: #D9D9D9;
}
.qrCode img{
  width: 100%;
}
.qrCodePlaceholder{
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
  border: 2px dashed #ddd;
  color: #999;
  font-size: 0.9rem;
}
.btnbox{
  flex: 1;
  display: flex;
  justify-content: space-around;
  align-items: center;
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
  animation: fadeIn 1s linear forwards;
}
@-webkit-keyframes fadeInLeft {
  0% {
    opacity: 0;
    -webkit-transform: translate3d(-100%, -50%, 0);
    transform: translate3d(-100%, -50%, 0);
  }

  70% {
    opacity: 1;
    -webkit-transform: translate3d(0, -50%, 0);
    transform: translate3d(0, -50%, 0);
  }
  100%{
    opacity: 1;
    -webkit-transform: translate3d(0, -50%, 0) rotate(var(--final-rotate, 5deg));
    transform: translate3d(0, -50%, 0) rotate(var(--final-rotate, 5deg));
  }
}
@keyframes fadeInLeft {
  0% {
    opacity: 0;
    -webkit-transform: translate3d(-100%, -50%, 0);
    transform: translate3d(-100%, -50%, 0);
  }

  70% {
    opacity: 1;
    -webkit-transform: translate3d(0, -50%, 0);
    transform: translate3d(0, -50%, 0);
  }
  100%{
    opacity: 1;
    -webkit-transform: translate3d(0, -50%, 0) rotate(var(--final-rotate, 5deg));
    transform: translate3d(0, -50%, 0) rotate(var(--final-rotate, 5deg));
  }
}
.fadeInLeft{
  animation: fadeInLeft 1s linear forwards;
}
/* 竖屏 */
.portrait .container{
  flex-direction: column;
}
.portrait .imageCarousel{
  width: 100%;
  position: static;
  transform: none;
}
.portrait .left{
  width: 100%;
}
.portrait .right{
  width: 100%;
  display: flex;
  justify-content: center;
}
.portrait .rightContent{
  width: 90%;
  padding: 1rem;
}
.portrait .rightContent .title{
  font-size: 1.2rem;
  margin-bottom: .8rem;
}
.portrait .rightContent .content{
  font-size: 1rem;
  margin-bottom: .8rem;
}
.portrait .rightContent .qrCode{
  width: 7rem;
  height: 7rem;
}
.portrait .btnbox{
  height: 7rem;
  flex-direction: column;
  justify-content: space-between;
}

/* ImageCarousel Loading 样式 */
.carousel-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  /* background: rgba(255, 255, 255, 0.95); */
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  width: 30%;
}

.loading-content {
  text-align: center;
  padding: 40px 30px;
  max-width: 300px;
}

.loading-spinner {
  width: 60px;
  height: 60px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #2F52C1;
  border-radius: 50%;
  animation: carouselSpin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes carouselSpin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text {
  font-size: 1.1rem;
  color: #2F52C1;
  font-weight: 600;
  margin: 0 0 20px 0;
}

.loading-progress {
  margin-top: 20px;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background-color: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 10px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #2F52C1 0%, #4A90E2 100%);
  border-radius: 4px;
  transition: width 0.3s ease;
  position: relative;
}

.progress-fill::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
  animation: progressShine 1.5s infinite;
}

@keyframes progressShine {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.progress-text {
  font-size: 0.9rem;
  color: #666;
  font-weight: 500;
}

/* 竖屏模式下的loading样式调整 */
.portrait .carousel-loading .loading-content {
  padding: 30px 20px;
}

.portrait .carousel-loading .loading-spinner {
  width: 50px;
  height: 50px;
  margin-bottom: 15px;
}

.portrait .carousel-loading .loading-text {
  font-size: 1rem;
}
</style>
