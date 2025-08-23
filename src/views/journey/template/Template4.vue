<!--
 * @Author: diaochan
 * @Date: 2024-06-15 15:02:00
 * @LastEditors: diaochan
 * @LastEditTime: 2025-08-23 18:12:56
 * @Description: 
-->
<template>
  <CustomAudio ref="CustomAudioRef" />
  <CustomVideo ref="CustomVideoRef" />
  <Loading text="数据加载中 请耐心等待..." v-if="loading" />
  <div id="template4" class="container" :style="{'background-image': `url(${data.bgUrl})`}">
    <div class="left">
      <div
        class="photo hide"
        v-for="(option, index) in [1,2,3]"
        :key="index"
        :style="{'z-index': `${100 - index}`}"
        @click="handleSelect(index)"
      ><img class="photoImg" :src="info.image" alt=""></div>
    </div>
    <div class="right">
      <div class="rightContent">
        <div class="title hide" id="title">#{{selectedOption.name}}</div>
        <div class="content hide" id="content">{{info.content}}</div>
        <div class="qrCodeWrap hide" id="qrCodeWrap">
          <div class="qrCode">
            <vue-qrcode
              v-if="info.image && info.image.trim()"
              :value="info.image"
              type="image/png"
              :color="{ dark: '#000000ff' }"
            />
            <div v-else class="qrCodePlaceholder">
              <span>暂无二维码</span>
            </div>
          </div>
          <CustomButton theme="blue" @click="reStart">
            <span class="iconfont icon-refresh" style="font-size: 1.2rem;margin-right: 10px;"></span>
            <span>重新体验</span>
          </CustomButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CustomAudio from '@/components/CustomAudio';
import Loading from '@/components/loading';
import VueQrcode from 'vue-qrcode'
import CustomButton from '@/components/CustomButton.vue'
import CustomVideo from '@/components/CustomVideo.vue';
import {post} from '@/server/request';

export default {
  name: 'Template4View',
  props: ['data', 'userInfo', 'selectedOption', 'sceneInfo', 'selectedLastOption', 'isInteractive'],
  emits: ['reStart', 'pauseLaunchAudio', 'playLaunchAudio'],
  components: {
    Loading,
    CustomButton,
    CustomVideo,
    VueQrcode,
    CustomAudio
  },
  data(){
    return {
      loading: false,
      info: {
        content: '',
        image: ''
      },
    }
  },
  async mounted() {
    await this.synthetize();
    document.getElementById('template4').classList.add('fadeIn');
    setTimeout(() => {
      document.querySelectorAll('.photo').forEach((el, index) => {
        // 为每个元素设置不同的旋转角度
        el.style.setProperty('--final-rotate', `${(index + 1) * 10}deg`);
        el.classList.add('fadeInLeft');
      });
    })
    setTimeout(() => {
      document.getElementById('title').classList.add('fadeInDown');
      document.getElementById('content').classList.add('fadeIn');
      document.getElementById('qrCodeWrap').classList.add('fadeIn');
    }, 800)
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
  },
  methods: {
    handleSelect(index){
      // 移除所有元素的 scaleUp 类名
      document.querySelectorAll('.photo').forEach(el => {
        el.classList.remove('active');
      });
      
      // 为选中的元素添加 scaleUp 类名
      const selectedElement = document.querySelectorAll('.photo')[index];
      if (selectedElement) {
        selectedElement.classList.add('active');
      }
    },
    getInteractive(){
      if(this.data.audio){
        this.$refs.CustomAudioRef.init(this.data.audio);
      }
    },
    async synthetize(){
      const { photoPath, activeGender } = this.userInfo;
      this.loading = true;
      const res = await post({
        url: '/site/api/synthetize',
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
        image: '',
        ...(res.Data || {})
      };
      if(this.sceneInfo.generateRule === 2 && this.selectedLastOption && this.selectedLastOption.image){
        this.info.image = this.selectedLastOption.image;
      }
    },
    reStart(){
      this.$emit('reStart');
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
  justify-content: center;
  align-items: center;
}
.hide{
  opacity: 0;
}
.left{
  width: 50%;
  display: flex;
  justify-content: flex-end;
  padding-right: 8rem;
  position: relative;
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
.photo{
  width: 20rem;
  box-shadow: .3rem .1rem .8rem 0 rgba(0, 0, 0, .25);
  transform-origin: 80% 80%;
  cursor: pointer;
  position: absolute;
  right: 30%;
  top: 50%;
  transform: translateY(-50%);
  padding: .5rem;
  background-color: #E6E6E6;
}
.photo.active{
  z-index: 101!important;
}
.photoImg{
  width: 100%;
  vertical-align: middle;
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
.portrait .left{
  width: auto;
  padding: 0 0 2rem 0;
}
.portrait .photo{
  width: 15rem;
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
</style>
