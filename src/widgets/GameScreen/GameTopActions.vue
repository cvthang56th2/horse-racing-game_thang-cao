<template>
  <div>
    <BaseButton
      @click="generateHorses"
      class="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
    >
      Generate Horses
    </BaseButton>
  </div>
</template>

<script setup lang="ts">
import { useStore } from 'vuex'

const store = useStore()

const generateHorses = () => {
  store.dispatch('horses/generateHorses', 20)
}
</script>

<style scoped>

</style>
