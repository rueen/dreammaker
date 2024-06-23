<!--
 * @Author: diaochan
 * @Date: 2024-06-15 18:02:21
 * @LastEditors: diaochan
 * @LastEditTime: 2024-06-23 09:50:35
 * @Description: 视频
-->
<template>
  <div class="container" v-if="isShow">
    <video
      ref="videoElement"
      class="videoPlayer"
      autoplay
      loop
      :src="src"
    >
      <source type="video/mp4">
    </video>
  </div>
</template>

<script>
export default {
  name: 'CustomVideo',
  components: {},
  props: [],
  data() {
    return {
      isShow: false,
      src: null
    };
  },
  mounted() {
    this.video = this.$refs.videoElement;
  },
  methods: {
    init(src){
      if(src){
        this.isShow = true;
        this.src = src;
      }
    },
  }
}
</script>

<style scoped>
.container{
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  overflow: hidden;
  z-index: -1; /* 确保视频在内容之下 */
}
.videoPlayer {
  width: 100%;
  height: 100%;
  object-fit: cover; /* 确保视频覆盖整个背景 */
}
</style>