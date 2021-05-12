import Vue from 'vue'
import { store } from 'src/store'
const baseURL = 'http://localhost:8000/api/'
const apiKEY = 'i5mC5iSu.YuXvspz4WcWWSTWzOPlGy9eAlbZv4SbG'
let querystringAxios = require('querystring')

const apiHelper = Vue.mixin({
  name: 'apiHelper',
  methods: {
    // request con POST..
    postApi: async function (category, data) {
      return new Promise((resolve) => {
        this.$axios({
          method: 'POST',
          url: baseURL + category,
          headers: {
            'x-api-key': apiKEY
          },
          data: querystringAxios.stringify(data)
        })
          .then(response => {
            // la respuesta es correcta
            resolve(response)
          })
          .catch(async errors => {
            // la respuesta es erronea..
            if (errors.response.status === 401) {
              await this.$store.dispatch('user/logout')
              this.$router.push('/login')
            }
            resolve(errors)
          })
      })
    },
    getApi: async function (category) {
      return new Promise((resolve) => {
        this.$axios({
          method: 'GET',
          url: baseURL + category,
          headers: {
            'x-api-key': apiKEY
          }
        })
          .then(response => {
            // la respuesta es correcta
            resolve(response)
          })
          .catch(async errors => {
            // la respuesta es erronea..
            if (errors.response.status === 401) {
              await store.dispatch('user/logout')
              this.$router.push('/login')
            }
            resolve(errors)
          })
      })
    },
    deleteApi: async function (category) {
      return new Promise((resolve) => {
        this.$axios({
          method: 'DELETE',
          url: baseURL + category,
          headers: {
            'x-api-key': apiKEY
          }
        })
          .then(response => {
            // la respuesta es correcta
            resolve(response)
          })
          .catch(async errors => {
            // la respuesta es erronea..
            if (errors.response.status === 401) {
              await this.$store.dispatch('user/logout')
              this.$router.push('/login')
            }
            resolve(errors)
          })
      })
    },
    patchApi: async function (category, data) {
      return new Promise((resolve) => {
        this.$axios({
          method: 'PATCH',
          url: baseURL + category,
          headers: {
            'x-api-key': apiKEY
          },
          data: querystringAxios.stringify(data)
        })
          .then(response => {
            // la respuesta es correcta
            resolve(response)
          })
          .catch(async errors => {
            // la respuesta es erronea..
            if (errors.response.status === 401) {
              await this.$store.dispatch('user/logout')
              this.$router.push('/login')
            }
            resolve(errors)
          })
      })
    }
  }
})

Vue.prototype.$apihelper = apiHelper

export { apiHelper }
