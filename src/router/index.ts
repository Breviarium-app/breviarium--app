import { createRouter, createWebHistory } from '@ionic/vue-router'
import { RouteRecordRaw } from 'vue-router'
import HomePage from '../views/HomePage.vue'
import SettingsPage from '../views/SettingsPage.vue'
import BiblePage from '../views/BiblePage.vue'
import SaintPage from "@/components/organism/SaintPage.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'Home',
    component: HomePage
  },
  {
    path: '/bible',
    name: 'Bible',
    component: BiblePage
  },{
    path: '/saint',
    name: 'Saint',
    component: SaintPage
  },
  {
    path: '/settings',
    name: 'Settings',
    component: SettingsPage
  },
  {
    path: '/prayer/:type',
    name: 'Prayer',
    component: () => import('../components/organism/PrayerPage.vue')
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router