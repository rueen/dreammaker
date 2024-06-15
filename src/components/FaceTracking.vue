<!--
 * @Author: diaochan
 * @Date: 2024-06-15 18:02:21
 * @LastEditors: diaochan
 * @LastEditTime: 2024-06-15 18:50:37
 * @Description: 
-->
<template>
  <div class="container">
    <div @click="start">打开摄像头</div>
    <video id="video" width="640" height="480" autoplay></video>
    <div id="overlay" v-if="countdown > 0">
      {{ countdown }}
    </div>
  </div>
</template>

<script>
import tracking from 'tracking.js';

export default {
  name: 'FaceTracking',
  components: {},
  data() {
    return {
      countdown: 3,
      tracker: null,
      video: null,
      canvas: null,
      context: null
    };
  },
  mounted() {
    this.video = document.getElementById('video');
    navigator.mediaDevices.getUserMedia({ video: {} }).then(stream => {
      this.video.srcObject = stream;
    });

    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d');
    this.tracker = new tracking.ObjectTracker('face');
    this.tracker.on('track', event => {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      event.data.forEach(rect => {
        if (rect.x && rect.y && rect.width && rect.height) {
          this.context.strokeStyle = '#a64ceb';
          this.context.strokeRect(rect.x, rect.y, rect.width, rect.height);
        }
      });
    });

    this.video.addEventListener('play', () => {
      tracking.track(this.video, this.tracker);
    });

    this.countdownTimer = setInterval(() => {
      if (this.countdown > 0) {
        this.countdown--;
      } else {
        this.takePhoto();
        clearInterval(this.countdownTimer);
      }
    }, 1000);
  },
  methods: {
    takePhoto() {
      // 这里可以添加拍照逻辑，例如使用 canvas.toDataURL 保存图像
      // 然后你可以将图像发送到服务器或进行其他处理
    }
  }
}
</script>

<style scoped>
.container{
  width: 100%;
  height: 100vh;
  background: url(@/assets/bg/bg1.jpg) no-repeat 0 0;
  background-size: 100% auto;
}
#capture-container {
  position: relative;
}
#overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 48px;
  color: white;
}
</style>