<template>
  <div class="space-y-4">
    <div>
      <h4 class="text-sm font-semibold mb-2 text-gray-700">Program</h4>
      <BaseTable
        :columns="raceProgramColumns"
        :data="program.horses.map((horse, index) => ({ ...horse, position: index + 1 }))"
        row-key="id"
        :empty-message="'No horses in the program'"
      />
    </div>
    <div>
      <h4 class="text-sm font-semibold mb-2" :class="getLiveResultsClass(program.id)">
        {{ getResultsTitle(program.id) }}
      </h4>
      <BaseTable
        :columns="raceResultColumns"
        :data="getProgramResults(program.id)"
        row-key="horseId"
        :empty-message="'No results yet'"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import BaseTable from '@/shared/components/ui/BaseTable.vue';
import type { Horse, RaceProgram, RaceResult, LiveRaceResult } from '@/types';
import { defineProps, computed } from 'vue';
import { useStore } from 'vuex';

interface ProgramResult extends Record<string, unknown> {
  horseId: number;
  position: number;
  horseData?: Horse;
  isFinished?: boolean;
  isLive?: boolean;
}

interface Props {
  programId: number;
}

const props = defineProps<Props>();
const store = useStore();
const program = computed<RaceProgram>(() => {
  const prog = store.getters['gameStates/getProgramById'](props.programId);
  if (!prog) {
    throw new Error(`Program with ID ${props.programId} not found`);
  }
  return prog;
});

const horses = computed<Horse[]>(() => store.getters['gameStates/allHorses']);
const results = computed<RaceResult[]>(() => store.getters['gameStates/allResults']);
const liveResults = computed<LiveRaceResult[]>(() => store.getters['gameStates/allLiveResults']);
const isRacing = computed(() => store.getters['gameStates/isRacing']);

const getProgramResults = (programId: number): ProgramResult[] => {
  // Check if there are live results for this program (race is running)
  const liveResult = liveResults.value.find((result: LiveRaceResult) => result.programId === programId);

  if (liveResult && isRacing.value) {
    // Return live results during race
    return liveResult.result.map((r) => ({
      horseId: r.horseId,
      position: r.position,
      isFinished: r.isFinished,
      isLive: true,
      horseData: horses.value.find(h => h.id === r.horseId)
    })).sort((a, b) => a.position - b.position);
  }

  // Return final results when race is finished
  const programResults = results.value.find((result: RaceResult) => result.programId === programId);
  if (!programResults || !programResults.result) return [];

  return programResults.result.map((r) => ({
    horseId: r.horseId,
    position: r.position,
    isFinished: true,
    isLive: false,
    horseData: horses.value.find(h => h.id === r.horseId)
  })).sort((a, b) => a.position - b.position);
};

const getResultsTitle = (programId: number): string => {
  const liveResult = liveResults.value.find((result: LiveRaceResult) => result.programId === programId);

  if (liveResult && isRacing.value) {
    return `🔴 Live Results`;
  }

  const finalResult = results.value.find((result: RaceResult) => result.programId === programId);
  if (finalResult) {
    return `🏆 Final Results`;
  }

  return `Results`;
};

const getLiveResultsClass = (programId: number): string => {
  const liveResult = liveResults.value.find((result: LiveRaceResult) => result.programId === programId);

  if (liveResult && isRacing.value) {
    return 'text-red-600 animate-pulse';
  }

  const finalResult = results.value.find((result: RaceResult) => result.programId === programId);
  if (finalResult) {
    return 'text-green-600';
  }

  return 'text-gray-700';
};

const raceProgramColumns = [
  { key: 'position', title: 'Pos', width: '60px' },
  { key: 'name', title: 'Name' },
];

const raceResultColumns = [
  { key: 'position', title: 'Pos', width: '60px' },
  {
    key: 'horseId',
    title: 'Name',
    formatter: (value: unknown) => {
      const horse = horses.value.find(h => h.id === value);
      return horse ? horse.name : 'Unknown';
    }
  },
  {
    key: 'isFinished',
    title: 'Status',
    width: '80px',
    formatter: (value: unknown, row: Record<string, unknown>) => {
      if (row.isLive) {
        return value ? '🏁 Finished' : '🏃 Racing';
      }
      return '✅ Final';
    }
  },
];
</script>

<style scoped>

</style>
