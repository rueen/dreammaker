<!--
 * @Author: diaochan
 * @Date: 2024-06-15 18:02:21
 * @LastEditors: diaochan
 * @LastEditTime: 2024-06-16 14:47:14
 * @Description: 人脸捕捉
-->
<template>
  <div class="faceCamera" :style="{'width': `${width}px`, 'height': `${width}px`}">
    <video ref="refVideo" id="video" :width="width" :height="width" autoplay></video>
    <canvas ref="refCanvas" id="canvas" :width="width" :height="width"></canvas>
    <div class="mask">
      <div class="tips" v-if="tipsContent">{{tipsContent}}</div>
    </div>
    <div class="countdown" v-if="countdown > 0">
      {{ countdown }}
    </div>
    <img :src="imgUrl" alt="" class="imgUrl" v-if="imgUrl">
  </div>
</template>

<script>
require('tracking/build/tracking-min');
require('tracking/build/data/face')

const tracking = window.tracking;

export default {
  name: 'FaceTracking',
  components: {},
  data() {
    return {
      width: parseInt(window.innerWidth/100*25),
      countdown: 0,
      countdownTimer: null,
      tipsContent: null,
      context: null,
      video: null,
      canvas: null,
      tracker: null,
      imgUrl: null
    };
  },
  mounted() {
    document.addEventListener('visibilitychange', this.watchVisibility);
    this.playVideo();
  },
  beforeUnmount(){
    document.removeEventListener('visibilitychange', this.watchVisibility);
    this.pauseVideo();
  },
  methods: {
    watchVisibility() {
      if (document.visibilityState === 'hidden') {
        // 页面不可见，执行相应操作，如暂停视频
        this.pauseVideo();
      } else {
        // 页面可见，执行相应操作，如恢复视频播放
        this.reTrack();
      }
    },
    takePhoto() {
      if(this.$refs.refVideo){
        this.context.drawImage(this.$refs.refVideo, 0, 0, this.width, this.width);
        this.imgUrl = this.saveAsPNG(this.$refs.refCanvas);
        clearInterval(this.countdownTimer);
        this.pauseVideo();
        this.$emit('getPhoto', {
          photo: this.imgUrl,
          cameraWidth: this.width
        });
      }
    },
    saveAsPNG(c) {
      return c.toDataURL('image/png', 0.3)
    },
    reTrack(){
      this.countdown = 0;
      this.countdownTimer = null;
      this.tipsContent = null;
      this.context = null;
      this.video = null;
      this.canvas = null;
      this.tracker = null;
      this.imgUrl = null;
      this.playVideo();
    },
    playVideo(){
      this.video = document.getElementById('video');
      navigator.mediaDevices.getUserMedia({ video: {} }).then(stream => {
        this.video.srcObject = stream;
      });
      this.canvas = document.getElementById('canvas');
      this.context = this.canvas.getContext('2d');
      this.tracker = new tracking.ObjectTracker('face');
      this.tracker.setInitialScale(4);
      this.tracker.setStepSize(2);
      this.tracker.setEdgesDensity(0.1);

      try {
        tracking.track('#video', this.tracker, { camera: true }); // 开始追踪
      } catch (e) {
        console.log('访问用户媒体失败，请重试');
      }

      this.tracker.on('track', (event) => {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        if(!event.data || !event.data.length){
          this.tipsContent = '未检测到人脸';
          clearInterval(this.countdownTimer);
          this.countdown = 0;
          this.flag = false;
        } else {
          this.tipsContent = `检测成功，正在拍照，请保持不动`;
          if(!this.flag){
            this.countdown = 2;
            this.flag = true
            this.countdownTimer = setInterval(() => {
              if (this.countdown > 0) {
                this.countdown--;
              } else {
                this.takePhoto();
                clearInterval(this.countdownTimer);
              }
            }, 1000);
          }
        }
        event.data.forEach((rect) => {
          this.context.strokeStyle = '#a64ceb';
          this.context.strokeRect(rect.x, rect.y, rect.width, rect.height);
        });
      });
    },
    pauseVideo(){
      if(this.countdownTimer){
        clearInterval(this.countdownTimer);
      }
      var video = document.getElementById('video');
      var stream = video.srcObject;
      var tracks = stream ? stream.getTracks() : [];
      tracks.forEach(function(track) {
        track.stop();
      });
      video.srcObject = null;
      video.pause();
    }
    // Base64转文件
    // getBlobBydataURI(dataURI, type) {
    //   var binary = window.atob(dataURI.split(',')[1]);
    //   var array = [];
    //   for(var i = 0; i < binary.length; i++) {
    //       array.push(binary.charCodeAt(i));
    //   }
    //   return new Blob([new Uint8Array(array)], {
    //       type: type
    //   });
    // },
  }
}
</script>

<style scoped>
.faceCamera{
  border-radius: 50%;
  position: relative;
  overflow: hidden;
}
.imgUrl{
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 5;
}
#video{
  position: absolute;
  left: 0;
  top: 0;
  z-index: 1;
  object-fit: cover;
}
#canvas{
  position: absolute;
  left: 0;
  top: 0;
  z-index: 2;
}
.mask{
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 3;
}
.mask .tips{
  color: #fff;
  text-align: center;
  margin-top: 2rem;
  font-size: .8rem;
}
.countdown{
  font-family: Arial, Helvetica, sans-serif;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  font-size: 4rem;
  z-index: 4;
}
</style>