<!--
 * @Author: diaochan
 * @Date: 2024-06-15 15:37:06
 * @LastEditors: diaochan
 * @LastEditTime: 2024-06-23 11:22:24
 * @Description: 
-->
<template>
  <div class="about">
    <CustomAudio ref="CustomAudioRef" />
    <LaunchScreen @onLaunch="onLaunch" v-if="setp === 1" />
    <LaunchVideo ref="LaunchVideoFef" v-if="setp === 2" @launchVideoOnEnd="launchVideoOnEnd" />
    <div v-if="setp === 3">
      <Template1
        v-if="activeItem.template === 'template1'"
        :data="activeItem"
        @onEnd="onEnd"
        @getAudio="getAudio"
      />
      <Template2
        v-if="activeItem.template === 'template2'"
        :data="activeItem"
        @onEnd="onEnd"
        @getAudio="getAudio"
      />
      <Template3
        v-if="activeItem.template === 'template3'"
        :data="activeItem"
        @onEnd="onEnd"
        @getAudio="getAudio"
      />
      <Template4
        v-if="activeItem.template === 'template4'"
        :data="activeItem"
        @reStart="reStart"
        @getAudio="getAudio"
      />
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router';
import LaunchScreen from './components/LaunchScreen.vue';
import LaunchVideo from './components/LaunchVideo.vue';
import Template1 from './template/Template1.vue';
import Template2 from './template/Template2.vue';
import Template3 from './template/Template3.vue';
import Template4 from './template/Template4.vue';
import CustomAudio from '@/components/CustomAudio';
import DATA from './DATA'

export default {
  name: 'JourneyView',
  components: {
    LaunchScreen,
    LaunchVideo,
    Template1,
    Template2,
    Template3,
    Template4,
    CustomAudio,
  },
  data(){
    return {
      setp: 1, // 1:启动引导 2:启动视频 3:场景播放
      info: {},
      list: [],
      activeItem: {}
    }
  },
  mounted() {
    const routes = useRouter();
    const route = routes.currentRoute.value;
    const { id } = route.params;

    console.log(id, DATA);
    this.info = DATA;
  },
  methods: {
    onLaunch(){
      this.setp = 2;
      if(this.info.launchAudio){
        this.getAudio({
          src: this.info.launchAudio
        });
      }
      setTimeout(() => {
        if(this.info.launchVideo){
          this.$refs.LaunchVideoFef.init({
            src: this.info.launchVideo
          });
        }
      })
    },
    launchVideoOnEnd(){
      this.setp = 3;
      this.list = DATA.list || [];
      this.activeItem = this.list[0];
    },
    onEnd(){
      if(!this.activeItem.nextId){
        return;
      }
      const nexItem = this.list.find(item => item.id === this.activeItem.nextId);
      this.activeItem = nexItem;
    },
    reStart(){
      this.activeItem = this.list[0];
    },
    getAudio({src}){
      if(!!src && this.$refs.CustomAudioRef){
        this.$refs.CustomAudioRef.init(src)
      } else if(!src && this.info.launchAudio){
        this.$refs.CustomAudioRef.init(this.info.launchAudio)
      }
    }
  }
}
</script>