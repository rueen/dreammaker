<!--
 * @Author: diaochan
 * @Date: 2024-06-15 15:37:06
 * @LastEditors: diaochan
 * @LastEditTime: 2024-06-16 14:48:34
 * @Description: 
-->
<template>
  <div class="about">
    <Template1 v-if="activeItem.template === 'template1'" :data="activeItem" @onEnd="onEnd()" />
    <Template2 v-if="activeItem.template === 'template2'" :data="activeItem" @onEnd="onEnd()" />
  </div>
</template>

<script>
import { useRouter } from 'vue-router';
import Template1 from './template/Template1.vue';
import Template2 from './template/Template2.vue';
import DATA from '@/assets/DATA'

export default {
  name: 'JourneyView',
  components: {
    Template1,
    Template2
  },
  data(){
    return {
      list: [],
      activeItem: {}
    }
  },
  mounted() {
    const routes = useRouter();
    const route = routes.currentRoute.value;
    const { id } = route.params;

    console.log(id, DATA)
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
    }
  }
}
</script>