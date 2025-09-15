<template>
  <div>
    <div class="space-y-3">
      <div v-for="(horse, hIndex) in program.horses" :key="horse.id" class="relative">
        <div class="flex items-center gap-4 mb-2">
          <span class="rounded-full bg-green-600 text-white w-7 h-7 flex items-center justify-center text-sm font-bold">{{ hIndex + 1 }}</span>
          <span class="text-sm font-medium">{{ horse.name }}</span>
          <span class="text-xs text-gray-500">Condition: {{ horse.condition }}%</span>
        </div>
        <!-- Race track -->
        <div class="relative h-13 border-b-2 border-dashed overflow-hidden">
          <!-- Track markings -->
          <div class="absolute inset-0 flex">
            <div v-for="i in 10" :key="i" class="flex-1 border-r border-green-400 opacity-30"></div>
          </div>
          <!-- Finish line -->
          <div class="absolute right-0 top-0 h-full w-2 bg-red-500 z-10"></div>
          <!-- Horse container with animation -->
          <div
            class="absolute top-1/2 transform -translate-y-1/2 transition-all duration-100 ease-linear z-20"
            :style="{ left: `${Math.min(95, horsePositions[`${program.id}-${horse.id}`] || 0)}%` }"
          >
            <RaceHorse
              :horse="horse"
              :is-running="isRacing && runningPrograms.has(program.id) && (horsePositions[`${program.id}-${horse.id}`] || 0) < 95"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import RaceHorse from '@/widgets/GameScreen/RaceHorse/RaceHorse.vue';
import { computed, defineProps } from 'vue';
import { useStore } from 'vuex';

const props = defineProps<{
  programId: number;
}>();

const store = useStore();
const programs = computed(() => store.getters['gameStates/allPrograms']);
const program = computed(() => {
  const prog = programs.value.find((p: { id: number }) => p.id === props.programId);
  if (!prog) {
    throw new Error(`Program with ID ${props.programId} not found`);
  }
  return prog;
});

const isRacing = computed(() => store.getters['gameStates/isRacing']);
const runningPrograms = computed(() => store.getters['gameStates/allRunningPrograms']);
const horsePositions = computed(() => store.getters['gameStates/allHorsePositions']);
</script>

<style scoped>

</style>
