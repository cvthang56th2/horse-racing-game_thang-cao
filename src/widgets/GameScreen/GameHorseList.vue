<template>
  <div>
    <div class="font-bold mb-4">
      Horse List ({{ horses.length }} horses)
    </div>
    <div class="space-y-4">
      <BaseTable
        :columns="horseColumns"
        :data="horses"
        row-key="id"
        :empty-message="'No horses available. Generate horses first.'"
      >
        <template #cell-color="{ value }">
          <div class="flex items-center justify-center">
            <div
              class="w-6 h-6 rounded-full border border-gray-300"
              :style="{ backgroundColor: value }"
            ></div>
          </div>
        </template>
      </BaseTable>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

const horses = computed(() => store.getters['gameStates/allHorses'])

const horseColumns = [
  { key: 'name', title: 'Name', align: 'left' },
  { key: 'color', title: 'Color', align: 'center', width: '50px' },
  { key: 'condition', title: 'Condition', align: 'center', width: '50px', formatter: (value: unknown) => `${value}%` },
]
</script>

<style scoped>

</style>
