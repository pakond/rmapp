export function authenticate (state) {
  state.authenticated = true
}
export function deauthenticate (state) {
  state.authenticated = false
}
export function setEmail (state, payload) {
  state.email = payload
}
export function setId (state, payload) {
  state.id = payload
}
export function setTimeout (state, payload) {
  state.timeout = payload
}
