<!--
 * @Author: diaochan
 * @Date: 2024-06-15 15:02:00
 * @LastEditors: diaochan
 * @LastEditTime: 2024-06-16 15:11:53
 * @Description: 
-->
<template>
  <div id="template2" class="container" :style="{'background': `url(${data.bgUrl}) no-repeat 0 0`}">
    <div class="wrap">
      <div id="title"></div>
      <div id="content"></div>
    </div>
  </div>
</template>

<script>
import Typed from 'typed.js';

export default {
  name: 'Template2View',
  props: ['data'],
  components: {
    
  },
  data(){
    return {
      
    }
  },
  mounted() {
    document.getElementById('template2').classList.add('fadeIn')
    new Typed('#title', {
      strings: [
        `${this.data.title}`
      ],
      typeSpeed: 100, // 打印速度
      startDelay: 300, // 开始之前的延迟300毫秒
      loop: false, // 是否循环
      onComplete: () => {
        new Typed('#content', {
          strings: [
            `${this.data.content}`
          ],
          typeSpeed: 100, // 打印速度
          startDelay: 300, // 开始之前的延迟300毫秒
          loop: false, // 是否循环
          onComplete: () => {
          }
        });
      }
    });
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
  display: flex;
  justify-content: center;
  align-items: center;
}
.wrap{
  width: 60%;
}
#title{
  font-size: 2rem;
  color: #fff;
}
#content{
  font-size: 1rem;
  line-height: 1.8rem;
  color: #fff;
}
</style>
