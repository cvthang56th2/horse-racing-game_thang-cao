<template>
  <div>
    <div class="flex items-center space-x-4">
      <div
        class="w-16 h-16 rounded-md"
        :style="{
          backgroundColor: horse.color
        }"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Horse } from '@/types';
import { defineComponent, defineProps } from 'vue';
defineComponent({
  name: 'TheHorse',
});
interface Props {
  horse: Horse
}
defineProps<Props>();
</script>

<style scoped>

</style>
