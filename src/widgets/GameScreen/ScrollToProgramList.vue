<template>
  <div class="fixed bottom-4 right-1/2 transform translate-x-1/2 bg-white rounded shadow-lg z-50 max-h-40 overflow-y-auto flex">
    <div v-for="program in programs" :key="program.id" class="border-r last:border-r-0 border-gray-400">
      <a
        :href="`#program-${program.id}`"
        class="block px-3 py-1 text-sm text-blue-600 hover:underline"
      >
        {{  program.name  }}
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useStore } from 'vuex';

const store = useStore();

const programs = computed(() => store.getters['gameStates/allPrograms']);

</script>

<style scoped>

</style>
