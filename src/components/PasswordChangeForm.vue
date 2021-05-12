<template>
  <q-page>
    <q-form
    class="page-form q-gutter-xs q-gutter-y-lg q-pa-md q-ma-md bg-primary rounded-borders shadow-6"
    ref="passwordChangeForm"
    @submit="onSubmit"
    @reset="onReset"
    > <strong>{{ $t('password_change_form') }}</strong>
      <div class="form-label-group">
        <div class="errors-div">
          {{ errors.oldpassword }}
        </div>
        <q-input
          v-model="oldpassword"
          outlined
          color="dark"
          :type="isPwd ? 'password' : 'text'"
          :label="$t('old_password')"
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
          :label="$t('new_password')"
          :hint="$t('password')"
          :rules="[ val => val && val.length > 0 || 'Porfavor escribe una contraseña']"
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
          outlined
          color="dark"
          :type="isPwd ? 'password' : 'text'"
          :label="$t('new_password')"
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
        <q-btn :label="$t('change')" type="submit" color="accent"/>
        <q-btn :label="$t('reset')" type="reset" color="negative" flat class="q-ml-sm" />
      </q-page-container>
    </q-form>
    <q-dialog v-model="changeSuccess">
      <q-card>
        <q-card-section>
          <div class="text-h6" color="accent">{{ $t('password_change_info') }}</div>
        </q-card-section>
        <q-card-section>
          {{ $t('password_change_extra_info') }}
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="OK" color="accent" v-close-popup @click="$router.push('/').catch(() => {})"/>
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
      oldpassword: null,
      password1: null,
      password2: null,
      isPwd: true,
      changeSuccess: false
    }
  },
  methods: {
    onReset: function () {
      // to reset validations:
      this.oldpassword = null
      this.password1 = null
      this.password2 = null
      this.errors = {}
      this.$refs.passwordChangeForm.resetValidation()
    },
    onSubmit: function () {
      this.errors = {}
      this.$refs.passwordChangeForm.validate().then(success => {
        if (success) {
          // yay, models are correct
          if (this.oldpassword === this.password1) {
            this.$set(this.errors, 'password', [])
            this.errors.password.push(this.$t('form_error_samepassword'))
          } else if (this.oldpassword === this.password2) {
            this.$set(this.errors, 'repassword', this.$t('form_error_samepassword'))
          } else if (this.password1 !== this.password2) {
            this.$set(this.errors, 'repassword', this.$t('form_error_repassword'))
          } else {
            this.passwordChange()
          }
        }
      })
    },
    // Funcion de reseteo de password
    passwordChange: async function () {
      Loading.show()
      this.errors = {}
      const datapass = { old_password: this.oldpassword, new_password1: this.password1, new_password2: this.password2 }
      // Enviamos la solicitud de cambiar password
      const responsepass = await this.$apiHelper.postApi('password/change/', datapass)
      if (responsepass.status === 200) {
        // se ha processado la solicitud de cambio
        this.changeSuccess = true
      } else {
        // hay errores la password
        if (responsepass.response.data.new_password2) {
          this.$set(this.errors, 'password', [])
          for (const okey in responsepass.response.data.new_password2) {
            this.errors.password.push(responsepass.response.data.new_password2[okey])
          }
        } else if (responsepass.response.data.old_password) {
          this.$set(this.errors, 'oldpassword', this.$t('form_error_badpassword'))
        }
      }
      Loading.hide()
    }
  }
}
</script>

<style lang="sass" scoped>
.page-form
  width: 92%
  margin-left: auto
  margin-right: auto

@media only screen and (min-width: 768px)
  .page-form
    width: 47%

.errors-div
  color: $negative
  font-size: 85%
  text-align: left

.errors-ul
  list-style-type: none
  margin: 0
  padding: 0

</style>
