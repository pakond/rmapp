<template>
  <q-page>
    <div class="flex justify-center bg-primary text-accent shadow-20">
      <q-banner>
        <template v-slot:avatar>
          <q-icon name="account_circle" color="accent" class="bg-primary" />
        </template>
        <div class="q-pa-md">
          <div class="text-h5 q-mb-xs">{{ $t('profile_title') }}</div>
          <div class="q-my-xs">{{ $t('profile_title_msg') }}</div>
        </div>
      </q-banner>
    </div>
    <div class="flex justify-left q-pl-lg bg-accent text-primary shadow-20">
      <q-breadcrumbs>
        <q-breadcrumbs-el :label="$t('dashboard')" icon="dashboard" :to="{ path: '/' }" />
        <q-breadcrumbs-el :label="$t('profile')" icon="account_circle" />
      </q-breadcrumbs>
    </div>
    <!-- content -->
    <ProfileForm />
  </q-page>
</template>

<script>
import { Loading } from 'quasar'

export default {
  name: 'PageProfile',
  components: {
    ProfileForm: () => import('components/ProfileForm.vue')
  },
  preFetch ({ store, currentRoute, previousRoute, redirect }) {
    Loading.show()
    if (store.getters['user/isAuthenticated'] === false) {
      redirect('/login')
    } else {
      // check a la empresa del usuario
      if (!store.getters['company/get']) {
        // si no tiene una redirect al registro de empresa
        redirect('/register/company')
      }
    }
    Loading.hide()
  }
}
</script>
