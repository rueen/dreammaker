<!--
 * @Author: diaochan
 * @Date: 2024-06-15 15:02:00
 * @LastEditors: diaochan
 * @LastEditTime: 2024-07-25 10:02:23
 * @Description: 
-->
<template>
  <CustomAudio ref="CustomAudioRef" />
  <CustomVideo ref="CustomVideoRef" />
  <Loading text="数据加载中 请耐心等待..." v-if="loading" />
  <div id="template4" class="container" :style="{'background-image': `url(${data.bgUrl})`}">
    <div class="left">
      <div class="photo hide" id="photo"><img class="photoImg" :src="info.image" alt=""></div>
    </div>
    <div class="right">
      <div class="rightContent">
        <div class="title hide" id="title">#{{selectedOption.name}}</div>
        <div class="content hide" id="content">{{info.content}}</div>
        <div class="qrCodeWrap hide" id="qrCodeWrap">
          <div class="qrCode">
            <vue-qrcode
              :value="info.image"
              type="image/png"
              :color="{ dark: '#000000ff' }"
            />
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
  props: ['data', 'userInfo', 'selectedOption', 'sceneInfo', 'selectedLastOption'],
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
      }
    }
  },
  async mounted() {
    await this.synthetize();
    document.getElementById('template4').classList.add('fadeIn');
    setTimeout(() => {
      document.getElementById('photo').classList.add('fadeInLeft');
    })
    setTimeout(() => {
      document.getElementById('title').classList.add('fadeInDown');
      document.getElementById('content').classList.add('fadeIn');
      document.getElementById('qrCodeWrap').classList.add('fadeIn');
    }, 800)
    if(this.data.audio){
      this.$refs.CustomAudioRef.init(this.data.audio);
      this.$emit('pauseLaunchAudio');
    } else {
      this.$emit('playLaunchAudio');
    }
    if(this.data && this.data.video){
      this.$refs.CustomVideoRef.init(this.data.video)
    }
  },
  methods: {
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
      this.info = res.Data || {};
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
}
.right{
  width: 50%;
}
.rightContent{
  width: 70%;
}
.photo{
  width: 20rem;
  /* background-color: #E6E6E6; */
  box-shadow: .3rem .1rem .8rem 0 rgba(0, 0, 0, .25);
  transform: rotate(5deg);
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
  from {
    opacity: 0;
    -webkit-transform: translate3d(-100%, 0, 0);
    transform: translate3d(-100%, 0, 0);
  }

  to {
    opacity: 1;
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
  }
}
@keyframes fadeInLeft {
  0% {
    opacity: 0;
    -webkit-transform: translate3d(-100%, 0, 0);
    transform: translate3d(-100%, 0, 0);
  }

  70% {
    opacity: 1;
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
  }
  100%{
    opacity: 1;
    -webkit-transform: translate3d(0, 0, 0) rotate(5deg);
    transform: translate3d(0, 0, 0) rotate(5deg);
  }
}
.fadeInLeft{
  animation: fadeInLeft 1s linear forwards;
}
</style>
