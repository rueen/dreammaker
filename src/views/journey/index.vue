<!--
 * @Author: diaochan
 * @Date: 2024-06-15 15:37:06
 * @LastEditors: diaochan
 * @LastEditTime: 2024-07-24 20:47:32
 * @Description: 
-->
<template>
  <div class="about">
    <CustomAudio ref="CustomAudioRef" />
    <LaunchVideo ref="LaunchVideoFef" v-if="setp === 2 && info.id != null" @onLaunch="onLaunch" />
    <div v-if="setp === 3">
      <Template1
        v-if="activeItem.template === '1'"
        :sceneInfo="info"
        :data="activeItem"
        @onEnd="onEnd"
        @getAudio="getAudio"
        @getUserInfo="getUserInfo"
      />
      <Template2
        v-if="activeItem.template === '2'"
        :sceneInfo="info"
        :data="activeItem"
        @onEnd="onEnd"
        @getAudio="getAudio"
      />
      <Template3
        v-if="activeItem.template === '3'"
        :sceneInfo="info"
        :data="activeItem"
        @onEnd="onEnd"
        @getAudio="getAudio"
        @getOption="getOption"
        @getLastOption="getLastOption"
      />
      <Template4
        v-if="activeItem.template === '4'"
        :sceneInfo="info"
        :data="activeItem"
        :userInfo="userInfo"
        :selectedOption="selectedOption"
        :selectedLastOption="selectedLastOption"
        @reStart="reStart"
        @getAudio="getAudio"
      />
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router';
import LaunchVideo from './components/LaunchVideo.vue';
import Template1 from './template/Template1.vue';
import Template2 from './template/Template2.vue';
import Template3 from './template/Template3.vue';
import Template4 from './template/Template4.vue';
import CustomAudio from '@/components/CustomAudio';
import {get} from '@/server/request';

export default {
  name: 'JourneyView',
  components: {
    LaunchVideo,
    Template1,
    Template2,
    Template3,
    Template4,
    CustomAudio,
  },
  data(){
    return {
      id: null,
      setp: 1, // 1:启动引导 2:启动视频 3:场景播放
      info: {},
      activeItem: {},
      userInfo: {
        photoPath: '',
        activeGender: {}
      },
      selectedOption: {},
      selectedLastOption: {}
    }
  },
  mounted() {
    const routes = useRouter();
    const route = routes.currentRoute.value;
    const { id } = route.params;
    this.id = id;
    this.getData();
  },
  methods: {
    async getData() {
      const res = await get({
        url: '/site/api/scene',
        params: {
          id: this.id
        }
      })
      this.info = res.Data || {};
      if(this.info.launchVideo){
        this.setp = 2;
        setTimeout(() => {
          this.$refs.LaunchVideoFef.init({
            src: this.info.launchVideo
          });
        })
      } else {
        this.onLaunch();
      }
    },
    onLaunch(){
      this.setp = 3;
      this.activeItem = this.info.list[0];
    },
    onEnd({nexItem}){
      if(!nexItem){
        return false;
      }
      this.activeItem = nexItem;
    },
    reStart(){
      console.log(this.info, 'this.info')
      this.activeItem = this.info.list[0];
    },
    getAudio({src}){
      if(!!src && this.$refs.CustomAudioRef){
        this.$refs.CustomAudioRef.init(src)
      } else if(!src && this.info.launchAudio){
        this.$refs.CustomAudioRef.init(this.info.launchAudio)
      }
    },
    getUserInfo({photoPath,activeGender,scene}){
      this.userInfo = {
        photoPath,
        activeGender,
      };
      if(this.info.generateRule === 2 && scene) {
        // 1 文字图片选项; 2 预生成内容
        this.info = scene;
      }
    },
    getOption({selectedOption}){
      if(!this.selectedOption || !Object.keys(this.selectedOption).length){
        this.selectedOption = selectedOption;
      }
    },
    getLastOption({selectedOption}){
      this.selectedLastOption = selectedOption;
    }
  }
}
</script>