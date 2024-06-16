<!--
 * @Author: diaochan
 * @Date: 2024-06-15 15:02:00
 * @LastEditors: diaochan
 * @LastEditTime: 2024-06-16 14:37:07
 * @Description: 
-->
<template>
  <div class="container" :style="{'background': `url(${data.bgUrl}) no-repeat 0 0`}">
    Template2
  </div>
</template>

<script>
export default {
  name: 'Template2View',
  props: ['data'],
  components: {
    
  },
  data(){
    return {
      
    }
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
  background-size: 100% auto;
  position: relative;
  display: flex;
  justify-content: space-between;
}
</style>
