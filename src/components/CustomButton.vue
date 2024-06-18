<!--
 * @Author: diaochan
 * @Date: 2024-06-15 18:02:21
 * @LastEditors: diaochan
 * @LastEditTime: 2024-06-18 20:16:28
 * @Description: 人脸捕捉
-->
<template>
  <div class="buttonContainer" :class="theme" :style="style">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'CustomButton',
  components: {},
  props: ['theme', 'style'],
  data() {
    return {
      
    };
  },
  mounted() {
    
  },
  methods: {
    
  }
}
</script>

<style scoped>
.buttonContainer{
  height: 3rem;
  line-height: 3rem;
  border-radius: 1.5rem;
  padding: 0 1.8rem;
  display: inline-block;
  font-size: 1.2rem;
  font-weight: bold;
  text-align: center;
  cursor: pointer;
}
.buttonContainer.blue{
  background-color: #3972E1;
  color: #fff;
}
.buttonContainer.white{
  background-color: #fff;
  color: #3972E1;
}
</style>