<template>
  <q-page>
    <q-form
    class="page-form q-gutter-xs q-gutter-y-lg q-pa-lg q-ma-lg bg-primary rounded-borders shadow-6"
    ref="registerForm"
    @submit="onSubmit"
    @reset="onReset"
    ><strong>{{ $t('register_form') }}</strong>
      <p>{{ $t('register_step_one') }}</p>
      <div class="errors-div">
        {{ errors.many }}
      </div>
      <div class="form-label-group">
        <div class="errors-div">
          <ul class="errors-ul">
            <li v-for="emailerror in errors.email" v-bind:key="emailerror">
              {{ emailerror }}
            </li>
          </ul>
        </div>
        <q-input
          outlined
          color="dark"
          v-model="email"
          type="email"
          :label="$t('email_large')"
          :hint="$t('email')"
          :rules="[
            val => val && val.length > 0 || $t('form_error_email'),
            val => val.includes( '@') && val.includes( '.') || $t('form_error_extra_email'),
          ]"
          lazy-rules
        >
          <template v-slot:prepend>
            <q-icon name="email" />
          </template>
        </q-input>
      </div>
      <div class="form-label-group">
        <div class="errors-div">
          {{ errors.name }}
        </div>
        <q-input
          outlined
          color="dark"
          v-model="name"
          type="text"
          :label="$t('name')"
          :hint="$t('name_large')"
          :rules="[ val => val && val.length > 0 || $t('form_error_name')]"
        >
          <template v-slot:prepend>
            <q-icon name="person" />
          </template>
        </q-input>
      </div>
      <div class="form-label-group">
        <div class="errors-div">
          <ul class="errors-ul">
            <li v-for="passerror in errors.password" v-bind:key="passerror">
              {{ passerror }}
            </li>
          </ul>
        </div>
        <q-input
          v-model="password1"
          outlined
          color="dark"
          :type="isPwd ? 'password' : 'text'"
          :label="$t('password')"
          :hint="$t('password')"
          :rules="[ val => val && val.length > 0 || $t('form_error_password')]"
        >
          <template v-slot:prepend>
            <q-icon name="lock" />
          </template>
          <template v-slot:append>
            <q-icon
              :name="isPwd ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="isPwd = !isPwd"
            />
          </template>
        </q-input>
      </div>
      <div class="form-label-group">
        <div class="errors-div">
          {{ errors.repassword }}
        </div>
        <q-input
          v-model="password2"
          outlined
          color="dark"
          :type="isPwd ? 'password' : 'text'"
          :label="$t('password')"
          :hint="$t('repassword')"
          :rules="[val => val && val.length > 0 || $t('form_error_password')]"
        >
          <template v-slot:prepend>
            <q-icon name="lock" />
          </template>
          <template v-slot:append>
            <q-icon
              :name="isPwd ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="isPwd = !isPwd"
            />
          </template>
        </q-input>
      </div>
      <q-checkbox
        v-model="checkbox"
        @click="alert = true"
        color="positive"
      >
        <i18n path="register_form_terms" for="terms">
          <a href="" @click.prevent="alert = true">{{ $t('terms') }}</a>
        </i18n>
        <div class="errors-div">
          {{ errors.checkbox }}
        </div>
      </q-checkbox>
      <q-dialog v-model="alert">
        <q-card>
          <q-card-section>
            <div class="text-h6" color="accent">{{ $t('terms') }}</div>
          </q-card-section>
          <q-card-section>
            {{ $t('terms') }}
          </q-card-section>
          <q-card-actions align="right">
            <q-btn flat label="OK" color="accent" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>
      <q-page-container>
        <q-btn :label="$t('register')" type="submit" color="accent"/>
        <q-btn :label="$t('reset')" type="reset" color="negative" flat class="q-ml-sm" />
      </q-page-container>
      <p>{{ $t('register_form_info') }} <a href="" @click.prevent="$router.push('/login')">{{ $t('identify') }}</a></p>
    </q-form>
  </q-page>
</template>

<script>
import geolocator from 'geolocator'
import { Loading } from 'quasar'

export default {
  name: 'Register',
  data () {
    return {
      errors: {},
      location: {},
      email: null,
      password1: null,
      password2: null,
      isPwd: true,
      name: null,
      checkbox: false,
      alert: false
    }
  },
  mounted: function () {
    // Al montarse la instancia vue llamamos a la funcion del geolocator
    this.location = {}
    this.getlocation().then(geolocation => { this.location = geolocation })
  },
  methods: {
    onSubmit: function () {
      this.errors = {}
      this.$refs.registerForm.validate().then(success => {
        if (success) {
          // yay, models are correct
          if (this.checkbox === false) {
            this.$set(this.errors, 'checkbox', this.$t('form_error_terms'))
          } else if (this.password1 !== this.password2) {
            this.$set(this.errors, 'repassword', this.$t('form_error_repassword'))
          } else {
            this.registerApi()
          }
        }
      })
    },
    onReset: function () {
      // to reset validations:
      this.email = null
      this.name = null
      this.password1 = null
      this.password2 = null
      this.checkbox = false
      this.errors = {}
      this.$refs.registerForm.resetValidation()
    },
    getlocation: function () {
      // creamos un Promise porque la funcion es asyncrona
      return new Promise((resolve, reject) => {
        // configuracion geolocator
        const geoOptions = {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumWait: 10000, // max wait time for desired accuracy
          maximumAge: 0, // disable cache
          desiredAccuracy: 30, // meters
          fallbackToIP: true, // fallback to IP if Geolocation fails or rejected
          addressLookup: false, // requires Google API key if true
          timezone: false // requires Google API key if true
        }
        // llamamos a la funcion geolocaltor por IP
        geolocator.locateByIP(geoOptions, function (err, geolocation) {
          if (err) reject(err)
          resolve(geolocation)
        })
      })
    },
    // Funcion de registro en la API
    registerApi: async function () {
      Loading.show()
      this.errors = {}
      const datauser = { email: this.email.toLowerCase(), password1: this.password1, password2: this.password2 }
      // Registramos el usuario con los datos del formulario
      const responseuser = await this.$apiHelper.postApi('register/', datauser)
      if (responseuser.statusText === 'Created') {
        // se ha creado el usuario, solicitamos el token jwt
        const datalogin = { email: this.email.toLowerCase(), password: this.password1 }
        const responselogin = await this.$apiHelper.postApi('login/', datalogin)
        // seteamos el token en el header
        this.$axios.defaults.headers.common['Authorization'] = 'JWT ' + responselogin.data.token
        // guardamos el token
        this.$q.localStorage.set('token', { key: responselogin.data.token, ttl: new Date().getTime() + 60 * 15 * 1000 })
        // timeout token
        await this.$store.dispatch('user/timeoutToken')
        // seteamo el state de vuex a authentificado
        this.$store.commit('user/authenticate')
        // seteamos el state de email
        this.$store.commit('user/setEmail', this.email)
        // seteamos el state id
        this.$store.commit('user/setId', responselogin.data.user.id)
        // creamos el objeto del perfil con los datos recojidos del Geolocator, los del formulario, la API y del navegador del cliente
        const dataprofile = {
          owner: responseuser.data.id,
          name: this.name,
          last_ip: this.location.ip,
          country: this.location.address.country,
          state: this.location.address.state,
          timezone: this.location.timezone.id,
          os: this.$q.platform.is.platform
        }
        // Peticion para crear el perfil
        const responseprofile = await this.$apiHelper.postApi('profile/', dataprofile)
        if (responseprofile.statusText === 'Created') {
          // Si el perfil se crear correctamente avanzamos al paso 2 del registro (datos de la empresa)
          this.$router.push('/register/company')
        } else {
          // Si hay errors con la creacion del perfil es por el nombre
          if (responseprofile.response.data.name) {
            this.$set(this.errors, 'name', responseprofile.response.data.name)
          }
        }
      } else {
        if (responseuser.response.status === 429) {
          // si esta spameando la api
          this.$set(this.errors, 'many', this.$t('login_form_throttle'))
        } else {
          // hay errores al crear el usuario
          for (const key in responseuser.response.data) {
            if (key === 'email') {
              // errores con email
              this.$set(this.errors, 'email', responseuser.response.data.email)
            }
            if (key === 'password1') {
              // errores con el password
              this.$set(this.errors, 'password', [])
              for (const okey in responseuser.response.data.password1) {
                this.errors.password.push(responseuser.response.data.password1[okey])
              }
            }
          }
        }
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

.errors-ul
  list-style-type: none
  margin: 0
  padding: 0

</style>
