<template>
  <div>
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
import { defineComponent } from 'vue';
import { generateRandomColor, generateRandomHorseName, generateRandomNumber  } from '@/shared/lib/utils';
defineComponent({
  name: 'GameScreen',
});
const uniqueColors = new Set<string>();
const horses = Array.from({ length: 20 }, (_, index) => {
  let color;
  do {
    color = generateRandomColor();
  } while (uniqueColors.has(color));
  uniqueColors.add(color);
  return {
    id: index + 1,
    name: generateRandomHorseName(),
    speed: generateRandomNumber(40, 100),
    position: 0,
    color,
  };
});
</script>

<style scoped>

</style>
