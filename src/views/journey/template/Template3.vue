<!--
 * @Author: diaochan
 * @Date: 2024-06-15 15:02:00
 * @LastEditors: diaochan
 * @LastEditTime: 2024-07-24 20:32:12
 * @Description: 
-->
<template>
  <CustomVideo ref="CustomVideoRef" />
  <div id="template3" class="container" :style="{'background': `url(${data.bgUrl}) no-repeat 0 0`}">
    <div class="options">
      <div
        class="optionItem hide"
        v-for="(option, index) in data.options"
        :id="`option_${option.id}`"
        :key="index"
        :style="{'width': `${optionItemWidth}px`, 'height': `${optionItemWidth*1.4}px`}"
        @click="handleSelect(option)"
      >
        <div
          class="imageView"
          :style="{'background-image': `url(${option.image})`, 'height': `${optionItemWidth*1.1}px`}"></div>
        <div class="name">{{ option.name }}</div>
      </div>
    </div>
    <div class="selectedBox" v-if="selectedOption">
      <div class="title">你将选择成为一名</div>
      <div class="selected">{{selectedOption.name}}</div>
    </div>
    <CustomButton theme="blue" style="width: 10rem;" @click="nextStep" v-if="selectedOption">下一步</CustomButton>
  </div>
</template>

<script>
import CustomButton from '@/components/CustomButton.vue'
import CustomVideo from '@/components/CustomVideo.vue';

export default {
  name: 'Template3View',
  props: ['data', 'sceneInfo'],
  emits: ['onEnd', 'getAudio', 'getOption', 'getLastOption'],
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
    document.getElementById('template3').classList.add('fadeIn');
    this.$emit('getAudio', {
      src: this.data.audio
    })
    if(this.data && this.data.video){
      this.$refs.CustomVideoRef.init(this.data.video)
    }
    this.optionItemWidth = parseInt((window.innerWidth*0.6)/this.data.options.length);
    this.data.options.forEach((option, index) => {
      const elm = document.getElementById(`option_${option.id}`);
      if(elm){
        setTimeout(() => {
          elm.classList.remove('hide');
          elm.classList.add('fadeInDownBig');
        }, index * 100)
      }
    })
  },
  methods: {
    handleSelect(option){
      this.selectedOption = {...option};
      const elm = document.getElementById(`option_${option.id}`);
      if(elm){
        this.data.options.forEach((option) => {
          const _elm = document.getElementById(`option_${option.id}`);
          if(_elm){
            _elm.classList.remove('scaleUp');
            _elm.classList.remove('fadeInDownBig');
          }
        })
        elm.classList.add('scaleUp');
      }
    },
    nextStep(){
      const optionId = this.selectedOption.id - 0;
      const children = JSON.parse(JSON.stringify(this.data.children));
      const nexItem = children.find(item => item.optionsId === optionId);
      this.$emit('onEnd', {
        nexItem
      });
      this.$emit('getOption', {
        selectedOption: this.selectedOption
      });
      this.$emit('getLastOption', {
        selectedOption: this.selectedOption
      });
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
  overflow: hidden;
  box-sizing: border-box;
}
.hide{
  opacity: 0;
}
.optionItem .imageView{
  width: 100%;
  background-size: cover;
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
