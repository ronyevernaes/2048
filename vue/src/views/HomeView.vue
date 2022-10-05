<script setup lang="ts">
import { ref } from 'vue';
import { useKeypress } from 'vue3-keypress';

import Grid from '../components/Grid.vue';

const size: number = ref<number>(4);

const grid = ref<typeof Grid | null>(null);

const onKeyPress = ({ event }: { event: KeyboardEvent }) => {
  if (grid.value) {
    grid.value.move(event.code);
  }
};

useKeypress({
  keyEvent: 'keydown',
  keyBinds: [
    { keyCode: 'up', success: onKeyPress },
    { keyCode: 'down', success: onKeyPress },
    { keyCode: 'left', success: onKeyPress },
    { keyCode: 'right', success: onKeyPress },
  ],
});
</script>

<template>
  <div class="toolbar">
    <input v-model.number="size" />
  </div>
  <Grid :size="size" ref="grid" />
</template>

<style scoped>
.toolbar {
  width: 300px;
  padding-bottom: 8px;
}
.toolbar input {
  width: 100%;
}
</style>
