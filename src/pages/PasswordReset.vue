<template>
  <q-page>
    <div class="flex justify-center bg-primary text-accent shadow-20">
      <q-banner>
        <template v-slot:avatar>
          <q-icon name="lock" color="accent" class="bg-primary" />
        </template>
        <div class="q-pa-md">
          <div class="text-h5 q-mb-xs">{{ $t('password_reset_title') }}</div>
          <div class="q-my-xs">{{ $t('password_reset_title_msg') }}</div>
        </div>
      </q-banner>
    </div>
    <div class="flex justify-center bg-accent text-primary shadow-20">
      <q-breadcrumbs>
        <q-breadcrumbs-el :label="$t('login')" icon="person" :to="{ path: '/login' }" />
        <q-breadcrumbs-el :label="$t('password_reset_title')" icon="lock" />
      </q-breadcrumbs>
    </div>
    <!-- content -->
    <PasswordResetForm />
  </q-page>
</template>

<script>
import { Loading } from 'quasar'

export default {
  name: 'PagePasswordReset',
  components: {
    PasswordResetForm: () => import('components/PasswordResetForm.vue')
  },
  preFetch ({ store, currentRoute, previousRoute, redirect }) {
    Loading.show()
    if (store.getters['user/isAuthenticated'] === true) {
      redirect('/')
    }
    Loading.hide()
  }
}
</script>
