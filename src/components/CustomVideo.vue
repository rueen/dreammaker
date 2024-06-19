<!--
 * @Author: diaochan
 * @Date: 2024-06-15 18:02:21
 * @LastEditors: diaochan
 * @LastEditTime: 2024-06-18 21:01:14
 * @Description: 人脸捕捉
-->
<template>
  <div></div>
</template>

<script>
export default {
  name: 'CustomVideo',
  components: {},
  props: [],
  data() {
    return {
      src: null
    };
  },
  mounted() {

  },
  methods: {
    init(src){
      this.src = src;
      this.handlePlay();
    },
  }
}
</script>

<style scoped>

</style>