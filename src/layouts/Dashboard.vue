<template>
  <!-- <q-layout view="lHh lpR fFf"> -->
  <q-layout view="hHh lpR fFf">
    <Menus />
    <q-page-container class="bg-secondary">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  components: {
    Menus: () => import('layouts/Menus.vue')
  },
  data () {
    return {
    }
  }
}
</script>

<style scope>
.nav-button {
  margin: 5%;
}
</style>
