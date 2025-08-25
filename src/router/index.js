/*
 * @Author: diaochan
 * @Date: 2024-06-15 15:25:41
 * @LastEditors: diaochan
 * @LastEditTime: 2024-06-15 18:05:00
 * @Description: 
 */
import { createRouter, createWebHashHistory } from 'vue-router'
import JourneyView from '@/views/journey/index.vue'
import GalleryView from '@/views/gallery/index.vue'

const routes = [
  {
    path: '/journey/:id',
    name: 'journey',
    component: JourneyView
  },
  {
    path: '/gallery',
    name: 'gallery',
    component: GalleryView
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
