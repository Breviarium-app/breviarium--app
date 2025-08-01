import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import {IonicVue} from '@ionic/vue'
import {createPinia} from "pinia";

/* Core CSS required for Ionic components to work properly */
import '@ionic/vue/css/core.css'

/* Basic CSS for apps built with Ionic */
import '@ionic/vue/css/normalize.css'
import '@ionic/vue/css/structure.css'
import '@ionic/vue/css/typography.css'

/* Optional CSS utils that can be commented out */
import '@ionic/vue/css/padding.css'
import '@ionic/vue/css/float-elements.css'
import '@ionic/vue/css/text-alignment.css'
import '@ionic/vue/css/text-transformation.css'
import '@ionic/vue/css/flex-utils.css'
import '@ionic/vue/css/display.css'

import '@/style.css'
import {createI18n} from "vue-i18n";
import es from '@/locales/es.json'
import en from '@/locales/en.json'

const pinia = createPinia();

const i18n = createI18n({
    locale: 'es',
    fallbackLocale: 'es',
    warnHtmlMessage: false,
    warnHtmlInMessage: 'off',
    messages: {
        es,
        en
    },
})

const app = createApp(App)
    .use(IonicVue, {mode: 'ios'})
    .use(pinia)
    .use(i18n)
    .use(router)

router.isReady().then(() => {
    app.mount('#app')
    // perpetualCalendar(2025).then(console.log)
})