<template>
  <div>
    <GameTopActions />
    <div class="flex gap-4">
      <div class="w-1/4">
        <GameHorseList />
      </div>
      <div class="w-2/4">
        <GameRaceTrack />
      </div>
      <div class="w-1/4">
        <GameStats />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import GameTopActions from './GameTopActions.vue'
import GameHorseList from './GameHorseList.vue'
import GameRaceTrack from './GameRaceTrack.vue';
import GameStats from './GameStats.vue';
</script>

<style scoped>

</style>
