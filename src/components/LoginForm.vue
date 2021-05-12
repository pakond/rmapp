<template>
  <q-page>
    <q-form
    class="page-form q-gutter-xs q-gutter-y-lg q-pa-lg q-ma-lg rounded-borders shadow-6"
    ref="loginForm"
    @submit="onSubmit"
    @reset="onReset"
    ><strong>{{ $t('login_form') }}</strong>
      <div class="errors-div">
        {{ error }}
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
      <q-input
        v-model="password"
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
      <q-page-container>
        <q-btn :label="$t('login_form_button')" type="submit" color="accent"/>
        <q-btn :label="$t('reset')" type="reset" color="negative" flat class="q-ml-sm" />
      </q-page-container>
      <p>{{ $t('login_form_info') }} <a href="" @click.prevent="$router.push('/register')">{{ $t('register') }}</a></p>
      <p>{{ $t('login_form_extra_info') }} <a href="" @click.prevent="$router.push('/reset_password')">{{ $t('recover') }}</a></p>
    </q-form>
    <q-dialog v-model="alert">
      <q-card>
        <q-card-section>
          <div class="text-h6" color="accent">{{ $t('login_form_company_inactive') }}</div>
        </q-card-section>
        <q-card-section>
          {{ $t('company_register_extra_info2') }}
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
  name: 'Login',
  data () {
    return {
      error: null,
      email: null,
      password: null,
      isPwd: true,
      alert: false
    }
  },
  methods: {
    onReset: function () {
      // to reset validations:
      this.email = null
      this.password = null
      this.error = null
      this.$refs.loginForm.resetValidation()
    },
    onSubmit: function () {
      this.error = null
      this.$refs.loginForm.validate().then(success => {
        if (success) {
          // yay, models are correct
          this.loginApi()
        }
      })
    },
    // Funcion de logeo en la API
    loginApi: async function () {
      Loading.show()
      this.errors = {}
      const datalogin = { email: this.email.toLowerCase(), password: this.password }
      // Logeamos al usuario con los datos del formulario
      const responselogin = await this.$apiHelper.postApi('login/', datalogin)
      if (responselogin.status === 200) {
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
        // seteamos la company
        await this.$store.dispatch('company/set')
        if (this.$store.getters['company/isActive'] !== true) {
          // si la compañia no esta activa
          await this.$store.dispatch('user/logout')
          this.alert = true
        } else {
          // redirigimos al dashboard
          this.$router.push('/').catch(() => {})
        }
      } else {
        // hay errores al logear el usuario
        if (responselogin.response.status === 429) {
          // si esta spameando la api
          this.error = this.$t('login_form_throttle')
        } else {
          // si hay errores de email o password
          this.error = responselogin.response.data.non_field_errors[0]
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

</style>
