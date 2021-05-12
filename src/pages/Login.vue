<template>
  <q-page>
    <div class="flex justify-center bg-primary text-accent shadow-20">
      <q-banner>
        <template v-slot:avatar>
          <q-icon name="person" color="accent" class="bg-primary" />
        </template>
        <div class="q-pa-md">
          <div class="text-h5 q-mb-xs">{{ $t('login_title') }}</div>
          <div class="q-my-xs">{{ $t('login_title_msg') }}</div>
        </div>
      </q-banner>
    </div>
    <!-- content -->
    <LoginForm />
  </q-page>
</template>

<script>
import { Loading } from 'quasar'

export default {
  name: 'PageLogin',
  components: {
    LoginForm: () => import('components/LoginForm.vue')
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
