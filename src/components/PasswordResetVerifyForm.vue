<template>
  <q-page>
    <q-form
    class="page-form q-gutter-xs q-gutter-y-lg q-pa-lg q-ma-lg bg-primary rounded-borders shadow-6"
    ref="passwordResetVerifyForm"
    @submit="onSubmit"
    @reset="onReset"
    v-if="tokenIsValid"
    ><strong>{{ $t('password_reset_form') }}</strong>
      <div>
        <p>{{ $t('password_reset_verify_info') }}</p>
      </div>
      <div class="errors-div">
        {{ errors.token }}
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
          color="dark"
          outlined
          :type="isPwd ? 'password' : 'text'"
          :label="$t('password')"
          :hint="$t('password')"
          :rules="[ val => val && val.length > 0 || $t('form_error_password')]"
        >
          <template v-slot:append>
            <q-icon
              :name="isPwd ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="isPwd = !isPwd"
            />
          </template>
          <template v-slot:prepend>
            <q-icon name="lock" />
          </template>
        </q-input>
      </div>
      <div class="form-label-group">
        <div class="errors-div">
          {{ errors.repassword }}
        </div>
        <q-input
          v-model="password2"
          color="dark"
          outlined
          :type="isPwd ? 'password' : 'text'"
          :label="$t('password')"
          :hint="$t('repassword')"
          :rules="[val => val && val.length > 0 || $t('form_error_password')]"
        >
          <template v-slot:append>
            <q-icon
              :name="isPwd ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="isPwd = !isPwd"
            />
          </template>
          <template v-slot:prepend>
            <q-icon name="lock" />
          </template>
        </q-input>
      </div>
      <q-page-container>
        <q-btn :label="$t('restore')" type="submit" color="accent"/>
        <q-btn :label="$t('reset')" type="reset" color="negative" flat class="q-ml-sm" />
      </q-page-container>
    </q-form>
    <p v-else class="text-center" style="margin: 3%">{{ $t('password_reset_verify_extra_info') }}<br /><a href="" @click.prevent="$router.push('/reset_password')">{{ $t('password_reset_verify_extra_info_link') }}</a></p>
    <q-dialog v-model="resetSuccess">
      <q-card>
        <q-card-section>
          <div class="text-h6" color="primary">{{ $t('response_password_established') }}</div>
        </q-card-section>
        <q-card-section>
          {{ $t('password_reset_verify_extra_info2') }}
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="OK" color="accent" v-close-popup @click="$router.push('/login')"/>
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
      errors: {},
      password1: null,
      password2: null,
      isPwd: true,
      resetSuccess: false,
      tokenIsValid: null
    }
  },
  mounted: async function () {
    const dataverify = { token: this.$route.params.token }
    // verificamos si el token es correcto
    const responseverify = await this.$apiHelper.postApi('reset_password/verify_token/', dataverify)
    if (responseverify.status === 200) {
      this.tokenIsValid = true
    }
  },
  methods: {
    onReset: function () {
      // to reset validations:
      this.password1 = null
      this.password2 = null
      this.errors = {}
      this.$refs.passwordResetVerifyForm.resetValidation()
    },
    onSubmit: function () {
      this.errors = {}
      this.$refs.passwordResetVerifyForm.validate().then(success => {
        if (success) {
          // yay, models are correct
          if (this.password1 !== this.password2) {
            this.$set(this.errors, 'repassword', this.$t('form_error_repassword'))
          } else {
            this.passwordResetVerify()
          }
        }
      })
    },
    // Funcion de reseteo de password
    passwordResetVerify: async function () {
      Loading.show()
      this.errors = {}
      const datapasswordreset = { token: this.$route.params.token, password: this.password1 }
      // Enviamos la solicitud de resetear password con el email introducido
      const responsereset = await this.$apiHelper.postApi('reset_password/confirm/', datapasswordreset)
      if (responsereset.status === 200) {
        // se ha processado la solicitud de reseteo
        this.resetSuccess = true
      } else {
        // hay errores la password
        this.$set(this.errors, 'password', [])
        for (const okey in responsereset.response.data.password) {
          this.errors.password.push(responsereset.response.data.password[okey])
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
