<template>
  <div>
    <GameTopActions />
    <div v-for="horse in horses" :key="horse.id" class="mb-4 p-4 border rounded">
      <div
        class="w-16 h-16 rounded-full mb-2"
        :style="{ backgroundColor: horse.color }"
      ></div>
      <h2>{{ horse.name }}</h2>
      <p>Speed: {{ horse.speed }}</p>
      <p>Position: {{ horse.position }}</p>
      <div class="w-full bg-gray-200 rounded-full h-4 mt-2">
        <div
          class="bg-blue-500 h-4 rounded-full"
          :style="{ width: horse.position + '%' }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from 'vuex'
import GameTopActions from './GameTopActions.vue'

const store = useStore()

const horses = computed(() => store.getters['horses/allHorses'])
</script>

<style scoped>

</style>
