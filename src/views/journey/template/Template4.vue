<!--
 * @Author: diaochan
 * @Date: 2024-06-15 15:02:00
 * @LastEditors: diaochan
 * @LastEditTime: 2024-06-23 10:26:30
 * @Description: 
-->
<template>
  <CustomVideo ref="CustomVideoRef" />
  <div id="template4" class="container" :style="{'background': `url(${data.bgUrl}) no-repeat 0 0`}">
    <CustomButton theme="blue" @click="reStart">
      <span class="iconfont icon-refresh" style="font-size: 1.2rem;margin-right: 10px;"></span>
      <span>重新体验</span>
    </CustomButton>
  </div>
</template>

<script>
import CustomButton from '@/components/CustomButton.vue'
import CustomVideo from '@/components/CustomVideo.vue';

export default {
  name: 'Template4View',
  props: ['data'],
  emits: ['reStart', 'getAudio'],
  components: {
    CustomButton,
    CustomVideo
  },
  data(){
    return {
      optionItemWidth: null,
      selectedOption: null
    }
  },
  mounted() {
    document.getElementById('template4').classList.add('fadeIn');
    this.$emit('getAudio', {
      src: this.data.audio
    })
    if(this.data && this.data.video){
      this.$refs.CustomVideoRef.init(this.data.video)
    }
  },
  methods: {
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
  background-size: 100% auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #EEF0F2;
}
</style>
