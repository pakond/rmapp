<template>
  <q-page>
    <div class="flex justify-center bg-primary text-accent shadow-20">
      <q-banner>
        <template v-slot:avatar>
          <q-icon name="business" color="accent" class="bg-primary" />
        </template>
        <div class="q-pa-md">
          <div class="text-h5 q-mb-xs">{{ $t('retailer_title') }}</div>
          <div class="q-my-xs">{{ $t('retailer_title_msg') }}</div>
        </div>
      </q-banner>
    </div>
    <div class="flex justify-left q-pl-lg bg-accent text-primary shadow-20">
      <q-breadcrumbs>
        <q-breadcrumbs-el :label="$t('dashboard')" icon="dashboard" />
      </q-breadcrumbs>
    </div>
    <!-- content -->
    <DashboardRetailer />
  </q-page>
</template>

<script>
import { Loading } from 'quasar'

export default {
  name: 'PageRetailer',
  components: {
    DashboardRetailer: () => import('components/DashboardRetailer.vue')
  },
  preFetch ({ store, currentRoute, previousRoute, redirect }) {
    Loading.show()
    if (store.getters['company/type'] !== 'Retailer') {
      // no correspone este dashboard al tipo de compañia
      redirect('/')
    }
    Loading.hide()
  }
}
</script>
