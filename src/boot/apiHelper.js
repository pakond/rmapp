import axios from 'axios'
const baseURL = 'http://localhost:8000/api/'
const apiKEY = 'i5mC5iSu.YuXvspz4WcWWSTWzOPlGy9eAlbZv4SbG'
let querystringAxios = require('querystring')

export default ({ router, store, Vue }) => {
  const apiHelper = {
    // request con POST..
    postApi: async function (category, data) {
      return new Promise((resolve) => {
        axios({
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
              router.push('/login')
            }
            resolve(errors)
          })
      })
    },
    getApi: async function (category) {
      return new Promise((resolve) => {
        axios({
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
              router.push('/login')
            }
            resolve(errors)
          })
      })
    },
    deleteApi: async function (category) {
      return new Promise((resolve) => {
        axios({
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
              router.push('/login')
            }
            resolve(errors)
          })
      })
    },
    patchApi: async function (category, data) {
      return new Promise((resolve) => {
        axios({
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
              router.push('/login')
            }
            resolve(errors)
          })
      })
    }
  }
  Vue.prototype.$apiHelper = apiHelper
}
