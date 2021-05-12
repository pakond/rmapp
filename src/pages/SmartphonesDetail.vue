<template>
  <q-page>
    <div class="flex justify-center bg-primary text-accent shadow-20">
      <q-banner>
        <template v-slot:avatar>
          <q-icon name="phone_android" color="accent" class="bg-primary" />
        </template>
        <div class="q-pa-md">
          <div class="text-h5 q-mb-xs">{{ $t('smartphones_detail_title') }}</div>
          <div class="q-my-xs">{{ $t('smartphones_detail_title_msg') }}</div>
        </div>
      </q-banner>
    </div>
    <div class="flex justify-left q-pl-lg bg-accent text-primary shadow-20">
      <q-breadcrumbs>
        <q-breadcrumbs-el :label="$t('dashboard')" icon="dashboard" :to="{ path: '/' }" />
        <q-breadcrumbs-el :label="$t('smartphones')" icon="phone_android" :to="{ path: '/smartphones' }" />
        <q-breadcrumbs-el :label="$t('smartphones_detail')" icon="details" />
      </q-breadcrumbs>
    </div>
    <!-- content -->
    <SmartphoneDetail />
  </q-page>
</template>

<script>
import { Loading } from 'quasar'

export default {
  name: 'SmartphonePage',
  components: {
    SmartphoneDetail: () => import('components/SmartphoneDetail.vue')
  },
  preFetch ({ store, currentRoute, previousRoute, redirect }) {
    Loading.show()
    if (store.getters['user/isAuthenticated'] !== true) {
      redirect('/login')
    }
    Loading.hide()
  }
}
</script>
