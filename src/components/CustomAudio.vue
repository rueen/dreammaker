<!--
 * @Author: diaochan
 * @Date: 2024-06-15 18:02:21
 * @LastEditors: diaochan
 * @LastEditTime: 2024-06-23 10:16:08
 * @Description: 音频
-->
<template>
  <audio ref="audioElement" loop>
    <source :src="src">
  </audio>
  <div class="controls">
    <div class="bar-container" @click="handlePause" v-if="isPlay">
      <div class="bar"></div>
      <div class="bar"></div>
      <div class="bar"></div>
    </div>
    <div class="bar-container bar-container-paused" @click="handlePlay" v-else>
      <div class="bar"></div>
      <div class="bar"></div>
      <div class="bar"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CustomAudio',
  components: {},
  props: [],
  data() {
    return {
      isPlay: true,
      src: null
    };
  },
  mounted() {
    this.audio = this.$refs.audioElement;
  },
  methods: {
    init(src){
      this.audio.src = src;
      if(this.isPlay){
        this.audio.play();
      }
    },
    handlePause(){
      this.audio.pause();
      this.isPlay = false;
    },
    handlePlay(){
      this.audio.play();
      this.isPlay = true;
    }
  }
}
</script>

<style scoped>
.controls{
  position: fixed;
  right: 0;
  top: 0;
  z-index: 2;
  cursor: pointer;
  padding: 20px 30px;
}
.bar-container {
  display: flex;
  align-items: flex-end;
}
.bar {
  width: 4px;
  height: 22px; /* 初始高度 */
  margin: 0 2px;
  background-color: rgba(255,255,255,.4);
  border-radius: 2px;
  animation: jump 1s ease-in-out infinite;
}
.bar:nth-child(1) {
  animation-delay: 0s;
}
.bar:nth-child(2) {
  animation-delay: 0.2s;
}
.bar:nth-child(3) {
  animation-delay: 0.4s;
}
.bar-container-paused .bar{
  animation: none
}
.bar-container-paused .bar:nth-child(1) {
  height: 14px;
}
.bar-container-paused .bar:nth-child(2) {
  height: 18px;
}
@keyframes jump {
  0%, 100% {
    transform: scaleY(1);
  }
  50% {
    transform: scaleY(0.5);
  }
}
</style>