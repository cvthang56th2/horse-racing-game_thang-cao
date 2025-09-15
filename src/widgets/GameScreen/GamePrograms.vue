<template>
  <div class="space-y-6" >
    <div v-if="programs.length === 0" class="text-center py-8">
      <p class="text-gray-500">No race programs available. Generate horses and programs first.</p>
    </div>

    <div v-for="program in programs" :key="program.id" :id="`program-${program.id}`" class="pb-6 border-b-1 last:border-b-0">
      <h4 class="text-lg font-semibold mb-4 text-center">{{ program.name }}</h4>
      <div class="flex gap-4 flex-col lg:flex-row">
        <div class="p-4 border rounded-lg bg-white shadow w-full lg:w-2/3">
          <GameRaceTrack :program-id="program.id" />
        </div>
        <div class="w=full lg:w-1/3">
          <GameProgramStats :program-id="program.id" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useStore } from 'vuex';
import GameProgramStats from './GameProgramStats.vue';
import GameRaceTrack from './GameRaceTrack.vue';

const store = useStore();

const programs = computed(() => store.getters['gameStates/allPrograms']);
</script>

<style scoped>
/* Add any additional animations here if needed */
</style>
