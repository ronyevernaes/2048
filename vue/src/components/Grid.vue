<script lang="ts">
export default { name: 'GridComponent' };
</script>

<script setup lang="ts">
import { ref, watch } from 'vue';
import type { Ref, CSSProperties } from 'vue';

import type { MovementConfig, OptionalTile, Tile } from '../types';
import { Command, GameStatus } from '../types';
import GridService from '../services/GridService';

import { delay, getMovementConfig } from '../utils';

const props = defineProps({
  size: {
    type: Number,
    default: 4,
  },
});

const model: Ref<OptionalTile[][]> = ref([]);
const tiles: Ref<Tile[]> = ref([]);
const status: Ref<GameStatus> = ref(GameStatus.Started);
const gridStyles: Ref<CSSProperties> = ref({});

let service: GridService;

const createNewTile = (): boolean => {
  return service.createNewTile();
};

const initModel = (size: number): void => {
  status.value = GameStatus.Started;
  model.value = Array<OptionalTile[]>();
  tiles.value = Array<Tile>();

  for (let i: number = 0; i < size; i++) {
    const row: Tile[] = Array<Tile>(size);
    model.value.push(row);
  }

  gridStyles.value.gridTemplateRows = `repeat(${size}, 1fr)`;
  gridStyles.value.gridTemplateColumns = `repeat(${size}, 1fr)`;

  service = new GridService(model.value, tiles.value);

  createNewTile();
};

initModel(props.size);

watch(
  () => props.size,
  (val: number) => initModel(val)
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
  return !!model.value.find(
    (row) => !!row.find((tile: OptionalTile) => tile?.value === 2048)
  );
};

const existMergeableSquares = (): boolean => {
  const { size } = props;

  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      // compares [i, j] with [i + 1, j], [i, j + 1], [i - 1, j], [i, j - 1]
      if (
        !model.value[i][j] ||
        (i < size - 1 &&
          (model.value[i][j]?.value === model.value[i + 1][j]?.value ||
            model.value[i][j]?.value === model.value[i][j + 1]?.value)) ||
        (i > 0 &&
          (model.value[i][j]?.value === model.value[i - 1][j]?.value ||
            model.value[i][j]?.value === model.value[i][j - 1]?.value))
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
  restart: () => initModel(props.size),
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
      <div class="tile" :class="`tile-${tile.value}`" :style="tile.style">
        <h2>{{ tile.value }}</h2>
      </div>
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
.new-tile {
  width: 75px;
  height: 75px;
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
