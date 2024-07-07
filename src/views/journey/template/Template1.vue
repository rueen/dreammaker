<!--
 * @Author: diaochan
 * @Date: 2024-06-15 15:02:00
 * @LastEditors: diaochan
 * @LastEditTime: 2024-07-07 16:14:02
 * @Description: 
-->
<template>
  <CustomVideo ref="CustomVideoRef" />
  <div id="template1" class="container" :style="{'background': `url(${data.bgUrl}) no-repeat 0 0`}">
    <div class="left">
      <div class="sexList">
        <div class="sexItem sexMale" @click="selectSex('male')" :class="activeSex === 'male' ? 'activeSex' : ''">
          <div class="sexItemContent">
            <div class="iconBox">
              <span class="iconfont icon-male sexIcon"></span>
              <span class="sexTag">male</span>
            </div>
            <div class="sexText">{{data.maleText}}</div>
          </div>
        </div>
        <div class="sexItem" @click="selectSex('female')" :class="activeSex === 'female' ? 'activeSex' : ''">
          <div class="sexItemContent">
            <div class="iconBox">
              <span class="iconfont icon-female sexIcon"></span>
              <span class="sexTag">female</span>
            </div>
            <div class="sexText">{{data.femaleText}}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="right">
      <FaceTracking ref="refFaceTracking" @getPhoto="getPhoto($event)" />
      <div class="btnBox" :style="{'width': `${cameraWidth}px`}" v-if="photo">
        <CustomButton theme="white" @click="reTrack()" style="width: 10rem;">
          <span class="iconfont icon-refresh" style="font-size: 1.2rem;margin-right: 10px;"></span>
          <span>重新拍</span>
        </CustomButton>
        <CustomButton theme="blue" style="width: 10rem;" @click="nextStep">下一步</CustomButton>
      </div>
    </div>
  </div>
</template>

<script>
import FaceTracking from '@/components/FaceTracking';
import CustomButton from '@/components/CustomButton.vue'
import CustomVideo from '@/components/CustomVideo.vue';

export default {
  name: 'Template1View',
  props: ['data'],
  emits: ['onEnd', 'getAudio'],
  components: {
    FaceTracking,
    CustomButton,
    CustomVideo
  },
  data(){
    return {
      activeSex: 'male',
      photo: null,
      cameraWidth: null
    }
  },
  mounted() {
    document.getElementById('template1').classList.add('fadeIn')
    this.$emit('getAudio', {
      src: this.data.audio
    })
    if(this.data && this.data.video){
      this.$refs.CustomVideoRef.init(this.data.video)
    }
  },
  beforeUnmount(){
    document.getElementById('template1').classList.remove('fadeIn')
    document.getElementById('template1').classList.add('fadeOut')
  },
  methods: {
    selectSex(sex){
      this.activeSex = sex;
    },
    reTrack(){
      if(this.$refs.refFaceTracking){
        this.$refs.refFaceTracking.reTrack();
        this.photo = null;
      }
    },
    getPhoto(e){
      const {photo, cameraWidth} = e;
      this.photo = photo;
      this.cameraWidth = cameraWidth;
    },
    nextStep(){
      this.$emit('onEnd', {
        nextId: this.data.nextId
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
  position: relative;
  display: flex;
  justify-content: space-between;
  background-color: #EEF0F2;
}
.left{
  width: 45%;
  padding-top: 15rem;
  padding-left: 7rem;
}
.sexList{
  display: flex;
}
.sexItem{
  width: 8.5rem;
  height: 8rem;
  position: relative;
  cursor: pointer;
}
.sexItemContent{
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 2;
  padding-left: 1rem;
}
.sexMale{
  margin-right: 5rem;
}
.sexIcon{
  color: #fff;
}
.icon-male{
  font-size: 4rem;
}
.icon-female{
  font-size: 3.8rem;
}
.sexTag{
  color: #fff;
  font-size: 1rem;
}
.iconBox{
  display: flex;
  align-items: flex-end;
  height: 4.8rem;
}
.sexText{
  color: #fff;
  font-weight: bold;
  font-size: 1rem;
}
.activeSex .sexIcon,
.activeSex .sexTag,
.activeSex .sexText{
  color: #1A36B8;
}
.activeSex::before{
  content: '';
  width: 70%;
  height: 100%;
  border-radius: 1rem;
  background-color: #fff;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 1;
}
.activeSex::after{
  content: '';
  width: 100%;
  height: 70%;
  border-radius: 1rem;
  background-color: #fff;
  position: absolute;
  left: 0;
  bottom: 0;
  z-index: 1;
}
.right{
  width: 55%;
  padding-top: 10rem;
}
.btnBox{
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
}
</style>
