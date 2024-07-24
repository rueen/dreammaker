<!--
 * @Author: diaochan
 * @Date: 2024-06-15 18:02:21
 * @LastEditors: diaochan
 * @LastEditTime: 2024-07-24 17:35:27
 * @Description: 音频
-->
<template>
  <div class="layout">
    <div class="loading"></div>
    <div class="text" v-if="text">{{ text }}</div>
  </div>
</template>

<script>
export default {
  name: 'CustomLoading',
  components: {},
  props: ['text'],
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
.layout{
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, .5);
}
.loading {
  border: 8px solid #f3f3f3; /* Light grey */
  border-top: 8px solid #3498db; /* Blue */
  border-radius: 50%;
  width: 5rem;
  height: 5rem;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
.text{
  color: #fff;
  font-size: 1rem;
  margin-top: 1rem;
}
</style>