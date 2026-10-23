import {createI18n} from "vue-i18n";
import es from '@/modules/app/locales/es.json'
import en from '@/modules/app/locales/en.json'

// Shared instance so code outside components (e.g. scheduled notifications) can translate too
export const i18n = createI18n({
    locale: 'es',
    fallbackLocale: 'es',
    warnHtmlMessage: false,
    warnHtmlInMessage: 'off',
    messages: {
        es,
        en
    },
})
