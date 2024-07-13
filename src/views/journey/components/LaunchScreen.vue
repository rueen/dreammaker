<!--
 * @Author: diaochan
 * @Date: 2024-06-15 15:02:00
 * @LastEditors: diaochan
 * @LastEditTime: 2024-07-13 17:11:44
 * @Description: 
-->
<template>
  <div id="launchScreen" class="container">
    <CustomButton theme="blue" @click="onLaunch">开始体验</CustomButton>
  </div>
</template>

<script>
import CustomButton from '@/components/CustomButton.vue'

export default {
  name: 'LaunchScreen',
  props: [],
  emits: ['onLaunch'],
  components: {
    CustomButton
  },
  data(){
    return {
      
    }
  },
  beforeUnmount(){
    document.getElementById('launchScreen').classList.add('fadeOut')
  },
  mounted() {

  },
  methods: {
    onLaunch(){
      this.$emit('onLaunch');
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
