<template>
  <div class="fixed bottom-4 right-1/2 transform translate-x-1/2 bg-white rounded shadow-lg z-50 max-h-40 overflow-y-auto flex" data-testid="scroll-programs">
    <div v-for="program in programs" :key="program.id" class="border-r last:border-r-0 border-gray-400" :data-testid="`scroll-link-${program.id}`">
      <a
        :href="`#program-${program.id}`"
        class="block px-3 py-1 text-sm text-blue-600 hover:underline"
        data-testid="scroll-link"
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
