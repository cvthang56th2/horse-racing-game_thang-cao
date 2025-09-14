<template>
  <div class="space-y-10">
    <div v-for="(_, index) in (new Array(6)).fill(0).map((_, index) => index * 1000)" :key="index" class="p-4 border rounded-lg bg-white shadow">
      <h4>Program {{ index + 1 }}</h4>
      <div class="space-y-4">
        <div v-for="(_, hIndex) in (new Array(10)).fill(0)" :key="`${index}-${hIndex}`" class="relative">
          <div class="flex items-center gap-4 mb-2">
            <span class="rounded-full bg-green-600 text-white w-7 h-7 flex items-center justify-center">{{ hIndex + 1 }}</span>
            <span class="text-sm font-medium">Horse {{ hIndex + 1 }}</span>
          </div>
          <!-- Race track -->
          <div class="relative h-16 bg-gradient-to-r from-green-100 to-green-200 border-2 border-green-300 rounded-lg overflow-hidden">
            <!-- Finish line -->
            <div class="absolute right-0 top-0 h-full w-2 bg-red-500 z-10"></div>
            <!-- Horse container with animation -->
            <div
              class="absolute top-1/2 transform -translate-y-1/2 transition-all duration-100 ease-linear"
              :style="{ left: `${horsePositions[`${index}-${hIndex}`] || 0}%` }"
            >
              <Horse
                :horse="{
                  id: hIndex + 1,
                  name: `Horse ${hIndex + 1}`,
                  color: `hsl(${(hIndex + 1) * 36}, 70%, 50%)`,
                  condition: 100
                }"
                :is-running="isRacing"
              />
            </div>
          </div>
        </div>
      </div>
      <!-- Race controls -->
      <div class="mt-4 flex gap-2">
        <button
          @click="startRace(index)"
          :disabled="isRacing"
          class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400"
        >
          Start Race
        </button>
        <button
          @click="resetRace(index)"
          class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Reset
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import Horse from '@/widgets/GameScreen/Horse/Horse.vue';

const isRacing = ref(false);
const horsePositions = reactive<Record<string, number>>({});
const raceIntervals = ref<Record<number, number>>({});

const startRace = (programIndex: number) => {
  if (isRacing.value) return;

  isRacing.value = true;

  // Initialize positions for this program's horses
  for (let hIndex = 0; hIndex < 10; hIndex++) {
    const key = `${programIndex}-${hIndex}`;
    horsePositions[key] = 0;
  }

  const interval = setInterval(() => {
    let raceFinished = false;

    for (let hIndex = 0; hIndex < 10; hIndex++) {
      const key = `${programIndex}-${hIndex}`;

      // Random speed between 0.5 and 2.5 percent per tick
      const speed = Math.random() * 2 + 0.5;
      horsePositions[key] = Math.min(horsePositions[key] + speed, 95);

      // Check if any horse finished
      if (horsePositions[key] >= 95) {
        raceFinished = true;
      }
    }

    if (raceFinished) {
      clearInterval(interval);
      delete raceIntervals.value[programIndex];
      isRacing.value = false;

      // Find winner
      const winner = Object.entries(horsePositions)
        .filter(([key]) => key.startsWith(`${programIndex}-`))
        .reduce((max, [key, position]) => position > max.position ? { key, position } : max, { key: '', position: 0 });

      const horseNumber = winner.key.split('-')[1];
      alert(`Horse ${parseInt(horseNumber) + 1} wins Program ${programIndex + 1}!`);
    }
  }, 100);

  raceIntervals.value[programIndex] = interval;
};

const resetRace = (programIndex: number) => {
  // Clear any running interval
  if (raceIntervals.value[programIndex]) {
    clearInterval(raceIntervals.value[programIndex]);
    delete raceIntervals.value[programIndex];
  }

  // Reset positions for this program's horses
  for (let hIndex = 0; hIndex < 10; hIndex++) {
    const key = `${programIndex}-${hIndex}`;
    horsePositions[key] = 0;
  }

  isRacing.value = false;
};
</script>

<style scoped>
/* Add any additional animations here if needed */
</style>
