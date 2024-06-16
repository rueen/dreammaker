<!--
 * @Author: diaochan
 * @Date: 2024-06-15 15:02:00
 * @LastEditors: diaochan
 * @LastEditTime: 2024-06-16 12:45:45
 * @Description: 
-->
<template>
  <div class="container">
    <div class="left">
      <div class="sexList">
        <div class="sexItem sexMale" @click="selectSex('male')" :class="activeSex === 'male' ? 'activeSex' : ''">
          <div class="sexItemContent">
            <div class="iconBox">
              <span class="iconfont icon-male sexIcon"></span>
              <span class="sexTag">male</span>
            </div>
            <div class="sexText">我是一名男性</div>
          </div>
        </div>
        <div class="sexItem" @click="selectSex('female')" :class="activeSex === 'female' ? 'activeSex' : ''">
          <div class="sexItemContent">
            <div class="iconBox">
              <span class="iconfont icon-female sexIcon"></span>
              <span class="sexTag">female</span>
            </div>
            <div class="sexText">我是一名女性</div>
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
        <CustomButton theme="blue" style="width: 10rem;">下一步</CustomButton>
      </div>
    </div>
  </div>
</template>

<script>
import FaceTracking from '@/components/FaceTracking';
import CustomButton from '@/components/CustomButton.vue'

export default {
  name: 'CollectInfo',
  components: {
    FaceTracking,
    CustomButton
  },
  data(){
    return {
      activeSex: 'male',
      photo: null,
      cameraWidth: null
    }
  },
  setup() {
    
  },
  methods: {
    selectSex(sex){
      this.activeSex = sex;
    },
    reTrack(){
      if(this.$refs.refFaceTracking){
        this.$refs.refFaceTracking.reTrack();
      }
    },
    getPhoto(e){
      const {photo, cameraWidth} = e;
      this.photo = photo;
      this.cameraWidth = cameraWidth;
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
  position: relative;
  display: flex;
  justify-content: space-between;
}
.left{
  width: 45%;
  padding-top: 15rem;
  padding-left: 6rem;
}
.sexList{
  display: flex;
}
.sexItem{
  width: 8.5rem;
  height: 7.5rem;
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
  height: 5.2rem;
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
