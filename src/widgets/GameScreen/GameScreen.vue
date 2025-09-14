<template>
  <div>
    <GameTopActions />
    <div class="space-y-4">
      <div v-for="horse in horses" :key="horse.id" class="p-4 border rounded">
        <h2 class="mt-0">{{ horse.name }}</h2>
        <div class="flex items-center gap-2">
          <div
            class="w-5 h-5 rounded-full"
            :style="{ backgroundColor: horse.color }"
          ></div>
          <p class="!my-0">Color: {{ horse.color }}</p>
        </div>
        <p>Speed: {{ horse.speed }}</p>
        <p class="mb-0">Position: {{ horse.position }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from 'vuex'
import GameTopActions from './GameTopActions.vue'

const store = useStore()

const horses = computed(() => store.getters['gameStates/allHorses'])
</script>

<style scoped>

</style>
