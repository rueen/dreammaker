<!--
 * @Author: diaochan
 * @Date: 2024-06-15 15:02:00
 * @LastEditors: diaochan
 * @LastEditTime: 2024-06-23 11:24:07
 * @Description: 
-->
<template>
  <CustomVideo ref="CustomVideoRef" />
  <div id="template4" class="container" :style="{'background': `url(${data.bgUrl}) no-repeat 0 0`}">
    <div class="left">
      <div class="photo hide" id="photo">
        <img class="photoImg" src="http://pre.statics.seatent.com/statics/6b8b4690e7a727e3a330a308fe136a2e/attachment/upload/image/20240125/a817df8a0e754ad99e1963f90fdc7bba.jpg" alt="">
      </div>
    </div>
    <div class="right">
      <div class="rightContent">
        <div class="title hide" id="title">#职业名称文本</div>
        <div class="content hide" id="content">在70年代的十堰，你作为造车厂工人的身影烙印在了城市崛起的历程中。从组织劳动竞赛提升生产效率，担任车间主任后专注技能培训，你以实际行动点燃了工人们的热情，铸就了团队的坚实力量。预测着未来，你将引领十堰汽车...</div>
        <div class="qrCodeWrap hide" id="qrCodeWrap">
          <div class="qrCode">
            <!-- <img src="" alt=""> -->
          </div>
          <CustomButton theme="blue" @click="reStart">
            <span class="iconfont icon-refresh" style="font-size: 1.2rem;margin-right: 10px;"></span>
            <span>重新体验</span>
          </CustomButton>
        </div>
      </div>
    </div>
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
    setTimeout(() => {
      document.getElementById('title').classList.add('fadeInDown');
      document.getElementById('photo').classList.add('fadeInLeft');
      document.getElementById('content').classList.add('fadeIn');
      document.getElementById('qrCodeWrap').classList.add('fadeIn');
    }, 500)
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
  justify-content: center;
  align-items: center;
  background-color: #EEF0F2;
}
.hide{
  opacity: 0;
}
.left{
  width: 50%;
  display: flex;
  justify-content: flex-end;
  padding-right: 8rem;
}
.right{
  width: 50%;
}
.rightContent{
  width: 70%;
}
.photo{
  width: 20rem;
  background-color: #E6E6E6;
  box-shadow: .3rem .1rem .8rem 0 rgba(0, 0, 0, .25);
  transform: rotate(5deg);
}
.photoImg{
  width: 100%;
}
.title{
  color: #2F52C1;
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 2rem;
}
.content{
  color: #535F6E;
  font-size: 1.26rem;
  margin-bottom: 2rem;
}
.qrCodeWrap{
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}
.qrCode{
  width: 8rem;
  height: 8rem;
  background-color: #D9D9D9;
}
@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
.fadeIn{
  animation: fadeIn 1s linear forwards;
}
@-webkit-keyframes fadeInLeft {
  from {
    opacity: 0;
    -webkit-transform: translate3d(-100%, 0, 0);
    transform: translate3d(-100%, 0, 0);
  }

  to {
    opacity: 1;
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
  }
}
@keyframes fadeInLeft {
  0% {
    opacity: 0;
    -webkit-transform: translate3d(-100%, 0, 0);
    transform: translate3d(-100%, 0, 0);
  }

  70% {
    opacity: 1;
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
  }
  100%{
    opacity: 1;
    -webkit-transform: translate3d(0, 0, 0) rotate(5deg);
    transform: translate3d(0, 0, 0) rotate(5deg);
  }
}
.fadeInLeft{
  animation: fadeInLeft 1s linear forwards;
}
</style>
