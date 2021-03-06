import Vue from 'vue'
import VueI18n from 'vue-i18n'
import messages from 'src/i18n'
import { Quasar } from 'quasar'

let langIso = Quasar.lang.getLocale()
if (langIso === 'es-es') {
  langIso = langIso.split('-')
  langIso = langIso[0]
} else {
  langIso = 'en-us'
}

Vue.use(VueI18n)

const i18n = new VueI18n({
  locale: langIso,
  fallbackLocale: 'en-us',
  messages
})

export default ({ app }) => {
  // Set i18n instance on app
  app.i18n = i18n
}

export { i18n }
