<template>
  <q-page class="row justify-center">
    <q-form
    class="page-form q-gutter-xs q-gutter-y-lg q-pa-md q-ma-md bg-primary rounded-borders shadow-6"
    ref="profileForm"
    @submit="onSubmitProfile"
    v-if="profile"
    ><strong>{{ $t('profile_user_form') }}</strong>
      <q-input
        outlined
        color="dark"
        v-model="$store.getters['user/getEmail']"
        type="email"
        :label="$t('email_large')"
        :value="$store.getters['user/getEmail']"
        readonly
        :hint="$t('email')"
      >
        <template v-slot:prepend>
          <q-icon name="email" />
        </template>
      </q-input>
      <q-input
        outlined
        color="dark"
        type="text"
        :label="$t('name')"
        v-model="profile.name"
        :value="profile.name"
        :hint="$t('name_large')"
        :rules="[ val => val && val.length > 0 || $t('form_error_name')]"
      >
        <template v-slot:prepend>
          <q-icon name="person" />
        </template>
        <template v-slot:append>
          <q-icon name="edit" />
        </template>
      </q-input>
      <q-input
        outlined
        color="dark"
        v-model="date_joined"
        :label="$t('date_joined')"
        :value="date_joined"
        readonly
        :hint="$t('date_joined')"
      >
        <template v-slot:prepend>
          <q-icon name="date_range" />
        </template>
      </q-input>
      <q-input
        outlined
        color="dark"
        v-model="profile.country"
        type="text"
        :label="$t('country')"
        :value="profile.country"
        readonly
        :hint="$t('country')"
      >
        <template v-slot:prepend>
          <q-icon name="flag" />
        </template>
      </q-input>
      <q-input
        outlined
        color="dark"
        v-model="profile.state"
        type="text"
        :label="$t('state')"
        :value="profile.state"
        readonly
        :hint="$t('state')"
      >
        <template v-slot:prepend>
          <q-icon name="emoji_flags" />
        </template>
      </q-input>
      <q-input
        outlined
        color="dark"
        v-model="profile.timezone"
        type="text"
        :label="$t('timezone')"
        :value="profile.timezone"
        readonly
        :hint="$t('timezone')"
      >
        <template v-slot:prepend>
          <q-icon name="access_time" />
        </template>
      </q-input>
      <q-input
        outlined
        color="dark"
        v-model="profile.last_ip"
        type="text"
        :label="$t('last_ip')"
        :value="profile.last_ip"
        readonly
        :hint="$t('last_ip')"
      >
        <template v-slot:prepend>
          <q-icon name="trip_origin" />
        </template>
      </q-input>
      <q-input
        outlined
        color="dark"
        v-model="profile.os"
        type="text"
        :label="$t('os')"
        :value="profile.os"
        readonly
        :hint="$t('os')"
      >
        <template v-slot:prepend>
          <q-icon name="emoji_flags" />
        </template>
      </q-input>
      <q-btn :label="$t('save')" type="submit" color="accent"/>
    </q-form>
    <q-form
    class="page-form q-gutter-xs q-gutter-y-lg q-pa-md q-ma-md bg-primary rounded-borders shadow-6"
    ref="companyForm"
    v-if="company"
    @submit="onSubmitCompany"
    ><strong>{{ $t('profile_company_form') }}</strong>
      <q-input
        outlined
        color="dark"
        v-model="company.name"
        type="text"
        :label="$t('company')"
        :value="company.name"
        readonly
        :hint="$t('company')"
      >
        <template v-slot:prepend>
          <q-icon name="business" />
        </template>
      </q-input>
      <q-input
        outlined
        color="dark"
        v-model="company_type"
        type="text"
        :label="$t('company_type')"
        :value="company_type"
        readonly
        :hint="$t('company_type')"
      >
        <template v-slot:prepend>
          <q-icon name="merge_type" />
        </template>
      </q-input>
      <q-checkbox
        color="positive"
        v-model="company.dropshipping"
        v-if="company.type === 'Provider'"
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
        v-model="company.city"
        type="text"
        :label="$t('city')"
        :value="company.city"
        :hint="$t('city')"
        :rules="[ val => val && val.length > 0 || $t('form_error_city')]"
      >
        <template v-slot:prepend>
          <q-icon name="location_city" />
        </template>
        <template v-slot:append>
          <q-icon name="edit" />
        </template>
      </q-input>
      <q-input
        outlined
        color="dark"
        v-model="company.postal_code"
        type="number"
        :label="$t('postal_code')"
        :value="company.postal_code"
        :hint="$t('postal_code')"
        :rules="[ val => String(val).length >= 4 || $t('form_error_postal_code')]"
        lazy-rules
      >
        <template v-slot:prepend>
          <q-icon name="local_post_office" />
        </template>
        <template v-slot:append>
          <q-icon name="edit" />
        </template>
      </q-input>
      <q-input
        outlined
        color="dark"
        v-model="company.address"
        type="text"
        :label="$t('address')"
        :value="company.address"
        :hint="$t('address')"
        :rules="[ val => val && val.length > 0 || $t('form_error_address')]"
      >
        <template v-slot:prepend>
          <q-icon name="list_alt" />
        </template>
        <template v-slot:append>
          <q-icon name="edit" />
        </template>
      </q-input>
      <q-input
        outlined
        color="dark"
        v-model="company.phone"
        type="tel"
        :label="$t('phone')"
        :value="company.phone"
        :hint="$t('phone')"
        mask="phone"
        :rules="[ val => val && val.length > 14 || $t('form_error_phone')]"
        lazy-rules
      >
        <template v-slot:prepend>
          <q-icon name="phone" />
        </template>
        <template v-slot:append>
          <q-icon name="edit" />
        </template>
      </q-input>
      <q-input
        outlined
        readonly
        color="dark"
        v-model="company.is_active"
        type="text"
        :label="$t('verifyed')"
        :value="company.is_active"
        :hint="$t('verifyed')"
      >
        <template v-slot:prepend>
          <q-icon name="verified_user" />
        </template>
      </q-input>
      <q-btn :label="$t('save')" type="submit" color="accent"/>
    </q-form>
    <q-dialog v-model="alert2">
      <q-card>
        <q-card-section>
          <div class="text-h6" color="accent">{{ $t('profile_modify') }}</div>
        </q-card-section>
        <q-card-section>
          <span v-if="errors.message">{{ errors.message }}</span>
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
import { date, Loading } from 'quasar'

export default {
  name: 'Profile',
  data () {
    return {
      oldprofile: {},
      oldcompany: {},
      profile: {},
      company: {},
      user: {},
      date_joined: null,
      company_type: null,
      errors: {},
      alert: false,
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
    async getData () {
      // coje datos del la api
      Loading.show()
      this.user = await this.$apiHelper.getApi('user/')
      const profile = await this.$apiHelper.getApi('profile/')
      this.profile = profile.data[0]
      // asigna los datos de objetos distintos para comparar modificaciones
      this.oldprofile = Object.assign({}, this.profile)
      // modifica el formato de la fecha
      this.date_joined = date.formatDate(this.profile.date_joined, 'dddd DD MMMM YYYY')
      const company = await this.$apiHelper.getApi('company/')
      this.company = company.data[0]
      this.oldcompany = Object.assign({}, this.company)
      // si esta en español cambia el texto
      if (this.company.type === 'Provider') {
        this.company_type = this.$t('company_provider')
      } else {
        this.company_type = this.$t('company_retailer')
      }
      Loading.hide()
    },
    onSubmitProfile: function () {
      this.errors = {}
      this.$refs.profileForm.validate().then(success => {
        if (success) {
          // yay, models are correct
          this.updateProfile()
        }
      })
    },
    onSubmitCompany: function () {
      this.errors = {}
      this.$refs.companyForm.validate().then(success => {
        if (success) {
          // yay, models are correct
          this.updateCompany()
        }
      })
    },
    updateProfile: async function () {
      Loading.show()
      const dataprofile = { name: this.profile.name }
      // Modifica los datos del perfil en la API
      if (this.comparaObjetos(this.oldprofile, this.profile) === true) {
        this.$set(this.errors, 'message', this.$t('profile_extra_info'))
        this.alert2 = true
      } else {
        const responseprofile = await this.$apiHelper.patchApi('profile/' + this.profile.id + '/', dataprofile)
        if (responseprofile.statusText === 'OK') {
          // se ha modificado el perfil
          this.oldprofile = Object.assign({}, this.profile)
          this.alert2 = true
        } else {
          // hay errores al modificar el perfil
          this.$set(this.errors, 'message', responseprofile.message)
          this.alert2 = true
        }
      }
      Loading.hide()
    },
    updateCompany: async function () {
      Loading.show()
      const datacompany = { dropshipping: this.company.dropshipping, city: this.company.city, postal_code: this.company.postal_code, address: this.company.address, phone: this.company.phone }
      // Modifica los datos de la empresa en la API
      if (this.comparaObjetos(this.oldcompany, this.company) === true) {
        this.$set(this.errors, 'message', this.$t('profile_extra_info'))
        this.alert2 = true
      } else {
        const responsecompany = await this.$apiHelper.patchApi('company/' + this.company.id + '/', datacompany)
        if (responsecompany.statusText === 'OK') {
          // se ha modificado la empresa
          this.oldcompany = Object.assign({}, this.company)
          this.alert2 = true
        } else {
          // hay errores al modificar la empresa
          this.$set(this.errors, 'message', responsecompany.message)
          this.alert2 = true
        }
      }
      Loading.hide()
    },
    comparaObjetos: function (a, b) {
      // compara valor propiedades objetos
      var aKeys = Object.keys(a).sort()
      var bKeys = Object.keys(b).sort()
      if (aKeys.length !== bKeys.length) {
        return false
      }
      if (aKeys.join('') !== bKeys.join('')) {
        return false
      }
      for (var i = 0; i < aKeys.length; i++) {
        if (a[aKeys[i]] !== b[bKeys[i]]) {
          return false
        }
      }
      return true
    }
  }
}
</script>

<style scope>
.page-form {
  width: 100%;
}
@media only screen and (min-width: 1023px) {
  .page-form{
    width: 43%;
  }
}
</style>
