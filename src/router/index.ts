import {createRouter, createWebHistory} from '@ionic/vue-router'
import {RouteRecordRaw} from 'vue-router'
import HomePage from '../views/HomePage.vue'
import SettingsPage from '../views/SettingsPage.vue'
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
                path: "prayer-intentions",
                name: "prayer-intentions",
                component: () => import('../views/PrayerIntentionsPage.vue'),
            },
            {
                path: '/bible',
                name: 'Bible',
                component: () => import('../components/organism/BiblePage.vue')
            }, {
                path: '/bible/:id',
                name: 'BibleBook',
                component: () => import('../components/organism/bible/BibleBookPage.vue')
            },
            {
                path: '/bible/:id/:chapter',
                name: 'BibleChapter',
                component: () => import('../components/organism/bible/BibleChapterPage.vue')
            },
            {
                path: '/settings',
                name: 'Settings',
                component: SettingsPage
            }, {
                path: '/privacy',
                name: 'Privacy',
                component: () => import('../components/organism/PrivacyPage.vue')
            },
            {
                path: '/prayer/laudes',
                name: 'Laudes',
                component: () => import('../components/organism/prayers/LaudesPage.vue')
            }, {
                path: '/prayer/vesperae',
                name: 'Vesperae',
                component: () => import('../components/organism/prayers/VesperaePage.vue')
            }, {
                path: '/prayer/tertia',
                name: 'Tertia',
                component: () => import('../components/organism/prayers/TertiaPage.vue')
            }, {
                path: '/prayer/sexta',
                name: 'Sexta',
                component: () => import('../components/organism/prayers/SextaPage.vue')
            }, {
                path: '/prayer/nona',
                name: 'Nona',
                component: () => import('../components/organism/prayers/NonaPage.vue')
            }, {
                path: '/prayer/officium',
                name: 'Nona',
                component: () => import('../components/organism/prayers/OfficiumPage.vue')
            }, {
                path: '/prayer/:type',
                name: 'Prayer',
                component: () => import('../components/organism/PrayerPage.vue')
            }, {
                path: '/saint',
                name: 'Saint',
                component: () => import('../components/organism/SaintPage.vue')
            },
        ],
    },
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
})

export default router