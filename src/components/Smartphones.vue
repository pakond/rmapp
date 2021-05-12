<template>
  <q-page>
    <q-table
      dense
      :grid="grid = $q.screen.lt.md"
      :data="smartphones"
      :columns="columns"
      :filter="filter"
      row-key="name"
      class="q-pa-md q-ma-md bg-primary rounded-borders shadow-6"
    >
      <template v-slot:item="props" v-if="grid">
        <q-card class="q-mt-xs q-mb-xs" style="width: 100%">
          <template>
            <q-list>
              <q-item v-for="(col, i) in props.cols" :key="i">
                <template v-if="col.label===$t('image')">
                  <q-item-section avatar style="position: absolute; left: 65%; top: 200%;">
                    <q-img :src="col.value" style="heigth: 200%; width: 200%;" />
                  </q-item-section>
                </template>
                <template v-else-if="col.label===$t('color')">
                  <q-item-section>
                    <q-item-label lines="1" caption>
                    {{ col.label }}
                    </q-item-label>
                    <q-item-label>
                      <div class="row">
                        <div v-for="(value, index) in col.value" :key="index" class="tabla-cuadrado q-ml-xs" :style="{ 'background-color': value }">
                          <q-tooltip>
                            {{ $t(value) }}
                          </q-tooltip>
                        </div>
                      </div>
                    </q-item-label>
                  </q-item-section>
                </template>
                <template v-else-if="col.label===$t('battery')">
                  <q-item-section>
                    <q-item-label lines="1" caption>
                    {{ col.label }}
                    </q-item-label>
                    <q-item-label>{{ col.value }} mAh</q-item-label>
                  </q-item-section>
                </template>
                <template v-else-if="col.label===$t('camera')">
                  <q-item-section>
                    <q-item-label lines="1" caption>
                    {{ col.label }}
                    </q-item-label>
                    <q-item-label>{{ parseFloat(col.value) }} Mpx</q-item-label>
                  </q-item-section>
                </template>
                <template v-else-if="col.label===$t('model')">
                  <q-item-section>
                    <q-item-label lines="1" caption>
                    {{ col.label }}
                    </q-item-label>
                    <q-item-label><router-link :to="'/smartphones/' + col.value[1]" class="text-accent">{{ col.value[0] }}</router-link></q-item-label>
                  </q-item-section>
                </template>
                <template v-else>
                  <q-item-section>
                    <q-item-label lines="1" caption>
                    {{ col.label }}
                    </q-item-label>
                    <q-item-label :lines="typeof col.value === 'string' && (col.value.includes(' ') || col.value.includes('-')) ? 3 : 1">{{ col.value }}</q-item-label>
                  </q-item-section>
                </template>
              </q-item>
            </q-list>
          </template>
        </q-card>
      </template>
      <!-- NO GRID -->
      <template v-slot:body-cell-camera="props" v-if="!grid">
        <q-td>
          {{ parseFloat(props.value) }} Mpx
        </q-td>
      </template>
      <template v-slot:body-cell-battery="props" v-if="!grid">
        <q-td>
          {{ props.value }} mAh
        </q-td>
      </template>
      <template v-slot:body-cell-image="props" v-if="!grid">
        <q-td>
        <q-img
          :src="props.value"
          style="heigth: 50%; width: 50%"
        />
        </q-td>
      </template>
      <template v-slot:body-cell-color="props" v-if="!grid">
        <q-td>
          <div class="row">
            <div v-for="(value, index) in props.value" :key="index" class="tabla-cuadrado q-ml-xs" :style="{ 'background-color': value }">
              <q-tooltip>
                {{ $t(value) }}
              </q-tooltip>
            </div>
          </div>
        </q-td>
      </template>
      <template v-slot:body-cell-name="props" v-if="!grid">
        <q-td>
        <router-link :to="'/smartphones/' + props.value[1]" class="text-accent">{{ props.value[0] }}</router-link>
        </q-td>
      </template>
      <template v-slot:top="props">
        <q-input outlined dense debounce="300" v-model="filter" :placeholder="$t('search')">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>
    </q-table>
  </q-page>
</template>

<script>
import { Loading } from 'quasar'

export default {
  name: 'Smartphones',
  data () {
    return {
      grid: false,
      filter: '',
      smartphones: [],
      columns: [
        { name: 'image', label: this.$t('image'), field: 'image', align: 'left' },
        { name: 'name', label: this.$t('model'), align: 'left', field: row => [ row.name, row.id ], sortable: true },
        { name: 'color', label: this.$t('color'), align: 'left', field: 'color' },
        { name: 'screen', label: this.$t('screen'), field: 'screen', sortable: true, align: 'left' },
        { name: 'camera', label: this.$t('camera'), field: 'camera', sortable: true, sort: (a, b) => a - b, align: 'left' },
        { name: 'battery', label: this.$t('battery'), field: 'battery', sortable: true, sort: (a, b) => a - b, align: 'left' }
      ]
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
    async getData () {
      // coje datos del la api
      Loading.show()
      const smartphones = await this.$apiHelper.getApi('smartphones/')
      this.smartphones = smartphones.data
      for (const entry in this.smartphones) {
        for (const [key, value] of Object.entries(this.smartphones[entry])) {
          if (key === 'color') {
            let colors = value.split(',')
            this.$set(this.smartphones[entry], key, [])
            for (const color in colors) {
              this.smartphones[entry][key].push(colors[color].trim())
            }
          }
        }
      }
      Loading.hide()
    }
  }
}
</script>

<style lang="sass" scope>
.tabla-cuadrado
  width: 1.5em
  height: 1.5em
  border: 2px solid $dark

</style>
