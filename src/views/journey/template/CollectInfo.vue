<!--
 * @Author: diaochan
 * @Date: 2024-06-15 15:02:00
 * @LastEditors: diaochan
 * @LastEditTime: 2024-06-16 11:47:33
 * @Description: 
-->
<template>
  <div class="container">
    <div class="left">

    </div>
    <div class="right">
      <FaceTracking ref="refFaceTracking" style="margin-bottom: 2rem;" />
      <CustomButton theme="white" @click="reTrack()" style="width: 10rem;margin-right: 2rem;">
        <span class="iconfont icon-refresh" style="font-size: 1.2rem;margin-right: 10px;"></span>
        <span>重新拍</span>
      </CustomButton>
      <CustomButton theme="blue" style="width: 10rem;">下一步</CustomButton>
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
  setup() {
    
  },
  methods: {
    reTrack(){
      if(this.$refs.refFaceTracking){
        this.$refs.refFaceTracking.reTrack();
      }
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
}
.right{
  width: 55%;
  padding-top: 10rem;
}
</style>
