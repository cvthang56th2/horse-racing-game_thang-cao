<template>
  <div class="flex flex-col lg:flex-row justify-center lg:justify-between items-center gap-4">
    <h1 class="text-2xl font-bold">Horse Racing Game</h1>
    <div class="flex gap-4">
      <BaseButton
        @click="generateHorses"
        class="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Generate Horses
      </BaseButton>
      <BaseButton
        @click="generateProgram"
        class="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Generate Program
      </BaseButton>
      <BaseButton
        @click="toggleRacing"
        class="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Start / Pause
      </BaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useStore } from 'vuex'

const store = useStore()

const generateHorses = () => {
  store.dispatch('gameStates/generateHorses', 20)
}

const generateProgram = () => {
  store.dispatch('gameStates/generateProgram', 20)
}

const toggleRacing = () => {
  store.commit('gameStates/toggleRacing')
}

</script>

<style scoped>

</style>
