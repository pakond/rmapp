<template>
  <q-page>
    <div class="flex justify-center bg-primary text-accent shadow-20">
      <q-banner>
        <template v-slot:avatar>
          <q-icon name="business" color="accent" class="bg-primary" />
        </template>
        <div class="q-pa-md">
          <div class="text-h5 q-mb-xs">{{ $t('provider_title') }}</div>
          <div class="q-my-xs">{{ $t('provider_title_msg') }}</div>
        </div>
      </q-banner>
    </div>
    <div class="flex justify-left q-pl-lg bg-accent text-primary shadow-20">
      <q-breadcrumbs>
        <q-breadcrumbs-el :label="$t('dashboard')" icon="dashboard" />
      </q-breadcrumbs>
    </div>
    <!-- content -->
    <DashboardProvider />
  </q-page>
</template>

<script>
import { Loading } from 'quasar'

export default {
  name: 'PageProvider',
  components: {
    DashboardProvider: () => import('components/DashboardProvider.vue')
  },
  preFetch ({ store, currentRoute, previousRoute, redirect }) {
    Loading.show()
    if (store.getters['company/type'] !== 'Provider') {
      // no correspone este dashboard al tipo de compañia
      redirect('/')
    }
    Loading.hide()
  }
}
</script>
