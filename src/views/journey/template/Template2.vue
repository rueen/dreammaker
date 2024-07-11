<!--
 * @Author: diaochan
 * @Date: 2024-06-15 15:02:00
 * @LastEditors: diaochan
 * @LastEditTime: 2024-07-11 19:22:06
 * @Description: 
-->
<template>
  <CustomVideo ref="CustomVideoRef" />
  <div id="template2" class="container" :style="{'background': `url(${data.bgUrl}) no-repeat 0 0`}">
    <div class="wrap">
      <div id="title"></div>
      <div id="content"></div>
    </div>
    <CustomButton theme="blue" style="width: 10rem;" @click="nextStep" v-if="isShowNext">下一步</CustomButton>
  </div>
</template>

<script>
import Typed from 'typed.js';
import CustomButton from '@/components/CustomButton.vue'
import CustomVideo from '@/components/CustomVideo.vue';

export default {
  name: 'Template2View',
  props: ['data'],
  emits: ['onEnd', 'getAudio'],
  components: {
    CustomButton,
    CustomVideo
  },
  data(){
    return {
      isShowNext: false
    }
  },
  mounted() {
    document.getElementById('template2').classList.add('fadeIn');
    this.$emit('getAudio', {
      src: this.data.audio
    })
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
      onComplete: () => {
        new Typed('#content', {
          strings: [
            `${this.data.content}`
          ],
          typeSpeed: 100, // 打印速度
          startDelay: 300, // 开始之前的延迟300毫秒
          loop: false, // 是否循环
          onComplete: () => {
            this.isShowNext = true;
          }
        });
      }
    });
  },
  methods: {
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
  background-size: 100% auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #EEF0F2;
}
.wrap{
  width: 60%;
}
#title{
  font-size: 2rem;
  color: #fff;
}
#content{
  font-size: 1rem;
  line-height: 1.8rem;
  color: #fff;
}
</style>
