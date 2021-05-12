<template>
  <q-page class="flex flex-center">
    <div class="text-center" style="margin-bottom: 2%">
      <span class="text-h4 text-bold" style="font-family: Montserrat, sans-serif; color: #413e66;">Pagina principal</span>
    </div>
  </q-page>
</template>

<script>
import { Loading } from 'quasar'

export default {
  name: 'PageIndex',
  async preFetch ({ store, currentRoute, previousRoute, redirect }) {
    Loading.show()
    if (store.getters['user/isAuthenticated'] === false) {
      redirect('/login')
    } else {
      // check a la empresa del usuario
      if (!store.getters['company/get']) {
        // si no tiene una redirect al registro de empresa
        redirect('/register/company')
      } else if (store.getters['company/isActive'] !== true) {
        // si tiene pero no esta activa
        await store.dispatch('user/logout')
        redirect('/login')
      } else {
        // esta activa le mandamos al tipo de dashboard
        redirect('/' + store.getters['company/type'])
      }
    }
    Loading.hide()
  }
}
</script>
