<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
import { Loading, Quasar, LocalStorage } from 'quasar'
import { axiosInstance } from 'boot/axios'
import { i18n } from 'boot/i18n'

export default {
  name: 'App',
  async preFetch ({ store, currentRoute, previousRoute, redirect }) {
    Loading.show()
    let langIso = LocalStorage.getItem('language')
    if (!langIso) {
      // si no hay lang en el storage
      langIso = Quasar.lang.getLocale()
      // cojemos el lang del navegador
      if (langIso === 'es-es') {
        langIso = langIso.split('-')
        langIso = langIso[0]
      } else {
        langIso = 'en-us'
      }
    }
    // set lang
    i18n.locale = langIso
    // set lang header for api
    axiosInstance.defaults.headers.common['Accept-Language'] = langIso
    // set quasar's language too!!
    import('quasar/lang/' + langIso)
      .then(lang => {
        Quasar.lang.set(lang.default)
      })
    // evento para logout en varias tabs/ventanas
    window.addEventListener('storage', async evt => {
      if (evt.key === 'logout') {
        if (store.getters['user/isAuthenticated'] === true) {
          await store.dispatch('user/logout')
          redirect('/login')
        }
      }
    })
    // comprueba token y logeo
    await store.dispatch('user/checkToken')
    if (store.getters['user/isAuthenticated'] === true) {
      // timeout del token
      await store.dispatch('user/timeoutToken')
      // setea email y compañia
      await store.dispatch('user/email')
      await store.dispatch('company/set')
    }
    Loading.hide()
  }
}
</script>
