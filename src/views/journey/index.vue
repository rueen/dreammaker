<!--
 * @Author: diaochan
 * @Date: 2024-06-15 15:37:06
 * @LastEditors: diaochan
 * @LastEditTime: 2024-06-18 20:29:19
 * @Description: 
-->
<template>
  <div class="about">
    <CustomAudio :src="info.launchAudio" />
    <Template1 v-if="activeItem.template === 'template1'" :data="activeItem" @onEnd="onEnd()" />
    <Template2 v-if="activeItem.template === 'template2'" :data="activeItem" @onEnd="onEnd()" />
    <Template3 v-if="activeItem.template === 'template3'" :data="activeItem" @onEnd="onEnd()" />
    <Template4 v-if="activeItem.template === 'template4'" :data="activeItem" @reStart="reStart()" />
  </div>
</template>

<script>
import { useRouter } from 'vue-router';
import Template1 from './template/Template1.vue';
import Template2 from './template/Template2.vue';
import Template3 from './template/Template3.vue';
import Template4 from './template/Template4.vue';
import CustomAudio from '@/components/CustomAudio'
import DATA from './DATA'

export default {
  name: 'JourneyView',
  components: {
    Template1,
    Template2,
    Template3,
    Template4,
    CustomAudio
  },
  data(){
    return {
      info: {},
      list: [],
      activeItem: {}
    }
  },
  mounted() {
    const routes = useRouter();
    const route = routes.currentRoute.value;
    const { id } = route.params;

    console.log(id, DATA)
    this.info = DATA;
    this.list = DATA.list || [];
    this.activeItem = this.list[0];
  },
  methods: {
    onEnd(){
      if(!this.activeItem.nextId){
        return;
      }
      const nexItem = this.list.find(item => item.id === this.activeItem.nextId);
      this.activeItem = nexItem;
    },
    reStart(){
      this.activeItem = this.list[0];
    }
  }
}
</script>@/views/journey/template/DATA