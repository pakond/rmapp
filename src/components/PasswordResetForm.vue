<template>
  <q-page>
    <q-form
    class="page-form q-gutter-xs q-gutter-y-lg q-pa-lg q-ma-lg bg-primary rounded-borders shadow-6"
    ref="passwordResetForm"
    @submit="onSubmit"
    @reset="onReset"
    ><strong>{{ $t('password_reset_form') }}</strong>
      <div class="password-reset-info">
        <p>{{ $t('password_reset_info') }}</p>
      </div>
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
      <q-page-container>
        <q-btn :label="$t('send')" type="submit" color="accent"/>
        <q-btn :label="$t('reset')" type="reset" color="negative" flat class="q-ml-sm" />
      </q-page-container>
      <p v-if="resetSuccess">{{ $t('password_reset_extra_info', { msg: email }) }}</p>
      <i18n path="password_reset_extra_info2" for="terms" tag="p" v-else>
        <a href="" @click.prevent="$router.push('/login')">{{ $t('identify') }}</a>
      </i18n>
    </q-form>
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
      resetSuccess: null
    }
  },
  methods: {
    onReset: function () {
      // to reset validations:
      this.email = null
      this.error = null
      this.$refs.passwordResetForm.resetValidation()
    },
    onSubmit: function () {
      this.error = null
      this.$refs.passwordResetForm.validate().then(success => {
        if (success) {
          // yay, models are correct
          this.passwordReset()
        }
      })
    },
    // Funcion de reseteo de password
    passwordReset: async function () {
      Loading.show()
      this.errors = {}
      const datapasswordreset = { email: this.email.toLowerCase() }
      // Enviamos la solicitud de resetear password con el email introducido
      const responsereset = await this.$apiHelper.postApi('reset_password/', datapasswordreset)
      if (responsereset.status === 200) {
        // se ha processado la solicitud de reseteo
        this.resetSuccess = true
      } else {
        // hay errores al con el email
        if (responsereset.response.status === 429) {
          // si esta spameando la api
          this.error = this.$t('password_reset_throttle')
        } else {
          if (responsereset.response.data.email[0].includes('There is no active user')) {
            // el email introducido no es valido
            this.error = this.$t('form_error_no_email')
          } else {
            this.error = responsereset.response.data.email[0]
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

</style>
