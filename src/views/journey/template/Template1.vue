<!--
 * @Author: diaochan
 * @Date: 2024-06-15 15:02:00
 * @LastEditors: diaochan
 * @LastEditTime: 2025-08-18 16:43:18
 * @Description: 
-->
<template>
  <CustomAudio ref="CustomAudioRef" />
  <CustomVideo ref="CustomVideoRef" />
  <Loading text="图片上传中 请耐心等待..." v-if="loading" />
  <div id="template1" class="container" :style="{'background-image': `url(${data.bgUrl})`}">
    <div class="page-title">{{data.title}}</div>
    <div class="left">
      <div class="sexList">
        <div class="sexItem sexMale" @click="selectSex({
          gender: 'male',
          text: data.maleText
        })" :class="activeSex.gender === 'male' ? 'activeSex' : ''">
          <div class="sexItemContent">
            <div class="iconBox">
              <span class="iconfont icon-male sexIcon"></span>
              <span class="sexTag">male</span>
            </div>
            <div class="sexText">{{data.maleText}}</div>
          </div>
        </div>
        <div class="sexItem" @click="selectSex({
          gender: 'female',
          text: data.femaleText
        })" :class="activeSex.gender === 'female' ? 'activeSex' : ''">
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
        <CustomButton theme="blue" style="width: 10rem;" @click="nextStep" v-if="data.children && data.children[0]">下一步</CustomButton>
      </div>
    </div>
  </div>
</template>

<script>
import CustomAudio from '@/components/CustomAudio';
import Loading from '@/components/loading';
import FaceTracking from '@/components/FaceTracking';
import CustomButton from '@/components/CustomButton.vue'
import CustomVideo from '@/components/CustomVideo.vue';
import {post} from '@/server/request';
import { toast } from 'vue3-toastify';

export default {
  name: 'Template1View',
  props: ['data', 'sceneInfo', 'isInteractive'],
  emits: ['onEnd', 'getUserInfo', 'pauseLaunchAudio', 'playLaunchAudio'],
  components: {
    Loading,
    FaceTracking,
    CustomButton,
    CustomVideo,
    CustomAudio
  },
  data(){
    return {
      activeSex: {
        gender: 'male',
        text: ''
      },
      photo: null,
      cameraWidth: null,
      loading: false
    }
  },
  mounted() {
    document.getElementById('template1').classList.add('fadeIn');
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
  beforeUnmount(){
    document.getElementById('template1').classList.remove('fadeIn')
    document.getElementById('template1').classList.add('fadeOut')
  },
  methods: {
    getInteractive(){
      if(this.data.audio){
        this.$refs.CustomAudioRef.init(this.data.audio);
      }
    },
    selectSex(item){
      this.activeSex = item;
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
    flattenList(nestedArray) {
      const result = [];

      function flatten(item) {
        result.push({
          ...item
        });
        if (item.children) {
          item.children.forEach(flatten);
        }
      }

      nestedArray.forEach(flatten);
      return result;
    },
    async nextStep(){
      if(this.sceneInfo.generateRule === 2){
        this.loading = true;
      }
      const res = await post({
        url: '/site/api/uploadBase64',
        params: {
          file: this.photo,
          id: this.sceneInfo.id,
          gender: this.activeSex.text
        }
      })
      this.loading = false;
      if(res.ReturnCode === '200'){
        const scene = res.Data.scene || {};
        this.$emit('getUserInfo', {
          photoPath: res.Data.path,
          activeGender: this.activeSex,
          scene
        });
        let nexItem = this.data.children[0];
        let _nexItem = {
          ...nexItem
        }
        if(scene.generateRule === 2) {
          // 1 文字图片选项; 2 预生成内容
          const sceneList = this.flattenList(scene.list);
          _nexItem = sceneList.find(item => item.id === nexItem.id);
        }
        this.$emit('onEnd', {
          nexItem: _nexItem
        });
      } else {
        toast.error('上传失败，请重新点击')
      }
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
  justify-content: space-between;
}
.page-title {
  font-size: 1.5rem;
  color: #fff;
  position: absolute;
  top: 10%;
  left: 7rem;
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
