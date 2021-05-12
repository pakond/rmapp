<template>
  <q-page>
    <div class="flex justify-center bg-primary text-accent shadow-20">
      <q-banner>
        <template v-slot:avatar>
          <q-icon name="business" color="accent" class="bg-primary" />
        </template>
        <div class="q-pa-md">
          <div class="text-h5 q-mb-xs">{{ $t('company_register_title') }}</div>
          <div class="q-my-xs">{{ $t('company_register_title_msg') }}</div>
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
  name: 'RegisterCompanyPage',
  components: {
    RegisterForm: () => import('components/RegisterCompanyForm.vue')
  },
  preFetch ({ store, currentRoute, previousRoute, redirect }) {
    Loading.show()
    if (store.getters['user/isAuthenticated'] === false) {
      // comprobamos si esta logeado, sino redirect al login
      redirect('/login')
    } else {
      // check a la empresa del usuario
      if (store.getters['company/get']) {
        // si ya tiene una redirect al dashboard
        redirect('/')
      }
    }
    Loading.hide()
  }
}
</script>
