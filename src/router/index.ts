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
                name: 'Officium',
                component: () => import('../components/organism/prayers/OfficiumPage.vue')
            }, {
                path: '/prayer/completorium',
                name: 'Completorium',
                component: () => import('../components/organism/prayers/CompletoriumPage.vue')
            }, {
                path: '/prayer/evangelium',
                name: 'Evangelium',
                component: () => import('../components/organism/prayers/EvangeliumAndLectiones.vue')
            }, {
                path: '/popular-prayers',
                name: 'popular-prayers',
                component: () => import('../components/organism/prayers/PopularPrayers.vue')
            }, {
                path: '/saint',
                name: 'Saint',
                component: () => import('../components/organism/SaintPage.vue')
            }, {
                path: '/:year/:month/:day',
                name: 'Date',
                component: HomePage,
            }, {
                path: '/:year/:month/:day/laudes',
                name: 'DateLaudes',
                component: () => import('../components/organism/prayers/LaudesPage.vue')
            }, {
                path: '/:year/:month/:day/vesperae',
                name: 'DateVesperae',
                component: () => import('../components/organism/prayers/VesperaePage.vue')
            }, {
                path: '/:year/:month/:day/tertia',
                name: 'DateTertia',
                component: () => import('../components/organism/prayers/TertiaPage.vue')
            }, {
                path: '/:year/:month/:day/sexta',
                name: 'DateSexta',
                component: () => import('../components/organism/prayers/SextaPage.vue')
            }, {
                path: '/:year/:month/:day/nona',
                name: 'DateNona',
                component: () => import('../components/organism/prayers/NonaPage.vue')
            }, {
                path: '/:year/:month/:day/officium',
                name: 'DateOfficium',
                component: () => import('../components/organism/prayers/OfficiumPage.vue')
            }, {
                path: '/:year/:month/:day/completorium',
                name: 'DateCompletorium',
                component: () => import('../components/organism/prayers/CompletoriumPage.vue')
            }, {
                path: '/:year/:month/:day/evangelium',
                name: 'DateEvangelium',
                component: () => import('../components/organism/prayers/EvangeliumAndLectiones.vue')
            }, {
                path: '/:year/:month/:day/saint',
                name: 'DateSaint',
                component: () => import('../components/organism/SaintPage.vue')
            }, {
                path: '/:pathMatch(.*)*',
                redirect: '/home'
            }
        ],
    },
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
})

export default router