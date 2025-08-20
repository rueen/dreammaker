<!--
 * @Author: diaochan
 * @Date: 2024-06-15 15:02:00
 * @LastEditors: diaochan
 * @LastEditTime: 2025-08-20 23:16:23
 * @Description: 
-->
<template>
  <CustomAudio ref="CustomAudioRef" />
  <CustomVideo ref="CustomVideoRef" />
  <div id="template2" class="container" :style="{'background-image': `url(${data.bgUrl})`}">
    <div class="wrap">
      <div id="title"></div>
      <div id="content"></div>
    </div>
    <CustomButton theme="blue" style="width: 10rem;margin-top: 1rem;" @click="nextStep" v-if="isShowNext && data.children && data.children[0]">下一步</CustomButton>
  </div>
</template>

<script>
import Typed from 'typed.js';
import CustomAudio from '@/components/CustomAudio';
import CustomButton from '@/components/CustomButton.vue'
import CustomVideo from '@/components/CustomVideo.vue';
import { preloadCriticalImages } from '@/utils/imagePreloader'

export default {
  name: 'Template2View',
  props: ['data', 'sceneInfo', 'isInteractive'],
  emits: ['onEnd', 'pauseLaunchAudio', 'playLaunchAudio'],
  components: {
    CustomButton,
    CustomVideo,
    CustomAudio
  },
  data(){
    return {
      isShowNext: false
    }
  },
  mounted() {
    document.getElementById('template2').classList.add('fadeIn');
    if(this.data.audio){
      if(this.isInteractive){
        this.$refs.CustomAudioRef.init(this.data.audio);
      }
      this.$emit('pauseLaunchAudio');
    } else {
      this.$emit('playLaunchAudio');
    }
    if(this.data && this.data.video){
      this.$refs.CustomVideoRef.init(this.data.video)
    }
    new Typed('#title', {
      strings: [
        `${this.data.title}`
      ],
      typeSpeed: 100, // 打印速度
      startDelay: 300, // 开始之前的延迟300毫秒
      loop: false, // 是否循环
      showCursor: false,
      onComplete: () => {
        new Typed('#content', {
          strings: [
            `${this.data.content}`
          ],
          typeSpeed: 100, // 打印速度
          startDelay: 300, // 开始之前的延迟300毫秒
          loop: false, // 是否循环
          showCursor: false,
          onComplete: () => {
            this.isShowNext = true;
          }
        });
      }
    });
    
    // 预加载
    let preload = [];
    let nexItem = this.data.children[0];
    if(nexItem.bgUrl){
      preload.push(nexItem.bgUrl);
    }
    if(nexItem.options && nexItem.options.length){
      nexItem.options.forEach(option => {
        if(option.image){
          preload.push(option.image);
        }
      })
    }
    preloadCriticalImages(preload);
  },
  methods: {
    getInteractive(){
      if(this.data.audio){
        this.$refs.CustomAudioRef.init(this.data.audio);
      }
    },
    nextStep(){
      this.$emit('onEnd', {
        nexItem: this.data.children[0]
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
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  padding-bottom: 12rem;
}
.wrap{
  width: 60%;
  background-color: rgba(0, 0, 0, 0.4);
  padding: 2rem;
  border-radius: .8rem;
  box-sizing: border-box;
}
#title{
  font-size: 2rem;
  color: #fff;
  margin-bottom: 1rem;
}
#content{
  font-size: 1.2rem;
  line-height: 1.8rem;
  color: #fff;
}
</style>
