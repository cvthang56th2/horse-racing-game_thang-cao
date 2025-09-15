<template>
  <div class="space-y-6">
    <GameTopActions :show-horse-list="showHorseList" @toggle-horse-list="toggleHorseList" />
    <div class="flex flex-col lg:flex-row gap-6">
      <Transition name="slide-left">
        <div v-if="showHorseList" class="w-full lg:w-1/4">
          <GameHorseList />
        </div>
      </Transition>
      <div class="w-full transition-all duration-300" :class="showHorseList ? 'lg:w-3/4' : 'lg:w-full'">
        <GamePrograms />
      </div>
    </div>
    <ScrollToProgramList />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import GameTopActions from './GameTopActions.vue'
import GameHorseList from './GameHorseList.vue'
import GamePrograms from './GamePrograms.vue';
import ScrollToProgramList from './ScrollToProgramList.vue';

const showHorseList = ref(true);

const toggleHorseList = () => {
  showHorseList.value = !showHorseList.value;
};
</script>

<style scoped>
.slide-left-enter-active,
.slide-left-leave-active {
  transition: all 0.3s ease-in-out;
}

.slide-left-enter-from {
  opacity: 0;
  transform: translateX(-100%);
}

.slide-left-leave-to {
  opacity: 0;
  transform: translateX(-100%);
}
</style>
