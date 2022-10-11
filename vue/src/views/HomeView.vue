<script setup lang="ts">
import { ref } from 'vue';
import type { Ref } from 'vue';
import { useKeypress } from 'vue3-keypress';

import Grid from '../components/Grid.vue';

const size: Ref<number> = ref<number>(4);
const grid = ref<typeof Grid | null>(null);

let moving: boolean = false;

const onKeyPress = async ({ event }: { event: KeyboardEvent }) => {
  if (!moving && grid.value) {
    moving = true;
    await grid.value.move(event.code);
    moving = false;
  }
};

const onClickNewGame = () => {
  grid.value?.restart();
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
  <div class="content">
    <h1>Play 2048</h1>

    <div class="legend">
      <ul>
        <li>Set your difficulty level, and start to play.</li>
        <li>Use the arrows to move the tiles around the board.</li>
        <li>Tiles with the same number will sum.</li>
        <li>Reach 2048 and win.</li>
        <li>If you keep without space, you will lose.</li>
      </ul>
      <div>Enjoy!</div>
    </div>

    <div class="toolbar">
      <a-radio-group
        button-style="solid"
        option-type="button"
        size="large"
        v-model:value.number="size"
      >
        <a-space>
          <a-radio-button :value="6">Easy</a-radio-button>
          <a-radio-button :value="5">Medium</a-radio-button>
          <a-radio-button :value="4">Hard</a-radio-button>
          <a-radio-button :value="3">Insane</a-radio-button>
        </a-space>
      </a-radio-group>
    </div>

    <Grid :size="size" ref="grid" />

    <a-button type="primary" block size="large" @click="onClickNewGame">
      New Game
    </a-button>
  </div>
</template>

<style scoped>
.content {
  width: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 12px;
}
.legend > div {
  text-align: center;
  font-weight: bold;
}
.toolbar {
  padding-top: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.toolbar input {
  width: 100%;
}
</style>
