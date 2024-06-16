<!--
 * @Author: diaochan
 * @Date: 2024-06-15 15:02:00
 * @LastEditors: diaochan
 * @LastEditTime: 2024-06-16 15:54:50
 * @Description: 
-->
<template>
  <div id="template3" class="container" :style="{'background': `url(${data.bgUrl}) no-repeat 0 0`}">
    <div class="options">
      <div
        class="optionItem"
        v-for="(option, index) in data.options"
        :key="index"
        :style="{'width': `${optionItemWidth}px`, 'height': `${optionItemWidth*1.4}px`}"
      >
        <img class="image" :src="option.image" alt="">
        <div class="name">{{ option.name }}</div>
      </div>
    </div>
    <div class="selectedBox">
      <div class="title">你将选择成为一名</div>
      <div class="selected">汽车手</div>
    </div>
    <CustomButton theme="blue" style="width: 10rem;" @click="nextStep" v-if="isShowNext">下一步</CustomButton>
  </div>
</template>

<script>
import CustomButton from '@/components/CustomButton.vue'

export default {
  name: 'Template3View',
  props: ['data'],
  components: {
    CustomButton
  },
  data(){
    return {
      isShowNext: false,
      optionItemWidth: null
    }
  },
  mounted() {
    document.getElementById('template3').classList.add('fadeIn')
    this.optionItemWidth = parseInt((window.innerWidth*0.6)/this.data.options.length)
  },
  methods: {
    nextStep(){
      this.$emit('onEnd');
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
}
.options{
  width: 65%;
  display: flex;
  justify-content: space-around;
}
.optionItem{
  background-color: #E6E6E6;
  padding: 1rem;
  box-shadow: 0 6px 6px 0 rgba(0,0,0,.2);
  box-sizing: border-box;
  cursor: pointer;
}
.optionItem .image{
  width: 100%;
}
.optionItem .name{
  color: #535F6E;
  font-size: 1rem;
  margin-top: .5rem;
  text-align: center;
}
.selectedBox{
  width: 65%;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  padding-top: 2rem;
}
.selectedBox .title{
  color: #23272E;
  font-size: 1rem;
}
.selectedBox .selected{
  font-size: 1.5rem;
  color: #2454C4;
  font-weight: bold;
  margin-top: .2rem;
}
</style>
