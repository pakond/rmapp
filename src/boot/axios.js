import Vue from 'vue'
import axios from 'axios'

const axiosInstance = axios.create()

Vue.prototype.$axios = axios

export { axiosInstance }
