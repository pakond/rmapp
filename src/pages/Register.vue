<template>
  <q-page>
    <div class="flex justify-center bg-primary text-accent shadow-20">
      <q-banner>
        <template v-slot:avatar>
          <q-icon name="how_to_reg" color="accent" class="bg-primary" />
        </template>
        <div class="q-pa-md">
          <div class="text-h5 q-mb-xs">{{ $t('register_title') }}</div>
          <div class="q-my-xs">{{ $t('register_title_msg') }}</div>
        </div>
      </q-banner>
    </div>
    <!-- content -->
    <RegisterForm />
  </q-page>
</template>

<script>
import { Loading } from 'quasar'

export default {
  name: 'RegisterPage',
  components: {
    RegisterForm: () => import('components/RegisterForm.vue')
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
