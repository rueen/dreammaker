<!--
 * @Author: diaochan
 * @Date: 2024-06-15 15:37:06
 * @LastEditors: diaochan
 * @LastEditTime: 2024-07-25 09:54:49
 * @Description: 
-->
<template>
  <div class="about">
    <CustomAudio ref="CustomAudioRef" />
    <LaunchVideo
      ref="LaunchVideoFef"
      v-if="setp === 2 && info.id != null"
      @onLaunch="onLaunch"
      :muted="!isInteractive"
    />
    <div v-if="setp === 3">
      <Template1
        v-if="activeItem.template === '1'"
        :sceneInfo="info"
        :data="activeItem"
        @onEnd="onEnd"
        @getUserInfo="getUserInfo"
        @pauseLaunchAudio="pauseLaunchAudio"
        @playLaunchAudio="playLaunchAudio"
      />
      <Template2
        v-if="activeItem.template === '2'"
        :sceneInfo="info"
        :data="activeItem"
        @onEnd="onEnd"
        @pauseLaunchAudio="pauseLaunchAudio"
        @playLaunchAudio="playLaunchAudio"
      />
      <Template3
        v-if="activeItem.template === '3'"
        :sceneInfo="info"
        :data="activeItem"
        @onEnd="onEnd"
        @getOption="getOption"
        @getLastOption="getLastOption"
        @pauseLaunchAudio="pauseLaunchAudio"
        @playLaunchAudio="playLaunchAudio"
      />
      <Template4
        v-if="activeItem.template === '4'"
        :sceneInfo="info"
        :data="activeItem"
        :userInfo="userInfo"
        :selectedOption="selectedOption"
        :selectedLastOption="selectedLastOption"
        @reStart="reStart"
        @pauseLaunchAudio="pauseLaunchAudio"
        @playLaunchAudio="playLaunchAudio"
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
      selectedLastOption: {},
      isInteractive: false
    }
  },
  mounted() {
    const routes = useRouter();
    const route = routes.currentRoute.value;
    const { id } = route.params;
    this.id = id;
    this.getData();

    // 监听点击事件
    document.addEventListener('click', () => {
      this.getInteractive();
    });
    // 监听键盘按下和释放事件
    document.addEventListener('keydown', () => {
      this.getInteractive();
    });
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
      if(this.info.launchVideo || this.info.launchPhoto){
        this.setp = 2;
        setTimeout(() => {
          this.$refs.LaunchVideoFef.init({
            launchVideo: this.info.launchVideo,
            launchPhoto: this.info.launchPhoto
          });
          if(this.isInteractive && this.info.launchAudio){
            this.$refs.CustomAudioRef.init(this.info.launchAudio);
          }
        })
      } else {
        this.onLaunch();
      }
    },
    onLaunch(){
      this.setp = 3;
      this.activeItem = this.info.list[0];
    },
    // 拿到用户首次交互（否则无法播放音频）
    getInteractive(){
      if(!this.isInteractive){
        // 启动音频
        this.isInteractive = true;
        if(this.info.launchAudio){
          this.$refs.CustomAudioRef.init(this.info.launchAudio);
        }
      }
    },
    onEnd({nexItem}){
      if(!nexItem){
        return false;
      }
      this.activeItem = nexItem;
    },
    reStart(){
      this.activeItem = this.info.list[0];
    },
    pauseLaunchAudio(){
      this.$refs.CustomAudioRef.handlePause(false);
    },
    playLaunchAudio(){
      if(this.info.launchAudio){
        setTimeout(() => {
          this.$refs.CustomAudioRef.handlePlay(true);
        }, 0)
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