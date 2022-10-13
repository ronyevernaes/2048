<script lang="ts">
export default { name: 'TileComponent' };
</script>

<script setup lang="ts">
import type { CSSProperties, PropType } from 'vue';

import type { Tile } from '../types';

defineProps({
  data: {
    type: Object as PropType<Tile>,
    required: true,
  },
});

const getStylePosition = (x: number, y: number): CSSProperties => {
  return {
    transform: `translate(${75 * x}px, ${75 * y}px)`,
  };
};
</script>

<template>
  <div
    class="tile"
    :class="`tile-${data.value}`"
    :style="getStylePosition(data.x, data.y)"
  >
    <h2>{{ !!data.value || data.value !== 0 ? data.value : '' }}</h2>
  </div>
</template>

<style scoped>
.tile {
  position: absolute;
  transition: transform 100ms;
  width: 75px;
  height: 75px;
  border: 1px solid #03071e;
  justify-content: center;
  align-items: center;
  display: flex;
  flex-direction: column;
  z-index: 0;
}
.tile-1 {
  background-color: #ffba08;
  color: black;
}
.tile-2 {
  background-color: #ffba08;
  color: black;
}
.tile-4 {
  background-color: #faa307;
  color: black;
}
.tile-8 {
  background-color: #faa307;
  color: black;
}
.tile-16 {
  background-color: #f48c06;
  color: white;
}
.tile-32 {
  background-color: #e85d04;
  color: white;
}
.tile-64 {
  background-color: #dc2f02;
  color: white;
}
.tile-128 {
  background-color: #d00000;
  color: white;
}
.tile-256 {
  background-color: #9d0208;
  color: white;
}
.tile-512 {
  background-color: #6a040f;
  color: white;
}
.tile-1024 {
  background-color: #370617;
  color: white;
}
.tile-2048 {
  background-color: #03071e;
  color: white;
}
</style>
