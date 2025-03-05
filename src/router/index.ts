import {createRouter, createWebHistory} from '@ionic/vue-router'
import {RouteRecordRaw} from 'vue-router'
import HomePage from '../views/HomePage.vue'
import SettingsPage from '../views/SettingsPage.vue'
import BiblePage from '../views/BiblePage.vue'
import SaintPage from "@/components/organism/SaintPage.vue";
import TabsNavbar from "@/components/molecules/TabsNavbar.vue";

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        component: TabsNavbar,
        children: [
            {
                path: "/", redirect: 'home',
            },
            {
                path: "home",
                name: "home",
                component: HomePage,
            },
            {
                path: '/bible',
                name: 'Bible',
                component: BiblePage
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
            }, {
                path: '/saint',
                name: 'Saint',
                component: SaintPage
            },
        ],
    },
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
})

export default router