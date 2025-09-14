<template>
  <div class="space-y-10">
    <div v-for="(_, index) in (new Array(6)).fill(0).map((_, index) => index * 1000)" :key="index" class="p-4 border rounded-lg bg-white shadow">
      <h4>Program {{ index + 1 }}</h4>
      <div class="space-y-4">
        <div v-for="(_, hIndex) in (new Array(10)).fill(0)" :key="`${index}-${hIndex}`" class="flex items-center gap-4">
          <span class="rounded-full bg-green-600 text-white w-7 h-7 flex items-center justify-center">{{ hIndex + 1 }}</span>
          <div>
            <Horse :horse="{ id: hIndex + 1, name: `Horse ${hIndex + 1}`, color: `hsl(${(hIndex + 1) * 36}, 70%, 50%)`, condition: 100 }" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Horse from '@/widgets/GameScreen/Horse/Horse.vue';
</script>

<style scoped>

</style>
