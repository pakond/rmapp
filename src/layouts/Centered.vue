<template>
  <q-layout view="lHh lpR fFf">
    <q-header elevated class="bg-secondary text-accent">
      <q-toolbar>
        <q-toolbar-title>
          RAPID MOBILE
        </q-toolbar-title>
        <q-avatar color="primary" size="lg">
          <img src="../statics/img/es.svg" style="width: 80%; height: 80%;" v-if="$q.lang.isoName === 'es'" />
          <img src="../statics/img/us.svg" style="width: 80%; height: 80%;" v-else />
          <q-menu>
            <q-list dense class="text-center">
              <q-item class="bg-accent text-primary">
                <q-item-section>{{ $t('language') }}</q-item-section>
              </q-item>
              <q-item
              clickable
              v-close-popup
              class="q-pr-lg bg-primary text-accent"
              @click="setLangEn()"
              >
                <q-avatar>
                  <img src="../statics/img/us.svg" style="width: 60%; height: 60%;" />
                </q-avatar>
                <q-item-section>{{ $t('english') }}</q-item-section>
              </q-item>
              <q-item
              clickable
              v-close-popup
              class="q-pr-lg bg-primary text-accent"
              @click="setLangEs()"
              >
                <q-avatar>
                  <img src="../statics/img/es.svg" style="width: 60%; height: 60%;" />
                </q-avatar>
                <q-item-section>{{ $t('spanish') }}</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-avatar>
      </q-toolbar>
    </q-header>
    <q-page-container class="bg-secondary">
      <router-view />
    </q-page-container>
  </q-layout>
</template>
<script>
export default {
  data () {
    return {
    }
  },
  methods: {
    setLangEn: function () {
      this.$i18n.locale = 'en-us'
      // set quasar's language too!!
      import('quasar/lang/en-us')
        .then(lang => {
          this.$q.lang.set(lang.default)
        })
      // set language header
      this.$axios.defaults.headers.common['Accept-Language'] = 'en-us'
      // guarda lengua en localstorage
      this.$q.localStorage.set('language', 'en-us')
    },
    setLangEs: function () {
      this.$i18n.locale = 'es'
      // set quasar's language too!!
      import('quasar/lang/es')
        .then(lang => {
          this.$q.lang.set(lang.default)
        })
      // set language header
      this.$axios.defaults.headers.common['Accept-Language'] = 'es-es'
      // guarda lengua en localstorage
      this.$q.localStorage.set('language', 'es')
    }
  }
}
</script>

<style scope>
.qpage-container {
  padding: 6%;
}
@media only screen and (min-width: 768px) {
  .qpage-container {
    padding: 0%;
  }
}
</style>
