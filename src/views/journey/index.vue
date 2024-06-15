<!--
 * @Author: diaochan
 * @Date: 2024-06-15 15:37:06
 * @LastEditors: diaochan
 * @LastEditTime: 2024-06-15 18:05:41
 * @Description: 
-->
<template>
  <div class="about">
    <CollectInfo />
  </div>
</template>

<script>
import { useRouter } from 'vue-router';
import CollectInfo from './template/CollectInfo.vue'

export default {
  name: 'JourneyView',
  components: {
    CollectInfo
  },
  setup() {
    const routes = useRouter();
    const route = routes.currentRoute.value;
    const { id } = route.params;

    console.log(id)
  }
}
</script>