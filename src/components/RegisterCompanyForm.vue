<template>
  <q-page>
    <q-form
    class="page-form q-gutter-xs q-gutter-y-lg q-pa-lg q-ma-lg bg-primary rounded-borders shadow-6"
    ref="registerForm"
    @submit="onSubmit"
    @reset="onReset"
    v-if="!regSuccess"
    ><strong>{{ $t('company_register_form') }}</strong>
     <p>{{ $t('register_step_two') }}</p>
      <div class="form-label-group">
        <div class="errors-div">
          {{ errors.name }}
        </div>
        <q-input
          outlined
          color="dark"
          v-model="name"
          type="text"
          :label="$t('company')"
          :hint="$t('company_large')"
          :rules="[ val => val && val.length > 0 || $t('form_error_company')]"
        >
         <template v-slot:prepend>
          <q-icon name="business" />
        </template>
        </q-input>
      </div>
      <q-select
        outlined
        color="dark"
        options-selected-class="text-dark"
        v-model="type"
        :options="options"
        :label="$t('company_type')"
        :hint="$t('company_type')"
        :rules="[ val => val && val.length > 0 || $t('form_error_select_company')]"
      >
        <template v-slot:prepend>
          <q-icon name="merge_type" />
        </template>
      </q-select>
      <q-checkbox
        color="positive"
        v-model="dropshipping"
        v-if="type === 'Provider' || type === 'Proveedor'"
        @click="alert = true"
      >
        <a href="" @click.prevent="alert = true">{{ $t('allow_dropshipping') }}</a>
      </q-checkbox>
      <q-dialog v-model="alert">
        <q-card>
          <q-card-section>
            <div class="text-h6" color="accent">{{ $t('dropshipping') }}</div>
          </q-card-section>
          <q-card-section>
            {{ $t('dropshipping_info') }}
          </q-card-section>
          <q-card-actions align="right">
            <q-btn flat label="OK" color="accent" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>
      <q-input
        outlined
        color="dark"
        v-model="city"
        type="text"
        :label="$t('city')"
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
      </q-input>
      <div class="form-label-group">
        <div class="errors-div">
          {{ errors.cp }}
        </div>
        <q-input
          v-model="cp"
          type="number"
          outlined
          color="dark"
          :label="$t('postal_code')"
          :hint="$t('postal_code')"
          :rules="[ val => String(val).length >= 4 || $t('form_error_postal_code')]"
          lazy-rules
        >
          <template v-slot:prepend>
            <q-icon name="local_post_office" />
          </template>
        </q-input>
      </div>
      <q-input
        outlined
        color="dark"
        v-model="address"
        type="text"
        :label="$t('address')"
        :hint="$t('address')"
        :rules="[ val => val && val.length > 0 || $t('form_error_address')]"
      >
        <template v-slot:prepend>
          <q-icon name="list_alt" />
        </template>
      </q-input>
      <q-input
        outlined
        color="dark"
        v-model="phone"
        type="tel"
        :label="$t('phone')"
        mask="phone"
        unmasked-value
        :hint="$t('phone')"
        :rules="[ val => val && val.length > 0 || $t('form_error_phone')]"
      >
        <template v-slot:prepend>
          <q-icon name="phone" />
        </template>
      </q-input>
      <q-page-container>
        <q-btn :label="$t('send')" type="submit" color="accent"/>
        <q-btn :label="$t('reset')" type="reset" color="negative" flat class="q-ml-sm" />
      </q-page-container>
    </q-form>
    <q-dialog v-model="regSuccess">
      <q-card>
        <q-card-section>
          <div class="text-h6" color="accent">{{ $t('company_register_info') }}</div>
        </q-card-section>
        <q-card-section>
          <p>{{ $t('company_register_extra_info') }}</p>
          <p>{{ $t('company_register_extra_info2') }}</p>
          <p>{{ $t('company_register_extra_info3') }}</p>
          <p>{{ $t('company_register_extra_info4') }}</p>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="OK" color="accent" v-close-popup @click="finishReg()" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { Loading } from 'quasar'

export default {
  name: 'Register',
  data () {
    return {
      errors: {},
      name: null,
      type: null,
      en_type: null,
      city: null,
      cp: null,
      address: null,
      phone: null,
      dropshipping: false,
      alert: false,
      regSuccess: false,
      options: [
        this.$t('company_retailer'), this.$t('company_provider')
      ]
    }
  },
  methods: {
    finishReg: async function () {
      await this.$store.dispatch('user/logout')
      this.$router.push('/login')
    },
    onSubmit: function () {
      this.errors = {}
      this.$refs.registerForm.validate().then(success => {
        if (success) {
          // yay, models are correct
          this.registerApi()
        }
      })
    },
    onReset: function () {
      // to reset validations:
      this.name = null
      this.type = null
      this.dropshipping = false
      this.city = null
      this.cp = null
      this.address = null
      this.phone = null
      this.errors = {}
      this.$refs.registerForm.resetValidation()
    },
    // Funcion de registro en la API
    registerApi: async function () {
      Loading.show()
      this.errors = {}
      // si esta en español lo cambia a ingles para la api
      if (this.type === 'Proveedor') {
        this.en_type = 'Provider'
      } else {
        this.en_type = 'Retailer'
      }
      const datacompany = { name: this.name, type: this.en_type, dropshipping: this.dropshipping, city: this.city, postal_code: this.cp, address: this.address, phone: this.phone }
      // Registramos la empresa con los datos del formulario
      const responsecompany = await this.$apiHelper.postApi('company/', datacompany)
      if (responsecompany.statusText === 'Created') {
        if (this.en_type === 'Provider') {
          // si es proveedor añadimos store
          const datastore = { location: this.city }
          await this.$apiHelper.postApi('storehouses/', datastore)
        }
        this.regSuccess = true
      } else {
        // hay errores al crear la empresa
        this.$set(this.errors, 'name', responsecompany.response.data)
      }
      Loading.hide()
    }
  }
}
</script>

<style lang="sass" scoped>
.page-form
  width: 90%
  margin-left: auto
  margin-right: auto

@media only screen and (min-width: 768px)
  .page-form
    width: 45%

.errors-div
  color: $negative
  font-size: 85%
  text-align: left

</style>
