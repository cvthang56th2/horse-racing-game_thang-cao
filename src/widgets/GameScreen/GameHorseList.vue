<template>
  <div>
    <div class="font-bold">
      Horse List (1 - 20)
    </div>
    <div class="space-y-4">
      <BaseTable
        :columns="[
          { key: 'name', title: 'Name', align: 'left' },
          { key: 'color', title: 'Color', align: 'center' },
          { key: 'condition', title: 'Condition', align: 'right' },
        ]"
        :data="horses"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

const horses = computed(() => store.getters['gameStates/allHorses'])
</script>

<style scoped>

</style>
