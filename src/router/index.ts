import {createRouter, createWebHistory} from '@ionic/vue-router'
import {RouteRecordRaw} from 'vue-router'
import HomePage from '../views/HomePage.vue'
import SettingsPage from '../views/SettingsPage.vue'
import BiblePage from '../components/organism/BiblePage.vue'
import SaintPage from "@/components/organism/SaintPage.vue";
import TabsNavbar from "@/components/molecules/TabsNavbar.vue";
import BibleBookPage from "@/components/organism/bible/BibleBookPage.vue";
import BibleChapterPage from "@/components/organism/bible/BibleChapterPage.vue";
import PrivacyPage from "@/components/organism/PrivacyPage.vue";

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
                component: BiblePage
            }, {
                path: '/bible/:id',
                name: 'BibleBook',
                component: BibleBookPage
            },
            {
                path: '/bible/:id/:chapter',
                name: 'BibleChapter',
                component: BibleChapterPage
            },
            {
                path: '/settings',
                name: 'Settings',
                component: SettingsPage
            }, {
                path: '/privacy',
                name: 'Privacy',
                component: PrivacyPage
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