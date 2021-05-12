export async function set ({ commit }) {
  // setea si tiene empresa
  const company = await this._vm.$apiHelper.getApi('company/')
  if (company.data[0]) {
    // si hay company mutamos has_one
    commit('name', company.data[0].name)
    // mutamos el tipo
    commit('type', company.data[0].type)
    // mutamos si esta activa
    commit('active', company.data[0].is_active)
  }
}
