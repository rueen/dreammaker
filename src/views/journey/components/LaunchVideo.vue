<!--
 * @Author: diaochan
 * @Date: 2024-06-15 15:02:00
 * @LastEditors: diaochan
 * @LastEditTime: 2024-07-26 16:55:20
 * @Description: 
-->
<template>
  <div class="container" id="launchScreenVideo" :style="{'background-image': `url(${launchPhoto})`}">
    <CustomVideo ref="CustomVideoRef" :muted="muted" />
    <CustomButton theme="blue" @click="onLaunch" v-if="sceneInfo.list && sceneInfo.list.length">立即体验</CustomButton>
  </div>
</template>

<script>
import CustomButton from '@/components/CustomButton.vue'
import CustomVideo from '@/components/CustomVideo.vue';

export default {
  name: 'LaunchVideo',
  props: {
    muted: {
      type: Boolean,
      default: true
    },
    sceneInfo: {
      type: Object
    }
  },
  emits: ['onLaunch'],
  components: {
    CustomButton,
    CustomVideo
  },
  data(){
    return {
      launchVideo: null,
      launchPhoto: null
    }
  },
  beforeUnmount(){
    document.getElementById('launchScreenVideo').classList.add('fadeOut')
  },
  mounted() {
    
  },
  methods: {
    init({
      launchVideo,
      launchPhoto
    }){
      if(launchVideo && this.$refs.CustomVideoRef){
        this.$refs.CustomVideoRef.init(launchVideo)
      }
      this.launchVideo = launchVideo;
      this.launchPhoto = launchPhoto;
    },
    onLaunch(){
      this.$emit('onLaunch')
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
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
