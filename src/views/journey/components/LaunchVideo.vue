<!--
 * @Author: diaochan
 * @Date: 2024-06-15 15:02:00
 * @LastEditors: diaochan
 * @LastEditTime: 2024-07-24 21:29:22
 * @Description: 
-->
<template>
  <div class="container" id="launchScreenVideo">
    <CustomVideo ref="CustomVideoRef" :muted="muted" />
    <CustomButton theme="blue" @click="onLaunch">立即体验</CustomButton>
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
    }
  },
  emits: ['onLaunch'],
  components: {
    CustomButton,
    CustomVideo
  },
  data(){
    return {
    }
  },
  beforeUnmount(){
    document.getElementById('launchScreenVideo').classList.add('fadeOut')
  },
  mounted() {
    
  },
  methods: {
    init({src}){
      if(src && this.$refs.CustomVideoRef){
        this.$refs.CustomVideoRef.init(src)
      } else {
        this.onLaunch();
      }
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
  background-size: 100% auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
