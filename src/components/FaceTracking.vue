<!--
 * @Author: diaochan
 * @Date: 2024-06-15 18:02:21
 * @LastEditors: diaochan
 * @LastEditTime: 2025-08-19 19:18:13
 * @Description: 人脸捕捉 - 使用face-api.js，兼容现代主流浏览器
-->
<template>
  <div class="faceCamera" :style="{'width': `${width}px`, 'height': `${width}px`}">
    <video ref="refVideo" id="video" :width="width" :height="width" autoplay muted playsinline></video>
    <canvas ref="refCanvas" id="canvas" :width="width" :height="width"></canvas>
    <div class="mask">
      <div class="tips" v-if="tipsContent && !imgUrl">{{tipsContent}}</div>
    </div>
    <div class="countdown" v-if="countdown > 0">
      {{ countdown }}
    </div>
  </div>
</template>

<script>
import * as faceapi from 'face-api.js'

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
      tipsContent: '正在初始化...',
      context: null,
      video: null,
      canvas: null,
      imgUrl: null,
      flag: false,
      isTracking: false,
      lastDetectionTime: 0,
      modelsLoaded: false,
      stream: null,
      animationFrame: null
    };
  },
  
  async mounted() {
    document.addEventListener('visibilitychange', this.watchVisibility);
    await this.loadModels();
    await this.startCamera();
  },
  
  beforeUnmount(){
    document.removeEventListener('visibilitychange', this.watchVisibility);
    this.stopCamera();
    this.stopDetection();
  },
  
  methods: {
    /**
     * 加载face-api.js模型 - 使用CDN
     */
    async loadModels() {
      try {
        this.tipsContent = '正在加载AI模型...';
        
        // 设置超时时间，避免长时间等待
        const loadPromise = faceapi.nets.tinyFaceDetector.loadFromUri('https://cdn.jsdelivr.net/npm/@vladmandic/face-api@1.7.13/model');
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('模型加载超时')), 8000)
        );
        
        await Promise.race([loadPromise, timeoutPromise]);
        
        this.modelsLoaded = true;
        this.tipsContent = '正在启动摄像头...';
        
      } catch (error) {
        this.modelsLoaded = false;
        this.tipsContent = '正在启动摄像头...';
      }
    },
    
    /**
     * 简单的检测方案（不依赖AI模型）
     */
    useSimpleDetection() {
      this.modelsLoaded = true;
      this.tipsContent = '正在启动摄像头...';
      
      // 重写检测方法为简单的倒计时模式
      this.startSimpleDetection = () => {
        if (!this.isTracking) return;
        
        // 简单模式：检测到视频就开始倒计时
        setTimeout(() => {
          if (this.isTracking && !this.flag) {
            this.tipsContent = '请面向摄像头，即将拍照';
            this.handleFaceDetected();
          }
        }, 2000);
      };
    },
    
    /**
     * 启动摄像头 - 兼容所有现代浏览器
     */
    async startCamera() {
      try {
        this.video = this.$refs.refVideo;
        this.canvas = this.$refs.refCanvas;
        this.context = this.canvas.getContext('2d');
        
        if (!this.video || !this.canvas) {
          throw new Error('视频或Canvas元素未找到');
        }
        
        // 现代浏览器兼容的摄像头访问
        const constraints = {
          video: {
            width: { ideal: 640 },
            height: { ideal: 480 },
            facingMode: 'user'
          }
        };
        
        // 检查浏览器支持
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error('浏览器不支持摄像头功能');
        }
        
        this.stream = await navigator.mediaDevices.getUserMedia(constraints);
        this.video.srcObject = this.stream;
        
        // 等待视频加载完成
        await this.waitForVideoLoad();
        
        // 开始人脸检测（统一使用startDetection，内部会判断使用哪种模式）
        this.startDetection();
        
      } catch (error) {
        console.error('摄像头启动失败:', error);
        this.handleCameraError(error);
      }
    },
    
    /**
     * 等待视频加载完成
     */
    waitForVideoLoad() {
      return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('视频加载超时'));
        }, 10000);
        
        const handleLoad = () => {
          clearTimeout(timeout);
          this.video.removeEventListener('loadedmetadata', handleLoad);
          
          this.videoWidth = this.video.videoWidth;
          this.videoHeight = this.video.videoHeight;
          this.isTracking = true;
          this.tipsContent = null;
          
          resolve();
        };
        
        if (this.video.readyState >= 2) {
          handleLoad();
        } else {
          this.video.addEventListener('loadedmetadata', handleLoad);
        }
        
        // 确保视频开始播放
        this.video.play().catch(() => {
          // 自动播放失败，添加点击事件来启动播放
          this.addPlayClickHandler();
        });
      });
    },
    
    /**
     * 开始人脸检测
     */
    startDetection() {
      if (!this.isTracking) {
        return;
      }
      
      const detectFaces = async () => {
        try {
          if (!this.video || this.video.paused || this.video.ended || !this.isTracking) {
            return;
          }
          
          // 限制检测频率（每200ms检测一次）
          const now = Date.now();
          if (now - this.lastDetectionTime < 200) {
            this.animationFrame = requestAnimationFrame(detectFaces);
            return;
          }
          this.lastDetectionTime = now;
          
          let hasDetection = false;

          // 如果模型加载成功，使用AI检测
          if (this.modelsLoaded && window.faceapi && faceapi.nets.tinyFaceDetector) {
            try {
              const detections = await faceapi
                .detectAllFaces(this.video, new faceapi.TinyFaceDetectorOptions({
                  inputSize: 224,
                  scoreThreshold: 0.3
                }));
              
              // 清除canvas
              this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
              
              if (detections.length > 0) {
                hasDetection = true;
                this.drawDetections(detections);
              }
            } catch (aiError) {
              // AI检测失败，使用简单检测
              hasDetection = true;
            }
          } else {
            // 没有AI模型，直接认为有人脸
            hasDetection = true;
          }
          
          // 处理检测结果
          if (!hasDetection) {
            this.tipsContent = '未检测到人脸，请调整位置';
            this.clearCountdown();
            this.flag = false;
          } else {
            // 检测到人脸，开始倒计时拍照
            if (!this.flag) {
              this.handleFaceDetected();
            }
          }
          
          // 继续检测
          this.animationFrame = requestAnimationFrame(detectFaces);
          
        } catch (error) {
          // 出错也继续，使用简单模式
          if (!this.flag && this.isTracking) {
            this.tipsContent = '请面向摄像头，即将拍照';
            this.handleFaceDetected();
          }
        }
      };
      
      // 立即开始检测
      detectFaces();
    },
    
    /**
     * 处理检测到人脸的情况
     */
    handleFaceDetected() {
      this.tipsContent = '检测成功，正在拍照，请保持不动';
      
      if (!this.flag) {
        this.countdown = 3;
        this.flag = true;
        
        this.countdownTimer = setInterval(() => {
          if (this.countdown > 0) {
            this.countdown--;
          } else {
            this.takePhoto();
            this.clearCountdown();
          }
        }, 1000);
      }
    },
    
    /**
     * 绘制人脸检测框
     */
    drawDetections(detections) {
      if (!detections || detections.length === 0) {
        return;
      }
      
      // 计算缩放比例
      const scaleX = this.canvas.width / this.video.videoWidth;
      const scaleY = this.canvas.height / this.video.videoHeight;
      
      detections.forEach((detection) => {
        const box = detection.box;
        
        // 缩放坐标
        const x = box.x * scaleX;
        const y = box.y * scaleY;
        const width = box.width * scaleX;
        const height = box.height * scaleY;
        
        // 绘制检测框
        this.context.strokeStyle = '#a64ceb';
        this.context.lineWidth = 3;
        this.context.strokeRect(x, y, width, height);
      });
    },
    
    /**
     * 拍照
     */
    takePhoto() {
      try {
        if (!this.video || !this.canvas) return;
        
        // 将视频帧绘制到canvas
        this.context.drawImage(
          this.video, 
          Math.abs((this.videoWidth - this.videoHeight)/2), 
          0, 
          this.videoHeight, 
          this.videoHeight, 
          0, 
          0, 
          this.width, 
          this.width
        );
        
        // 转换为图片
        this.imgUrl = this.canvas.toDataURL('image/png', 0.8);
        
        // 拍照完成后立即关闭摄像头
        this.stopDetection();
        this.stopCamera();
        
        this.tipsContent = '拍照完成';
        
        // 触发回调
        this.$emit('getPhoto', {
          photo: this.imgUrl,
          cameraWidth: this.width
        });
        
      } catch (error) {
        this.tipsContent = '拍照失败，请重试';
      }
    },
    
    /**
     * 重新开始追踪 - 重新打开摄像头
     */
    async reTrack() {
      this.stopDetection();
      this.stopCamera();
      this.resetState();
      
      // 重新启动摄像头
      try {
        this.tipsContent = '正在重新启动摄像头...';
        setTimeout(async () => {
          await this.startCamera();
        }, 300);
      } catch (error) {
        this.handleCameraError(error);
      }
    },
    
    /**
     * 重置状态
     */
    resetState() {
      this.countdown = 0;
      this.countdownTimer = null;
      this.tipsContent = '正在启动摄像头...';
      this.imgUrl = null;
      this.flag = false;
      this.isTracking = false;
      this.lastDetectionTime = 0;
    },
    
    /**
     * 清除倒计时
     */
    clearCountdown() {
      if (this.countdownTimer) {
        clearInterval(this.countdownTimer);
        this.countdownTimer = null;
      }
      this.countdown = 0;
      this.flag = false;
    },
    
    /**
     * 停止人脸检测
     */
    stopDetection() {
      if (this.animationFrame) {
        cancelAnimationFrame(this.animationFrame);
        this.animationFrame = null;
      }
      this.clearCountdown();
    },
    
    /**
     * 停止摄像头
     */
    stopCamera() {
      if (this.stream) {
        this.stream.getTracks().forEach(track => track.stop());
        this.stream = null;
      }
      
      if (this.video && this.video.srcObject) {
        this.video.srcObject = null;
        this.video.pause();
      }
      
      this.isTracking = false;
    },
    
    /**
     * 监听页面可见性变化 - 后台关闭摄像头，前台重新打开
     */
    watchVisibility() {
      if (document.visibilityState === 'hidden') {
        // 页面进入后台，关闭摄像头节省资源
        this.stopDetection();
        this.stopCamera();
      } else {
        // 页面回到前台，重新启动摄像头（如果还没有拍照）
        if (this.modelsLoaded && !this.imgUrl) {
          setTimeout(async () => {
            try {
              this.tipsContent = '正在重新启动摄像头...';
              await this.startCamera();
            } catch (error) {
              this.handleCameraError(error);
            }
          }, 500);
        }
      }
    },
    
    /**
     * 处理摄像头错误
     */
    handleCameraError(error) {
      let errorMessage = '摄像头访问失败';
      
      switch(error.name) {
        case 'NotAllowedError':
          errorMessage = '请允许访问摄像头权限';
          break;
        case 'NotFoundError':
          errorMessage = '未找到摄像头设备';
          break;
        case 'NotReadableError':
          errorMessage = '摄像头被其他应用占用';
          break;
        case 'OverconstrainedError':
          errorMessage = '摄像头不支持请求的配置';
          break;
        case 'SecurityError':
          errorMessage = '请使用HTTPS访问';
          break;
        default:
          if (error.message) {
            errorMessage = error.message;
          }
      }
      
      this.tipsContent = errorMessage;
    },
    
    /**
     * 添加点击播放处理
     */
    addPlayClickHandler() {
      const handleClick = () => {
        this.video.play().then(() => {
          this.tipsContent = null;
          document.removeEventListener('click', handleClick);
        }).catch(() => {
          this.tipsContent = '视频播放失败，请重试';
        });
      };
      
      this.tipsContent = '请点击屏幕启动视频';
      document.addEventListener('click', handleClick);
    }
  }
}
</script>

<style scoped>
.faceCamera{
  border-radius: 50%;
  position: relative;
  overflow: hidden;
}

#video{
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  top: 0;
  z-index: 2;
  object-fit: cover;
}

#canvas{
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  top: 0;
  z-index: 1;
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
  background: rgba(0,0,0,0.5);
  padding: 0.5rem;
  border-radius: 0.3rem;
  margin: 2rem 1rem;
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
  background: rgba(0,0,0,0.3);
  border-radius: 50%;
}
</style>