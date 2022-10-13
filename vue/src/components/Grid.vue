<script lang="ts">
export default { name: 'GridComponent' };
</script>

<script setup lang="ts">
import { ref, watch } from 'vue';
import type { Ref, CSSProperties } from 'vue';

import type { MovementConfig, OptionalTile, Tile } from '../types';
import { Command, GameStatus } from '../types';
import { delay, getMovementConfig } from '../utils';
import GridService from '../services/GridService';

import TileComponent from './Tile.vue';


const props = defineProps({
  size: {
    type: Number,
    default: 4,
  },
});

const positions: Ref<OptionalTile[][]> = ref([]);
const tiles: Ref<Tile[]> = ref([]);
const status: Ref<GameStatus> = ref(GameStatus.Started);
const gridStyles: Ref<CSSProperties> = ref({});

let service: GridService;

const createNewTile = (): boolean => {
  return service.createNewTile();
};

const init = (size: number): void => {
  status.value = GameStatus.Started;
  positions.value = Array<OptionalTile[]>();
  tiles.value = Array<Tile>();

  for (let i: number = 0; i < size; i++) {
    const row: Tile[] = Array<Tile>(size);
    positions.value.push(row);
  }

  gridStyles.value.gridTemplateRows = `repeat(${size}, 1fr)`;
  gridStyles.value.gridTemplateColumns = `repeat(${size}, 1fr)`;

  service = new GridService(positions.value, tiles.value);

  createNewTile();
};

init(props.size);

watch(
  () => props.size,
  (val: number) => init(val)
);

const move = async (command: string): Promise<void> => {
  const movement: MovementConfig = getMovementConfig(command as Command);
  const somethingMoved = await service.move(movement);

  if (somethingMoved) {
    if (status.value === GameStatus.Started && find2048()) {
      status.value = GameStatus.Won;
    }

    await delay(() => {
      createNewTile();

      if (!existMergeableSquares()) {
        status.value = GameStatus.Lost;
      }
    }, 150);
  }
};

const find2048 = (): boolean => {
  return !!positions.value.find(
    (row) => !!row.find((tile: OptionalTile) => tile?.value === 2048)
  );
};

const existMergeableSquares = (): boolean => {
  const { size } = props;

  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      // compares [i, j] with [i + 1, j], [i, j + 1], [i - 1, j], [i, j - 1]
      if (
        !positions.value[i][j] ||
        (i < size - 1 &&
          (positions.value[i][j]?.value === positions.value[i + 1][j]?.value ||
            positions.value[i][j]?.value === positions.value[i][j + 1]?.value)) ||
        (i > 0 &&
          (positions.value[i][j]?.value === positions.value[i - 1][j]?.value ||
            positions.value[i][j]?.value === positions.value[i][j - 1]?.value))
      ) {
        return true;
      }
    }
  }
  return false;
};

const emit = defineEmits(['changeStatus']);

watch(
  () => status.value,
  (val: GameStatus) => {
    emit('changeStatus', val);
  }
);

defineExpose({
  move,
  restart: () => init(props.size),
});
</script>

<template>
  <div class="grid" v-if="size" :style="gridStyles">
    <template v-for="row in size" :key="`grid-row-${row}`">
      <div
        v-for="col in size"
        :key="`grid-cell-${row}-${col}`"
        class="grid-cell"
      />
    </template>

    <template v-for="tile in tiles" :key="tile.id">
      <TileComponent :data="tile" />
    </template>
  </div>
</template>

<style scoped>
.grid {
  flex: 0 0 auto;
  display: grid;
}
.grid-cell {
  width: 75px;
  height: 75px;
  flex: 0 0 auto;
  border: 0.5px solid #03071e;
  justify-content: center;
  align-items: center;
  display: flex;
  background-color: #fde9c3;
}
</style>
