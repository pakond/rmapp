<template>
  <div>
    <q-header elevated class="bg-secondary text-accent">
      <!-- search box -->
      <q-toolbar>
        <q-input
          v-model="product"
          list="products"
          dense
          type="text"
          input-class="text-right"
          class="q-mr-xs"
          style="min-width: 8em;"
          :label="$t('search_products')"
          bg-color="primary"
          color="accent"
          outlined
        >
          <template v-slot:append>
            <q-icon v-if="product === ''" name="search" />
            <q-icon v-else name="clear" class="cursor-pointer" @click="product = ''" />
          </template>
          <datalist id="products" :onchange="selectProduct()">
            <option v-for="(item, index) in products" :key="index" :value="item.name" />
          </datalist>
        </q-input>
        <q-btn dense flat round icon="menu" @click="left = !left" />
        <!-- gt.md pantalla mas grande de 1024, para menor que usar lt -->
        <q-toolbar-title v-if="$q.screen.gt.md">
            RAPID MOBILE
        </q-toolbar-title>
        <!-- Language menu -->
        <q-avatar color="primary" class="q-pr-xl q-pl-xs" size="lg" style="margin-left: auto;">
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
        <!-- Notifications menu -->
        <q-avatar color="primary" class="q-pr-xl" size="lg">
          <q-icon name="notifications_none" size="md" color="negative" v-if="notifications" />
          <q-icon name="notifications_none" size="md" v-else />
          <q-menu>
            <q-list dense>
              <q-item class="bg-accent text-primary text-center">
                <q-item-section>{{ $t('notifications') }}</q-item-section>
              </q-item>
              <!-- logica notificaciones -->
            </q-list>
          </q-menu>
        </q-avatar>
        <!-- Account menu -->
        <q-btn
          dense
          text-color="primary"
          color="accent"
          :label="$store.getters['user/getEmail'].split('@')[0]"
          v-if="$store.getters['user/getEmail']"
        >
          <q-menu>
            <q-list dense>
              <q-item class="bg-accent text-primary text-center">
                <q-item-section>{{ $t('account_settings') }}</q-item-section>
              </q-item>
              <q-item
              clickable
              v-close-popup
              class="q-pr-lg bg-primary text-accent"
              @click="$router.push('/profile')"
              >
                <q-item-section avatar>
                  <q-icon name="account_circle" color="accent" />
                </q-item-section>
                <q-item-section>{{ $t('profile') }}</q-item-section>
              </q-item>
              <q-item
              clickable
              v-close-popup
              class="q-pr-lg bg-primary text-accent"
              @click="$router.push('/storehouses')"
              v-if="$store.getters['company/type'] === 'Provider'"
              >
                <q-item-section avatar>
                  <q-icon name="all_inbox" color="accent" />
                </q-item-section>
                <q-item-section>{{ $t('storehouses') }}</q-item-section>
              </q-item>
              <q-item
              clickable
              v-close-popup
              class="q-pr-lg bg-primary text-accent"
              @click="$router.push('/change_password')"
              >
                <q-item-section avatar>
                  <q-icon name="lock" color="accent" />
                </q-item-section>
                <q-item-section>{{ $t('change_password') }}</q-item-section>
              </q-item>
              <q-item
              clickable
              v-close-popup
              class="q-pr-lg bg-primary text-accent"
              @click="logout()"
              >
                <q-item-section avatar>
                  <q-icon name="power_settings_new" color="accent" />
                </q-item-section>
                <q-item-section v-if="$q.platform.is.cordova">{{ $t('exit') }}</q-item-section>
                <q-item-section v-else>{{ $t('logout') }}</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </q-toolbar>
    </q-header>
    <q-drawer content-class="panel-menu" show-if-above v-model="left" side="left">
      <!-- Nav Menu -->
      <p class="shadow-24 text-center">{{ $t('dashboard') }}</p>
      <q-list padding dense class="q-gutter-y-xs q-ml-md q-mr-md q-px-md bg-secondary text-accent rounded-borders">
        <q-item
          clickable
          v-ripple
          :active="link === 'home'"
          active-class="my-menu-link shadow-5"
          :to="{ path: '/' + $store.getters['company/type'] }"
        >
          <q-item-section avatar>
            <q-icon name="dashboard" />
          </q-item-section>
          <q-item-section>{{ $t('home') }}</q-item-section>
        </q-item>
      </q-list>
      <p class="q-mt-md text-center shadow-24">{{ $t('products') }}</p>
      <q-list padding dense class="q-gutter-y-xs q-ml-md q-mr-md q-px-md bg-secondary text-accent rounded-borders">
        <q-item
          clickable
          v-ripple
          :active="link === 'mobile'"
          active-class="my-menu-link shadow-5"
          :to="{ path: '/smartphones' }"
        >
          <q-item-section avatar>
            <q-icon name="smartphones" />
          </q-item-section>
          <q-item-section>{{ $t('smartphones') }}</q-item-section>
        </q-item>
      </q-list>
      <!-- Support menu -->
      <p class="q-mt-md text-center shadow-24">{{ $t('support') }}</p>
      <q-list padding dense class="q-gutter-y-xs q-ml-md q-mr-md q-px-md bg-secondary text-accent rounded-borders">
        <q-item
          clickable
          v-ripple
          @click="terms = true"
        >
          <q-item-section avatar>
            <q-icon name="event_note" />
          </q-item-section>
          <q-item-section>{{ $t('terms') }}</q-item-section>
        </q-item>
        <q-item
          clickable
          v-ripple
          @click="privacy = true"
        >
          <q-item-section avatar>
            <q-icon name="policy" />
          </q-item-section>
          <q-item-section>{{ $t('privacity') }}</q-item-section>
        </q-item>
      </q-list>
      <!-- Terms and privacy alert -->
      <q-dialog v-model="terms">
        <q-card>
          <q-card-section>
            <div class="text-h6" color="accent">{{ $t('terms') }}</div>
          </q-card-section>
          <q-card-section>
            <p>{{ $t('terms') }}</p>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn flat label="OK" color="accent" v-close-popup />
          </q-card-actions>
        </q-card>
        </q-dialog>
        <q-dialog v-model="privacy">
        <q-card>
          <q-card-section>
            <div class="text-h6" color="accent">{{ $t('privacity') }}</div>
          </q-card-section>
          <q-card-section>
            <p>{{ $t('privacity') }}</p>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn flat label="OK" color="accent" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </q-drawer>
  </div>
</template>

<script>
export default {
  data () {
    return {
      left: false,
      link: '',
      text: '',
      products: null,
      product: '',
      notifications: null,
      privacy: false,
      terms: false
    }
  },
  created () {
    this.getData()
  },
  watch: {
    // call again the method if the route changes
    '$route': 'getData'
  },
  methods: {
    selectProduct: function () {
      if (this.product.length >= 3) {
        for (const value of this.products) {
          if (this.product === value.name) {
            this.$router.push({ path: '/smartphones/' + value.id })
            this.product = ''
            break
          }
        }
      }
    },
    getData: async function () {
      // coje el nombre de todos los productos
      const responsedata = await this.$apiHelper.getApi('products/')
      this.products = responsedata.data
    },
    logout: function () {
      if (this.$q.platform.is.cordova) {
        this.$store.dispatch('user/logout')
        this.$q.cordova.plugins.exit()
      } else {
        this.$store.dispatch('user/logout')
        this.$router.push('/login')
      }
    },
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
      this.$router.push('/').catch(() => {})
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
      this.$q.localStorage.set('language', 'es')
      this.$router.push('/').catch(() => {})
    }
  }
}
</script>

<style lang="sass" scope>
.menus-search
  padding-top: 0.36em
  padding-bottom: 0.36em

.panel-menu
  background: $accent
  color: $primary
  padding: 6%

.my-menu-link
  border-radius: 0.3em
  color: $accent
  background: $primary

.nav-button
  margin: 6%

</style>
