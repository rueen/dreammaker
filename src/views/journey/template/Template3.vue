<!--
 * @Author: diaochan
 * @Date: 2024-06-15 15:02:00
 * @LastEditors: diaochan
 * @LastEditTime: 2025-08-24 16:53:44
 * @Description: 
-->
<template>

  <CustomVideo ref="CustomVideoRef" />
  <div id="template3" class="container" :style="{'background-image': `url(${data.bgUrl})`}">
    <div class="content">
      <div class="page-title">{{ data.title }}</div>
      <div class="options">
        <div
          class="optionItem hide"
          v-for="(option, index) in data.options"
          :id="`option_${option.id}`"
          :key="index"
          :style="{'width': `${optionItemWidth}px`, 'margin-bottom': `${optionItemWidth*0.1}px`}"
          @click="handleSelect(option)">
          <div
            class="imageView"
            :style="{'background-image': `url(${option.image})`, 'height': `${optionItemWidth*1.1}px`}"
            v-if="data.generateRule !== 3"
          >
            <div class="imageView-content" v-if="selectedOption && selectedOption.id === option.id && option.dynamicsImage">
              <!-- 视频格式 -->
              <video
                v-if="isVideoFormat(option.dynamicsImage)"
                class="imageView-video"
                autoplay
                loop
                muted
                playsinline
                webkit-playsinline="true"
                x5-video-player-type="h5"
                x5-video-player-fullscreen="true"
                x5-video-orientation="portrait"
              >
                <source :src="option.dynamicsImage" type="video/mp4">
              </video>
              <!-- 图片格式 -->
              <div 
                v-else
                class="imageView-gif" 
                :style="{'background-image': `url(${option.dynamicsImage})`}"
              ></div>
            </div>
          </div>
          <div class="name">{{ option.name }}</div>
        </div>
      </div>
      <div class="bottom-box">
        <div class="selectedBox" v-if="selectedOption">
          <div class="title">你将选择成为</div>
          <div class="selected">{{selectedOption.name}}</div>
        </div>
        <CustomButton theme="blue" style="width: 10rem;" @click="nextStep" v-if="selectedOption">下一步</CustomButton>
      </div>
    </div>
  </div>
</template>

<script>

import CustomButton from '@/components/CustomButton.vue'
import CustomVideo from '@/components/CustomVideo.vue';
import { preloadCriticalImages } from '@/utils/imagePreloader'
import { preloadVideo } from '@/utils/videoPreloader'


export default {
  name: 'Template3View',
  props: ['data', 'sceneInfo', 'isInteractive'],
  emits: ['onEnd', 'initAudio', 'userInteractive', 'getOption', 'getLastOption'],

  components: {
    CustomButton,
    CustomVideo,

  },
  data(){
    return {
      optionItemWidth: null,
      selectedOption: null,
      isLandscape: window.innerWidth > window.innerHeight,
      animationName: window.innerWidth > window.innerHeight ? 'fadeInDownBig' : 'fadeInLeftBig'
    }
  },
  mounted() {
    document.getElementById('template3').classList.add('fadeIn');
    
    // 通知父组件初始化音频
    this.$emit('initAudio', {
      sceneAudio: this.sceneInfo?.launchAudio,
      plotAudio: this.data?.audio,
      audioLevel: this.data?.audioLevel
    });
    if(this.data && this.data.video){
      this.$refs.CustomVideoRef.init(this.data.video)
    }
    const len = this.data.options.length === 3 ? 3 : 2;
    this.optionItemWidth = this.isLandscape ? parseInt((window.innerWidth*0.6)/this.data.options.length) : parseInt(window.innerWidth*0.86/len);
    this.data.options.forEach((option, index) => {
      const elm = document.getElementById(`option_${option.id}`);
      if(elm){
        setTimeout(() => {
          elm.classList.remove('hide');
          elm.classList.add(this.animationName);
        }, index * 100)
      }
    })

    setTimeout(() => {
      // 预加载图片
      let preload = [];
      let nexItem = this.data.children[0];
      if(nexItem.bgUrl){
        preload.push(nexItem.bgUrl);
      }
      preloadCriticalImages(preload);
      // 预加载视频
      if(nexItem.video){
        preloadVideo(nexItem.video)
      }
    }, 300)
  },
  methods: {
    // 判断文件是否为视频格式
    isVideoFormat(url) {
      if (!url) return false;
      const videoExtensions = ['.mp4', '.webm', '.ogg', '.avi', '.mov', '.wmv', '.flv', '.mkv'];
      const urlLower = url.toLowerCase();
      return videoExtensions.some(ext => urlLower.includes(ext));
    },

    getInteractive(){
      // 通知父组件用户已交互，可以播放音频
      this.$emit('userInteractive', {
        sceneAudio: this.sceneInfo?.launchAudio,
        plotAudio: this.data?.audio,
        audioLevel: this.data?.audioLevel
      });
    },
    handleSelect(option){
      this.selectedOption = {...option};
      const elm = document.getElementById(`option_${option.id}`);
      if(elm){
        this.data.options.forEach((option) => {
          const _elm = document.getElementById(`option_${option.id}`);
          if(_elm){
            _elm.classList.remove('scaleUp');
            _elm.classList.remove(this.animationName);
          }
        })
        elm.classList.add('scaleUp');
      }
    },
    nextStep(){
      const optionId = this.selectedOption.id - 0;
      const children = JSON.parse(JSON.stringify(this.data.children));
      const nexItem = children.find(item => item.optionsId === optionId);
      this.$emit('onEnd', {
        nexItem
      });
      this.$emit('getOption', {
        selectedOption: this.selectedOption
      });
      this.$emit('getLastOption', {
        selectedOption: this.selectedOption
      });
    }
  }
}
</script>

<style scoped>
.container{
  width: 100%;
  height: 100vh;
  background-size: cover;
  position: relative;
}
.container::before{
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,.5);
  z-index: 1;
}
.content{
  position: absolute;
  left: 0;
  top: 0;
  z-index: 2;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.page-title {
  width: 65%;
  font-size: 1.5rem;
  color: #fff;
  position: absolute;
  top: 10%;
  left: 50%;
  transform: translateX(-50%);
}
.options{
  width: 65%;
  display: flex;
  justify-content: space-between;
}
.optionItem{
  background-color: #E6E6E6;
  padding: 1rem;
  box-shadow: 0 6px 6px 0 rgba(0,0,0,.2);
  box-sizing: border-box;
  cursor: pointer;
  overflow: hidden;
  box-sizing: border-box;
}
.hide{
  opacity: 0;
}
.imageView-content{
  width: 100%;
  height: 100%;
}
.imageView-video{
  width: 100%;
  height: 100%;
  object-fit: cover; /* 确保视频覆盖整个背景 */
}
.imageView-gif{
  width: 100%;
  height: 100%;
}
.optionItem .imageView{
  width: 100%;
  background-size: cover;
}
.optionItem .name{
  color: #535F6E;
  font-size: 1rem;
  margin-top: .5rem;
  text-align: center;
}
.bottom-box{
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.selectedBox{
  width: 65%;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  padding-top: 2rem;
}
.selectedBox .title{
  color: #fff;
  font-size: 1rem;
}
.selectedBox .selected{
  font-size: 1.5rem;
  color: #2454C4;
  font-weight: bold;
  margin-top: .2rem;
}
/* 竖屏 */
.portrait .page-title{
  position: absolute;
  text-align: center;
  left: 0;
  top: 5%;
  width: 100%;
  text-align: center;
  transform: none;
}
.portrait .options{
  width: 90%;
  flex-wrap: wrap;
}
.portrait .optionItem{
  padding: .7rem;
}
.portrait .optionItem .name{
  font-size: .8rem;
  margin-top: .3rem;
}
.portrait .bottom-box{
  height: 6rem;
  justify-content: space-between;
}
.portrait .selectedBox{
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding-top: 0;
}
</style>
