import { LocalStorage } from 'quasar'
import { axiosInstance } from 'boot/axios'
import jwtDecode from 'jwt-decode'

// deslogea al usuario
export function logout ({ commit, getters }) {
  // borramos el token del localstorage
  LocalStorage.remove('token')
  // borramos el token del header
  axiosInstance.defaults.headers.common['Authorization'] = ''
  // mutamos el state de authenticate
  commit('deauthenticate')
  // mutamos el state del email
  commit('setEmail', null)
  // mutamos el state del id
  commit('setId', null)
  // mutamos el state de la compañia
  commit('company/name', null, { root: true })
  commit('company/type', null, { root: true })
  // set logout storage (extra tabs)
  LocalStorage.set('logout', Date.now())
  // borra el timeout
  clearTimeout(getters['getTimeout'])
}

// recoge el email del usuario y lo muta si esta loged
export async function email ({ commit, getters }) {
  // comprueba si esta loged
  if (getters['isAuthenticated'] === true) {
    // esta loged llamamos a la api
    const responsemail = await this._vm.$apiHelper.getApi('user/')
    // mutamos email
    commit('setEmail', responsemail.data.email)
    // mutamos id
    commit('setId', responsemail.data.id)
  }
}

// comprueba un token
export async function checkToken ({ commit, dispatch }) {
  // comprobamos el token del storage
  let token = await dispatch('checkTimeToken')
  if (token !== false) {
    // el token es correcto
    // verificamos que el token sea real
    const responseverify = await this._vm.$apiHelper.postApi('token_verify/', { token: token.key })
    if (responseverify.status === 200) {
      // si la API no devuelve error es real
      // setamos el header con token
      axiosInstance.defaults.headers.common['Authorization'] = 'JWT ' + token.key
      // seteamos state a logeado
      commit('authenticate')
    } else {
      // token malo (hacker a la vista)
      // cambiamos state a deslogeado
      await dispatch('logout')
    }
  } else {
    // token incorrecto
    // cambiamos state a deslogeado
    await dispatch('logout')
  }
}

// comprueba tiempo del token
export function checkTimeToken () {
  // cojemos el token del storage
  const token = LocalStorage.getItem('token')
  if (token) {
    const time = new Date().getTime()
    if (time > token.ttl) {
      // el tiempo actual a sobrepasado la duracion del token
      return false
    } else {
      // token valido
      return token
    }
  } else {
    return false
  }
}

// renueva un token
export async function refreshToken ({ dispatch }) {
  // cojemos el token del storage
  const token = LocalStorage.getItem('token')
  const decoded = jwtDecode(token.key)
  const origIat = decoded.orig_iat
  // renueva el token
  const responserefresh = await this._vm.postApi('token_refresh/', { token: token.key, orig_iat: origIat })
  if (responserefresh.status === 200) {
    // actualizamos el token en localstorage
    LocalStorage.set('token', { key: responserefresh.data.token, ttl: new Date().getTime() + 60 * 15 * 1000 })
    // actualizamos el header con el nuevo token
    axiosInstance.defaults.headers.common['Authorization'] = 'JWT ' + responserefresh.data.token
    // creamo nuevo timeout token
    await dispatch('timeoutToken')
  }
}

// cuenta atras de expiracion de token
export function timeoutToken ({ commit, dispatch }) {
  // coje el token del local
  const token = LocalStorage.getItem('token')
  if (token) {
    // si hay token genera time de ahora
    const time = new Date().getTime()
    // restamos el tiempo actual al tiempo del token
    let tokenExpire = token.ttl - time
    // restamos 30segundos
    tokenExpire = tokenExpire - 30 * 1000
    // setea el timeout del token
    const timeout = setTimeout(function () {
      dispatch('refreshToken')
    }, tokenExpire)
    // setea el state del timeout por si hay que borrar el timeout al deslogear
    commit('setTimeout', timeout)
  }
}
