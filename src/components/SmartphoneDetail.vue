<template>
  <q-page>
    <div class="row q-pa-lg q-ma-lg bg-primary justify-center shadow-6" v-if="$q.screen.gt.md">
      <div class="col-4 q-mt-xl">
        <q-img :src="smartphone.image" class="detail-image" />
      </div>
      <div class="col-8 text-left">
        <h5>{{ smartphone.name }}</h5>
        <div class="row">
          <div class="col-4">
            <p>
              <q-select outlined
                v-model="memory"
                :options="smartphone.memory"
                :label="$t('memory')"
                color="dark"
                options-selected-class="text-dark"
                style="width: 80%;"
                dense
                @input="checkStocks()"
              >
                <template v-slot:prepend>
                  <q-icon name="memory" />
                </template>
              </q-select>
            </p>
            <p>
              <q-select outlined
                v-model="color"
                :options="smartphone.color"
                label="Color"
                color="dark"
                options-selected-class="text-dark"
                style="width: 80%;"
                @input="value => { color = $t(value), hex_color = value, checkStocks() }"
                dense
              >
                <template v-slot:option="scope">
                  <q-item
                    v-bind="scope.itemProps"
                    v-on="scope.itemEvents"
                  >
                    <q-item-section avatar>
                      <div class="tabla-cuadrado" :style="{ 'background-color': scope.opt }" />
                    </q-item-section>
                    <q-item-section class="text-left">
                      <q-item-label>{{ $t(scope.opt) }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </template>
                <template v-slot:prepend>
                  <q-icon name="color_lens" />
                </template>
              </q-select>
            </p>
          </div>
          <div class="col-8 text-left">
            <p>{{ $t('brand') }}: <strong>{{ smartphone.brand }}</strong></p>
            <p>{{ $t('date_added') }}: <strong>{{ smartphone.date_added }}</strong></p>
            <p>{{ $t('link') }}: <span style="font-size: 0.8em"><strong>{{ smartphone.link }}</strong></span></p>
          </div>
        </div>
        <div class="row text-left q-mt-xl" v-if="$q.screen.gt.md">
          <div class="col">
            <q-icon name="fullscreen" size="xl" /><br />
            <strong>{{ $t('screen') }}</strong><br />
            {{ smartphone.screen }}
          </div>
          <div class="col">
            <q-icon name="camera_alt" size="xl" /><br />
            <strong>{{ $t('camera') }}</strong><br />
            {{ parseFloat(smartphone.camera) }} Mpx
          </div>
          <div class="col">
            <q-icon name="battery_charging_full" size="xl" /><br />
            <strong>{{ $t('battery') }}</strong><br />
            {{ smartphone.battery }} mAh
          </div>
        </div>
        <q-list class="q-mt-xl text-center" v-else>
          <q-item>
            <q-item-section>
              <q-icon name="fullscreen" size="md" style="margin-left: auto; margin-right: auto;" />
              <strong>{{ $t('screen') }}</strong>
              {{ smartphone.screen }}
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-icon name="camera_alt" size="md" style="margin-left: auto; margin-right: auto;" />
              <strong>{{ $t('camera') }}</strong>
              {{ smartphone.camera }}
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-icon name="battery_charging_full" size="md" style="margin-left: auto; margin-right: auto;" />
              <strong>{{ $t('battery') }}</strong>
              {{ smartphone.battery }}
            </q-item-section>
          </q-item>
        </q-list>
      </div>
      <!-- Provider Stock form -->
      <div class="row full-width q-mt-xl">
        <div class="col-4">
          <!-- Formulario añadir stock -->
          <q-form
            class="q-gutter-xs q-gutter-y-lg q-mt-lg q-pa-md q-ma-md bg-primary rounded-borders shadow-14"
            ref="stockForm"
            v-if="$store.getters['company/type'] === 'Provider' && !stock.id"
            @submit="onSubmitStock"
          >
            <i18n path="smartphones_stock_add" tag="p">
              <strong place="add">{{ $t('add') }}</strong>
              <strong place="smartphone">{{ smartphone.name }}</strong>
              <strong place="memory">{{ memory }}</strong>
              <strong place="color">{{ color }}</strong>
              <strong place="storehouse">{{ store.location }}</strong>
            </i18n>
            <div class="row">
              <div class="col-10">
                <q-select
                  dense
                  outlined
                  color="dark"
                  options-selected-class="text-dark"
                  option-value="id"
                  option-label="location"
                  v-model="store"
                  :options="storehouses"
                  :label="$t('storehouse')"
                  :hint="$t('storehouse')"
                  lazy-rules
                  :rules="[ val => val.id || $t('form_error_storehouse')]"
                  @input="checkStocks()"
                >
                  <template v-slot:prepend>
                    <q-icon name="all_inbox" />
                  </template>
                </q-select>
              </div>
              <div class="col-2">
                <q-btn class="q-mt-sm q-ml-sm" :label="$t('add')" size="sm" color="accent" @click="alertStore = true"/>
              </div>
            </div>
            <q-input
              dense
              outlined
              v-model="stock.price"
              color="dark"
              type="number"
              :label="$t('price')"
              :hint="$t('price')"
              lazy-rules
              :rules="[ val => val && String(val).length > 0 || $t('form_error_price')]"
            >
              <template v-slot:prepend>
                <q-icon name="euro" />
              </template>
            </q-input>
            <q-input
              dense
              outlined
              v-model="stock.quantity"
              color="dark"
              type="number"
              :label="$t('quantity')"
              :hint="$t('quantity')"
              lazy-rules
              :rules="[ val => val && String(val).length > 0 || $t('form_error_quantity')]"
            >
              <template v-slot:prepend>
                <q-icon name="add" />
              </template>
            </q-input>
            <q-btn :label="$t('add')" type="submit" color="accent" />
            <q-btn :label="$t('reset')" type="reset" color="negative" flat class="q-ml-sm" />
          </q-form>
          <!-- Formulario modificar stock -->
          <q-form
            class="q-gutter-xs q-gutter-y-lg q-mt-lg q-pa-md q-ma-md bg-primary rounded-borders shadow-14"
            ref="stockUpdateForm"
            v-if="$store.getters['company/type'] === 'Provider' && stock.id"
            @submit="onSubmitUpdateStock"
          >
            <i18n path="smartphones_stock_modify" tag="p">
              <strong place="modify">{{ $t('modify') }}</strong>
              <strong place="smartphone">{{ smartphone.name }}</strong>
              <strong place="memory">{{ memory }}</strong>
              <strong place="color">{{ color }}</strong>
              <strong place="storehouse">{{ store.location }}</strong>
            </i18n>
            <div class="row">
              <div class="col-10">
                <q-select
                  dense
                  outlined
                  color="dark"
                  options-selected-class="text-dark"
                  option-value="id"
                  option-label="location"
                  v-model="store"
                  :options="storehouses"
                  :label="$t('storehouse')"
                  :hint="$t('storehouse')"
                  :rules="[ val => val.id || $t('form_error_storehouse')]"
                  @input="checkStocks()"
                >
                  <template v-slot:prepend>
                    <q-icon name="all_inbox" />
                  </template>
                </q-select>
              </div>
              <div class="col-2">
                <q-btn class="q-mt-sm q-ml-sm" :label="$t('add')" size="sm" color="accent" @click="alertStore = true"/>
              </div>
            </div>
            <q-input
              dense
              outlined
              v-model="stock.price"
              color="dark"
              type="number"
              :label="$t('price')"
              :hint="$t('price')"
              lazy-rules
              :rules="[ val => val && String(val).length > 0 || $t('form_error_price')]"
            >
              <template v-slot:prepend>
                <q-icon name="euro" />
              </template>
            </q-input>
            <q-input
              dense
              outlined
              v-model="stock.quantity"
              color="dark"
              type="number"
              :label="$t('quantity')"
              :hint="$t('quantity')"
              lazy-rules
              :rules="[ val => val && String(val).length > 0 || $t('form_error_quantity')]"
            >
              <template v-slot:prepend>
                <q-icon name="add" />
              </template>
            </q-input>
            <q-btn :label="$t('save')" type="submit" color="accent" />
            <q-btn :label="$t('delete')" color="negative" @click="alertStockDelete = true"/>
          </q-form>
        </div>
        <div class="col-8 text-center">
          <h6>Gráfica de precios del producto</h6>
        </div>
      </div>
    </div>
    <!-- small screen -->
    <div class="q-pa-md q-ma-md bg-primary justify-center rounded-borders shadow-6 text-center" v-else>
      <h6 class="text-bold">{{ smartphone.name }}</h6>
      <div class="row">
        <div class="col-4 q-pr-md">
          <q-img :src="smartphone.image" class="detail-image2" />
        </div>
        <div class="col-8 q-mt-md text-left">
          <q-select outlined
            v-model="memory"
            :options="smartphone.memory"
            :label="$t('memory')"
            color="dark"
            options-selected-class="text-dark"
            dense
          >
            <template v-slot:prepend>
              <q-icon name="memory" />
            </template>
          </q-select>
          <br />
          <q-select outlined
            v-model="color"
            :options="smartphone.color"
            label="Color"
            color="dark"
            options-selected-class="text-dark"
            @input="value => { color = $t(value), hex_color = value }"
            dense
          >
            <template v-slot:option="scope">
              <q-item
                v-bind="scope.itemProps"
                v-on="scope.itemEvents"
              >
                <q-item-section avatar>
                  <div class="tabla-cuadrado" :style="{ 'background-color': scope.opt }" />
                </q-item-section>
                <q-item-section class="text-left">
                  <q-item-label>{{ $t(scope.opt) }}</q-item-label>
                </q-item-section>
              </q-item>
            </template>
            <template v-slot:prepend>
              <q-icon name="color_lens" />
            </template>
          </q-select>
          <br />
        </div>
        <div class="row full-width justify-center q-mt-lg">
          <div class="col">
            <q-icon name="fullscreen" size="xl" /><br />
            <strong>{{ $t('screen') }}</strong><br />
            {{ smartphone.screen }}
          </div>
          <div class="col">
            <q-icon name="camera_alt" size="xl" /><br />
            <strong>{{ $t('camera') }}</strong><br />
            {{ parseFloat(smartphone.camera) }} Mpx
          </div>
          <div class="col">
            <q-icon name="battery_charging_full" size="xl" /><br />
            <strong>{{ $t('battery') }}</strong><br />
            {{ smartphone.battery }} mAh
          </div>
        </div>
      </div>
      <div class="full-width q-mt-xl">
        <h6>Gráfica de precios del producto</h6>
        <!-- Formulario añadir stock -->
        <q-form
          class="q-gutter-xs q-gutter-y-lg q-mt-lg q-pa-md bg-primary rounded-borders shadow-14"
          ref="stockForm"
          v-if="$store.getters['company/type'] === 'Provider' && !stock.id"
          @submit="onSubmitStock"
        >
          <i18n path="smartphones_stock_add" tag="p" class="text-left">
            <strong place="add">{{ $t('add') }}</strong>
            <strong place="smartphone">{{ smartphone.name }}</strong>
            <strong place="memory">{{ memory }}</strong>
            <strong place="color">{{ color }}</strong>
            <strong place="storehouse">{{ store.location }}</strong>
          </i18n>
          <div class="row">
            <div class="col-9">
              <q-select
                dense
                outlined
                color="dark"
                options-selected-class="text-dark"
                option-value="id"
                option-label="location"
                v-model="store"
                :options="storehouses"
                :label="$t('storehouse')"
                :hint="$t('storehouse')"
                lazy-rules
                :rules="[ val => val.id || $t('form_error_storehouse')]"
                @input="checkStocks()"
              >
                <template v-slot:prepend>
                  <q-icon name="all_inbox" />
                </template>
              </q-select>
            </div>
            <div class="col-3">
              <q-btn class="q-mt-sm q-ml-sm" :label="$t('add')" size="xs" color="accent" @click="alertStore = true"/>
            </div>
          </div>
          <q-input
            dense
            outlined
            v-model="stock.price"
            color="dark"
            type="number"
            :label="$t('price')"
            :hint="$t('price')"
            lazy-rules
            :rules="[ val => val && String(val).length > 0 || $t('form_error_price')]"
          >
            <template v-slot:prepend>
              <q-icon name="euro" />
            </template>
          </q-input>
          <q-input
            dense
            outlined
            v-model="stock.quantity"
            color="dark"
            type="number"
            :label="$t('quantity')"
            :hint="$t('quantity')"
            lazy-rules
            :rules="[ val => val && String(val).length > 0 || $t('form_error_quantity')]"
          >
            <template v-slot:prepend>
              <q-icon name="add" />
            </template>
          </q-input>
          <q-btn :label="$t('add')" type="submit" color="accent" />
          <q-btn :label="$t('reset')" type="reset" color="negative" flat class="q-ml-sm" />
        </q-form>
        <!-- Formulario modificar stock -->
        <q-form
          class="q-gutter-xs q-gutter-y-lg q-mt-lg q-pa-md bg-primary rounded-borders shadow-14"
          ref="stockUpdateForm"
          v-if="$store.getters['company/type'] === 'Provider' && stock.id"
          @submit="onSubmitUpdateStock"
        >
          <i18n path="smartphones_stock_modify" tag="p" class="text-left">
            <strong place="modify">{{ $t('modify') }}</strong>
            <strong place="smartphone">{{ smartphone.name }}</strong>
            <strong place="memory">{{ memory }}</strong>
            <strong place="color">{{ color }}</strong>
            <strong place="storehouse">{{ store.location }}</strong>
          </i18n>
          <div class="row">
            <div class="col-9">
              <q-select
                dense
                outlined
                color="dark"
                options-selected-class="text-dark"
                option-value="id"
                option-label="location"
                v-model="store"
                :options="storehouses"
                :label="$t('storehouse')"
                :hint="$t('storehouse')"
                :rules="[ val => val.id || $t('form_error_storehouse')]"
                @input="checkStocks()"
              >
                <template v-slot:prepend>
                  <q-icon name="all_inbox" />
                </template>
              </q-select>
            </div>
            <div class="col-2">
              <q-btn class="q-mt-sm q-ml-sm" :label="$t('add')" size="xs" color="accent" @click="alertStore = true"/>
            </div>
          </div>
          <q-input
            dense
            outlined
            v-model="stock.price"
            color="dark"
            type="number"
            :label="$t('price')"
            :hint="$t('price')"
            lazy-rules
            :rules="[ val => val && String(val).length > 0 || $t('form_error_price')]"
          >
            <template v-slot:prepend>
              <q-icon name="euro" />
            </template>
          </q-input>
          <q-input
            dense
            outlined
            v-model="stock.quantity"
            color="dark"
            type="number"
            :label="$t('quantity')"
            :hint="$t('quantity')"
            lazy-rules
            :rules="[ val => val && String(val).length > 0 || $t('form_error_quantity')]"
          >
            <template v-slot:prepend>
              <q-icon name="add" />
            </template>
          </q-input>
          <q-btn :label="$t('save')" type="submit" color="accent" />
          <q-btn :label="$t('delete')" color="negative" @click="alertStockDelete = true"/>
        </q-form>
      </div>
    </div>
    <!-- popup Añade almacen -->
    <q-dialog v-model="alertStore">
      <q-card>
        <q-card-section>
          <div class="text-h6" color="accent">{{ $t('storehouses_add') }}</div>
        </q-card-section>
        <q-card-section>
          <q-input
            dense
            outlined
            v-model="newStorehouse"
            color="dark"
            type="text"
            :label="$t('location')"
            :hint="$t('location')"
          >
            <template v-slot:prepend>
              <q-icon name="location_city" />
            </template>
          </q-input>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat :label="$t('add')" color="accent" v-close-popup @click="addStorehouse()" v-if="newStorehouse"/>
          <q-btn flat :label="$t('add')" color="accent" v-close-popup @click="addStorehouse()" disable v-else/>
          <q-btn flat :label="$t('cancel')" color="accent" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <!-- popup stock añadido -->
    <q-dialog v-model="alertStockAdded">
      <q-card>
        <q-card-section>
          <div class="text-h6" color="accent">{{ $t('stock_added') }}</div>
        </q-card-section>
        <q-card-section>
          {{ $t('smartphones_stock_added', {
            product: smartphone.name + ' ' + memory + ' ' + color,
            storehouse: store.location,
            price: stock.price,
            quantity: stock.quantity
          })}}
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="OK" color="accent" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <!-- popup stock modificado -->
    <q-dialog v-model="alertStockModified">
      <q-card>
        <q-card-section>
          <div class="text-h6" color="accent">{{ $t('stock_modified') }}</div>
        </q-card-section>
        <q-card-section>
          <span v-if="error">{{ error }}</span>
          <span v-else>
            {{ $t('smartphones_stock_modified', {
              product: smartphone.name + ' ' + memory + ' ' + color,
              storehouse: store.location,
              price: stock.price,
              quantity: stock.quantity
            })}}
          </span>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="OK" color="accent" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <!-- popup stock elminar -->
    <q-dialog v-model="alertStockDelete">
      <q-card>
        <q-card-section>
          <div class="text-h6" color="accent">{{ $t('stock_delete') }}</div>
        </q-card-section>
        <q-card-section>
          {{ $t('smartphones_stock_delete', {
            product: smartphone.name + ' ' + memory + ' ' + color,
            storehouse: store.location,
          })}}
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat :label="$t('delete')" color="accent" v-close-popup @click="deleteStock()" />
          <q-btn flat :label="$t('cancel')" color="negative" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { date, Loading } from 'quasar'

export default {
  name: 'SmartphoneDetail',
  data () {
    return {
      error: null,
      memory: null,
      color: null,
      hex_color: null,
      smartphone: {},
      stocks: [],
      stock: {},
      oldStock: null,
      storehouses: [],
      store: {},
      newStorehouse: null,
      alertStore: false,
      alertStockAdded: false,
      alertStockModified: false,
      alertStockDelete: false
    }
  },
  async created () {
    await this.getData()
    if (this.$store.getters['company/type'] === 'Provider') {
      // si es provider cojemos los stores y stocks
      await this.getStores()
      await this.getStocks()
      this.checkStocks()
    }
  },
  watch: {
    // call again the method if the route changes
    '$route': 'getData'
  },
  methods: {
    getData: async function () {
      // coje datos del la api
      Loading.show()
      this.smartphone = await this.$apiHelper.getApi('smartphones/' + this.$route.params.id + '/')
      this.smartphone = this.smartphone.data
      for (const [key, value] of Object.entries(this.smartphone)) {
        if (key === 'date_added') {
          this.$set(this.smartphone, key, date.formatDate(value, 'D/M/YYYY'))
        } else if (key === 'color') {
          let colors = value.split(',')
          this.$set(this.smartphone, key, [])
          for (const color in colors) {
            if (color === '0') {
              this.color = this.$t(colors[color].trim())
              this.hex_color = colors[color].trim()
            }
            this.smartphone[key].push(colors[color].trim())
          }
        } else if (key === 'memory') {
          this.memory = value[0]
        }
      }
      Loading.hide()
    },
    getStores: async function () {
      // coje datos de los stores
      Loading.show()
      this.storehouses = await this.$apiHelper.getApi('storehouses/')
      this.storehouses = this.storehouses.data
      this.store = this.storehouses[0]
      Loading.hide()
    },
    getStocks: async function () {
      // coje datos de los stocks de este producto
      Loading.show()
      this.stocks = await this.$apiHelper.getApi('stocks/?product=' + this.$route.params.id)
      this.stocks = this.stocks.data
      Loading.hide()
    },
    checkStocks: function () {
      this.stock = {}
      this.stocks.some(element => {
        if (this.store.id === element.store && this.memory + ',' + this.hex_color === element.product_features) {
          // existe el stock
          for (const index in this.storehouses) {
            if (this.storehouses[index].id === element.store) {
              this.store = JSON.parse(JSON.stringify(this.storehouses[index]))
              break
            }
          }
          this.stock = Object.assign({}, element)
          this.oldStock = Object.assign({}, this.stock)
          return true
        }
      })
    },
    onSubmitStock: function () {
      this.$refs.stockForm.validate().then(async success => {
        if (success) {
          // yay, models are correct
          await this.addStock()
        }
      })
    },
    onSubmitUpdateStock: function () {
      this.$refs.stockUpdateForm.validate().then(async success => {
        if (success) {
          // yay, models are correct
          if (this.comparaObjetos(this.oldStock, this.stock) === true) {
            this.error = this.$t('profile_extra_info')
            this.alertStockModified = true
          } else {
            await this.updateStock()
          }
        }
      })
    },
    addStorehouse: async function () {
      await this.$apiHelper.postApi('storehouses/', { location: this.newStorehouse })
      this.newStorehouse = null
      await this.getStores()
    },
    addStock: async function () {
      Loading.show()
      this.error = null
      const datastock = {
        price: this.stock.price,
        quantity: this.stock.quantity,
        store: this.store.id,
        product: this.smartphone.id,
        product_features: this.memory + ',' + this.hex_color
      }
      const responsestock = await this.$apiHelper.postApi('stocks/', datastock)
      if (responsestock.status === 201) {
        this.alertStockAdded = true
      }
      Loading.hide()
    },
    updateStock: async function () {
      Loading.show()
      this.error = null
      const datastock = {
        price: this.stock.price,
        quantity: this.stock.quantity,
        store: this.stock.store,
        product: this.smartphone.id,
        product_features: this.memory + ',' + this.hex_color
      }
      const responsestock = await this.$apiHelper.patchApi('stocks/' + this.stock.id + '/', datastock)
      if (responsestock.statusText === 'OK') {
        this.oldStock = Object.assign({}, this.stock)
        this.alertStockModified = true
      }
      Loading.hide()
    },
    deleteStock: async function () {
      Loading.show()
      await this.$apiHelper.deleteApi('stocks/' + this.stock.id + '/')
      await this.getStocks()
      this.checkStocks()
      Loading.hide()
    },
    comparaObjetos: function (a, b) {
      // compara valor propiedades objetos
      var aKeys = Object.keys(a).sort()
      var bKeys = Object.keys(b).sort()
      if (aKeys.length !== bKeys.length) {
        return false
      }
      if (aKeys.join('') !== bKeys.join('')) {
        return false
      }
      for (var i = 0; i < aKeys.length; i++) {
        if (a[aKeys[i]] !== b[bKeys[i]]) {
          return false
        }
      }
      return true
    }
  }
}
</script>

<style lang="sass" scope>
.detail-image
  display: block
  margin-left: auto
  margin-right: auto
  width: 27%

.detail-image2
  display: block
  margin-left: auto
  margin-right: auto
  width: 70%

.tabla-cuadrado
  width: 1.5em
  height: 1.5em
  border: 2px solid $dark

</style>
