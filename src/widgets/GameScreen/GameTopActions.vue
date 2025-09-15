<template>
  <div class="flex flex-col lg:flex-row justify-center lg:justify-between items-center gap-4 border-b pb-4">
    <h1 class="text-2xl font-bold">Horse Racing Game</h1>
    <div class="flex gap-4 flex-wrap">
      <BaseButton
        @click="toggleHorseList"
        class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
      >
        {{ showHorseList ? '🐴 Hide Horses' : '🐴 Show Horses' }}
      </BaseButton>
      <BaseButton
        @click="generateProgram"
        :class="cn(
          'px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600',
          programs.length === 0 ? 'animate-bounce' : ''
        )"
      >
        {{ programs.length === 0 ? 'Generate Program' : 'Regenerate Program' }}
      </BaseButton>
      <BaseButton
        @click="startAllRaces"
        :disabled="programs.length === 0 || isRacing"
        :class="cn(
          'px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed',
          !(programs.length === 0 || isRacing) ? 'animate-bounce' : ''
        )"
      >
        Start All Races
      </BaseButton>
      <BaseButton
        v-if="isRacing"
        @click="togglePauseRaces"
        :class="cn(
          'px-4 py-2 text-white rounded transition-colors',
          isPaused ? 'bg-green-600 hover:bg-green-700 animate-bounce' : 'bg-yellow-600 hover:bg-yellow-700'
        )"
      >
        {{ isPaused ? '▶️ Resume' : '⏸️ Pause' }}
      </BaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { cn } from '@/shared/lib/utils'
import { computed } from 'vue'
import { useStore } from 'vuex'

interface Props {
  showHorseList?: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  toggleHorseList: []
}>()

const store = useStore()

const programs = computed(() => store.getters['gameStates/allPrograms'])
const isRacing = computed(() => store.getters['gameStates/isRacing'])
const isPaused = computed(() => store.getters['gameStates/isPaused'])

const startAllRaces = () => {
  store.dispatch('gameStates/startAllRaces')
}

const resetAllRaces = () => {
  store.dispatch('gameStates/resetAllRaces')
}

const togglePauseRaces = () => {
  store.dispatch('gameStates/togglePauseRaces')
}

const generateProgram = () => {
  resetAllRaces()
  store.dispatch('gameStates/generateProgram', 6)
}

const toggleHorseList = () => {
  emit('toggleHorseList')
}

</script>

<style scoped>

</style>
