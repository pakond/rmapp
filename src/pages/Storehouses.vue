<template>
  <q-page>
    <div class="flex justify-center bg-primary text-accent shadow-20">
      <q-banner>
        <template v-slot:avatar>
          <q-icon name="all_inbox" color="accent" class="bg-primary" />
        </template>
        <div class="q-pa-md">
          <div class="text-h5 q-mb-xs">{{ $t('storehouses_title') }}</div>
          <div class="q-my-xs">{{ $t('storehouses_title_msg') }}</div>
        </div>
      </q-banner>
    </div>
    <div class="flex justify-left q-pl-lg bg-accent text-primary shadow-20">
      <q-breadcrumbs>
        <q-breadcrumbs-el :label="$t('dashboard')" icon="dashboard" :to="{ path: '/' }" />
        <q-breadcrumbs-el :label="$t('storehouses')" icon="all_inbox" />
      </q-breadcrumbs>
    </div>
    <!-- content -->
    <Storehouses />
  </q-page>
</template>

<script>
import { Loading } from 'quasar'

export default {
  name: 'PageStorehouses',
  components: {
    Storehouses: () => import('components/Storehouses.vue')
  },
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
        // esta activa comprobamos que sea Provider
        if (store.getters['company/type'] !== 'Provider') {
          redirect('/')
        }
      }
    }
    Loading.hide()
  }
}
</script>
