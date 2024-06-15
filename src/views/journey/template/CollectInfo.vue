<!--
 * @Author: diaochan
 * @Date: 2024-06-15 15:02:00
 * @LastEditors: diaochan
 * @LastEditTime: 2024-06-15 20:28:01
 * @Description: 
-->
<template>
  <div class="container">
    <FaceTracking class="faceTracking" />
  </div>
</template>

<script>
import FaceTracking from '@/components/FaceTracking';

export default {
  name: 'CollectInfo',
  components: {
    FaceTracking
  },
  setup() {
    
  },
  methods: {
    
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
}
.faceTracking{
  position: absolute;
  right: 20rem;
  top: 10rem
}
</style>
