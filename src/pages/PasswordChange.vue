<template>
  <q-page>
    <div class="flex justify-center bg-primary text-accent shadow-20">
      <q-banner>
        <template v-slot:avatar>
          <q-icon name="lock" color="accent" class="bg-primary" />
        </template>
        <div class="q-pa-md">
          <div class="text-h5 q-mb-xs">{{ $t('password_change_title') }}</div>
          <div class="q-my-xs">{{ $t('password_change_title_msg') }}</div>
        </div>
      </q-banner>
    </div>
    <div class="flex justify-left q-pl-lg bg-accent text-primary shadow-20">
      <q-breadcrumbs>
        <q-breadcrumbs-el :label="$t('dashboard')" icon="dashboard" :to="{ path: '/' }" />
        <q-breadcrumbs-el :label="$t('password_change_title')" icon="lock" />
      </q-breadcrumbs>
    </div>
    <!-- content -->
    <PasswordChangeForm />
  </q-page>
</template>

<script>
import { Loading } from 'quasar'

export default {
  name: 'PagePasswordChange',
  components: {
    PasswordChangeForm: () => import('components/PasswordChangeForm.vue')
  },
  preFetch ({ store, currentRoute, previousRoute, redirect }) {
    Loading.show()
    if (store.getters['user/isAuthenticated'] === false) {
      redirect('/login')
    }
    Loading.hide()
  }
}
</script>
