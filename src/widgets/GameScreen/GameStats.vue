<template>
  <div>
    <div class="grid grid-cols-2 gap-4">
      <div class="font-bold text-center">
        Program
      </div>
      <div class="font-bold text-center">
        Results
      </div>
    </div>
    <div v-for="race in races" :key="race.id" class="grid grid-cols-2 gap-4 mt-4 border-t pt-4">
      <div>
        <BaseTable
          :columns="raceProgramColumns"
          :data="race.program.horses"
          row-key="id"
          :empty-message="'No horses in the program'"
        />
      </div>
      <div>
        <BaseTable
          :columns="raceResultColumns"
          :data="race.result"
          row-key="horseId"
          :empty-message="'No results yet'"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import BaseTable from '@/shared/components/ui/BaseTable.vue';
import type { Horse } from '@/types';
import { computed } from 'vue';
import { useStore } from 'vuex';

const store = useStore();

const horses = computed<Horse[]>(() => store.getters['gameStates/allHorses'])

const races = computed(() => {
  return ([
    {
      id: 1,
      program: {
        id: 1,
        horses: [...horses.value].slice(0, 9).map((h, index) => ({
          ...h,
          position: index + 1
        }))
      },
      result: horses.value.slice(0, 9).map((h, index) => ({
        horseId: h.id,
        position: index + 1,
        horseData: h
      })).sort((a, b) => a.position - b.position)
    },
    {
      id: 2,
      program: {
        id: 2,
        horses: [...horses.value].slice(3, 12).map((h, index) => ({
          ...h,
          position: index + 1
        }))
      },
      result: [...horses.value].slice(3, 12).map((h, index) => ({
        horseId: h.id,
        position: index + 1,
        horseData: h
      })).sort((a, b) => a.position - b.position)
    }
  ])
})

const raceProgramColumns = [
  { key: 'position', title: 'Position' },
  { key: 'name', title: 'Name' },
]

const raceResultColumns = [
  { key: 'position', title: 'Position' },
  {
    key: 'horseId', title: 'Name', formatter: (value: unknown) => {
    const horse = horses.value.find(h => h.id === value);
      return horse ? horse.name : 'Unknown';
    }
  },
]
</script>

<style scoped>

</style>
