<!--
 * @Author: diaochan
 * @Date: 2024-06-15 18:02:21
 * @LastEditors: diaochan
 * @LastEditTime: 2024-07-22 10:27:11
 * @Description: 人脸捕捉
-->
<template>
  <div class="faceCamera" :style="{'width': `${width}px`, 'height': `${width}px`}">
    <video ref="refVideo" id="video" :width="width" :height="width" autoplay muted></video>
    <canvas ref="refCanvas" id="canvas" :width="width" :height="width"></canvas>
    <div class="mask">
      <div class="tips" v-if="tipsContent && !imgUrl">{{tipsContent}}</div>
    </div>
    <div class="countdown" v-if="countdown > 0">
      {{ countdown }}
    </div>
    <!-- <img :src="imgUrl" alt="" class="imgUrl" v-if="imgUrl"> -->
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
      videoWidth: parseInt(window.innerWidth/100*25),
      videoHeight: parseInt(window.innerWidth/100*25),
      countdown: 0,
      countdownTimer: null,
      tipsContent: null,
      context: null,
      video: null,
      canvas: null,
      tracker: null,
      imgUrl: null,
      flag: false,
      isTracking: false,
      lastTrackTime: 0
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
        this.context.drawImage(this.$refs.refVideo, Math.abs((this.videoWidth - this.videoHeight)/2), 0, this.videoHeight, this.videoHeight, 0, 0, this.width, this.width);
        this.imgUrl = this.saveAsPNG(this.$refs.refCanvas);
        clearInterval(this.countdownTimer);
        
        // 性能优化：拍照完成后立即停止追踪以节省CPU
        this.pauseVideo();
        
        this.$emit('getPhoto', {
          photo: this.imgUrl,
          cameraWidth: this.width
        });
      }
    },
    saveAsPNG(c) {
      return c.toDataURL('image/png', 0.5)
    },
    reTrack(){
      // 先清理现有资源
      this.pauseVideo();
      
      // 重置所有状态
      this.countdown = 0;
      this.countdownTimer = null;
      this.tipsContent = '正在启动摄像头...';
      this.context = null;
      this.video = null;
      this.canvas = null;
      this.tracker = null;
      this.imgUrl = null;
      this.flag = false;
      this.isTracking = false;
      this.lastTrackTime = 0;
      
      // 稍微延迟重新开始，确保资源完全释放
      setTimeout(() => {
        this.playVideo();
      }, 100);
    },
    playVideo(){
      this.video = document.getElementById('video');
      navigator.mediaDevices.getUserMedia({ video: {} }).then(stream => {
        this.video.srcObject = stream;
        // 性能优化：使用更高效的视频加载检测
        let i = 0;
        const timer = setInterval(() => {
          if(this.video.videoWidth && this.video.videoWidth > 0){
            clearInterval(timer);
            this.videoWidth = this.video.videoWidth;
            this.videoHeight = this.video.videoHeight;
            this.isTracking = true;
          } else if(i > 30){ // 减少重试次数从50到30
            clearInterval(timer);
            console.log('video加载失败')
            this.tipsContent = '视频加载失败，请刷新页面重试';
          } else {
            i += 1;
          }
        }, 150) // 增加检测间隔从100ms到150ms
      });
      this.canvas = document.getElementById('canvas');
      this.context = this.canvas.getContext('2d');
      this.tracker = new tracking.ObjectTracker('face');
      this.tracker.setInitialScale(3.5); // 稍微降低初始缩放，有助于检测更多尺寸的人脸
      this.tracker.setStepSize(3); // 平衡性能和精度：从原来的2改为3
      this.tracker.setEdgesDensity(0.08); // 适中的边缘密度：从0.1降到0.08，保持检测准确性

      try {
        tracking.track('#video', this.tracker, { camera: true }); // 开始追踪
      } catch (e) {
        console.log('访问用户媒体失败，请重试');
      }

      this.tracker.on('track', (event) => {
        // 性能优化：限制追踪频率，平衡性能和检测准确性
        const currentTime = Date.now();
        if (currentTime - this.lastTrackTime < 80) { // 从100ms调整到80ms，提高检测频率
          return;
        }
        this.lastTrackTime = currentTime;
        
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        if(!event.data || !event.data.length){
          this.tipsContent = '未检测到人脸，请调整位置';
          clearInterval(this.countdownTimer);
          this.countdown = 0;
          this.flag = false;
        } else {
          this.tipsContent = `检测成功，正在拍照，请保持不动`;
          if(!this.flag){
            this.countdown = 3; // 增加倒计时时间到3秒，给用户更多准备时间
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
        
        // 性能优化：减少绘制操作
        if(event.data && event.data.length > 0) {
          event.data.forEach((rect) => {
            this.context.strokeStyle = '#a64ceb';
            this.context.strokeRect(rect.x, rect.y, rect.width, rect.height);
          });
        }
      });
    },
    pauseVideo(){
      if(this.countdownTimer){
        clearInterval(this.countdownTimer);
      }
      
      // 性能优化：停止追踪器以释放CPU资源
      if(this.tracker){
        try {
          this.tracker.removeAllListeners('track');
        } catch(e) {
          console.log('移除追踪监听器失败');
        }
      }
      
      var video = document.getElementById('video');
      if(video) {
        var stream = video.srcObject;
        var tracks = stream ? stream.getTracks() : [];
        tracks.forEach(function(track) {
          track.stop();
        });
        video.srcObject = null;
        video.pause();
      }
      
      this.isTracking = false;
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
  left: 50%;
  transform: translateX(-50%);
  top: 0;
  z-index: 1;
  object-fit: cover;
}
#canvas{
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
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