<template>
  <q-page>
    <q-form
      class="storehouses-form q-gutter-xs q-gutter-y-lg q-pa-md q-ma-md bg-primary rounded-borders shadow-6"
      ref="StorehousesForm"
      @submit="onSubmit"
      v-if="storehouses"
    >
      <q-expansion-item expand-icon-class="text-positive" expand-icon="add_box">
        <q-card>
          <q-card-section>
            <div class="row">
              <div class="col-9">
                <q-input
                  dense
                  outlined
                  v-model="newStorehouse"
                  color="dark"
                  type="text"
                  :label="$t('location')"
                  :hint="$t('location')"
                >
                  <template v-slot:prepend>
                    <q-icon name="location_city" />
                  </template>
                </q-input>
              </div>
              <div class="col-3 q-pl-md q-mt-sm">
                <q-btn :label="$t('add')" size="sm" color="accent" @click="addStorehouse()" v-if="newStorehouse"/>
                <q-btn :label="$t('add')" size="sm" color="accent" @click="addStorehouse()" disable v-else/>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </q-expansion-item>
      <div v-for="(storehouse, index) in storehouses" :key="index">
        <div class="text-left">
          <strong>{{ $t('storehouse') }} {{ index + 1 }}</strong> : {{ $t('contains') }} <strong>{{ storehouses[index].stocks }}</strong> stocks
        </div>
        <div class="row">
          <div class="col-9">
            <q-input
              dense
              outlined
              color="dark"
              v-model="storehouses[index].location"
              type="text"
              :label="$t('location')"
              :value="storehouses[index].location"
              :hint="$t('city')"
              :rules="[
                val => val && val.length > 0 || $t('form_error_city'),
                val => val && val.length < 24 || $t('form_error_city_large')
              ]"
              lazy-rules
            >
              <template v-slot:prepend>
                <q-icon name="location_city" />
              </template>
              <template v-slot:append>
                <q-icon name="edit" />
              </template>
            </q-input>
          </div>
          <div class="col-3 q-mt-sm q-pl-md">
            <q-btn
              color="negative"
              icon="delete_forever"
              size="sm"
              @click="delStorehouse = storehouse, delStorehouse.index = index + 1, alertDel = true"
              v-if="storehouses.length >= 2"
              />
              <q-btn
              color="negative"
              icon="delete_forever"
              size="sm"
              @click="delStorehouse = storehouse, delStorehouse.index = index + 1, alertDel = true"
              disable
              v-else
              />
          </div>
        </div>
      </div>
      <q-btn :label="$t('save')" type="submit" color="accent"/>
    </q-form>
    <q-dialog v-model="alertDel">
      <q-card>
        <q-card-section>
          <div class="text-h6" color="accent">{{ $t('storehouses_delete') }} {{ delStorehouse.index }}</div>
        </q-card-section>
        <q-card-section>
          {{ $t('storehouses_delete_info', { storehouse: delStorehouse.location, stocks: delStorehouse.stocks  }) }}
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat :label="$t('cancel')" color="accent" v-close-popup />
          <q-btn flat :label="$t('delete')" color="accent" v-close-popup @click="deleteStorehouse()"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="alert2">
      <q-card>
        <q-card-section>
          <div class="text-h6" color="accent">{{ $t('storehouses_modify') }}</div>
        </q-card-section>
        <q-card-section>
          <span v-if="error">{{ error }}</span>
          <span v-else>{{ $t('profile_info') }}</span>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="OK" color="accent" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { Loading } from 'quasar'

export default {
  name: 'Storehouses',
  data () {
    return {
      error: null,
      storehouses: [],
      stocks: [],
      oldStorehouses: [],
      newStorehouse: null,
      delStorehouse: {},
      alertDel: false,
      alert2: false
    }
  },
  created () {
    this.getData()
  },
  watch: {
    // call again the method if the route changes
    '$route': 'getData'
  },
  methods: {
    getData: async function () {
      // coje datos del la api
      Loading.show()
      const storehouses = await this.$apiHelper.getApi('storehouses/')
      this.storehouses = storehouses.data
      // asigna los datos de objetos distintos para comparar modificaciones
      this.oldStorehouses = JSON.parse(JSON.stringify(this.storehouses))
      this.stocks = await this.$apiHelper.getApi('stocks/')
      this.stocks = this.stocks.data
      // cuenta el numero de stocks en cada almacen
      for (const index in this.storehouses) {
        this.$set(this.storehouses[index], 'stocks', 0)
        this.stocks.forEach(element => {
          if (element.store === this.storehouses[index].id) {
            this.storehouses[index].stocks = this.storehouses[index].stocks + 1
          }
        })
      }
      Loading.hide()
    },
    addStorehouse: async function () {
      await this.$apiHelper.postApi('storehouses/', { location: this.newStorehouse })
      this.newStorehouse = null
      await this.getData()
    },
    deleteStorehouse: async function () {
      await this.$apiHelper.deleteApi('storehouses/' + this.delStorehouse.id + '/')
      await this.getData()
    },
    onSubmit: function () {
      this.$refs.StorehousesForm.validate().then(async success => {
        if (success) {
          // yay, models are correct
          this.updateStorehouses()
        }
      })
    },
    updateStorehouses: async function () {
      Loading.show()
      // Modifica los datos del store en la API
      let modificado = false
      this.error = null
      for (let i = 0; i < this.storehouses.length; i++) {
        if (this.storehouses[i].location !== this.oldStorehouses[i].location) {
          // hay cambios modificamos en la API
          await this.$apiHelper.patchApi('storehouses/' + this.storehouses[i].id + '/', { location: this.storehouses[i].location })
          modificado = true
        }
      }
      if (modificado !== true) {
        this.error = this.$t('profile_extra_info')
      } else {
        this.oldStorehouses = JSON.parse(JSON.stringify(this.storehouses))
      }
      this.alert2 = true
      Loading.hide()
    }
  }
}
</script>

<style lang="sass" scoped>
.storehouses-form
  width: 92%
  margin-left: auto
  margin-right: auto

@media only screen and (min-width: 768px)
  .storehouses-form
    width: 47%
</style>
