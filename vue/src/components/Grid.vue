<script lang="ts">
export default { name: 'GridComponent' };
</script>

<script setup lang="ts">
import { ref, watch } from 'vue';
import type { Ref, CSSProperties } from 'vue';

import {
  delay,
  getNextPosition,
  getNextValue,
  getMovementConfig,
  getStart,
  isContinueLoop,
  changeLoopIndex,
  getStylePosition,
} from '../utils';

import type { MovementConfig, OptionalTile, Tile } from '../types';

import { Axis, Command, GameStatus } from '../types';

const props = defineProps({
  size: {
    type: Number,
    default: 4,
  },
});

const model: Ref<OptionalTile[][]> = ref([]);
const tiles: Ref<Tile[]> = ref([]);
const status: Ref<GameStatus> = ref(GameStatus.Started);
const gridStyles: CSSProperties = {};

const createNewSquare = (): boolean => {
  const nextPosition = getNextPosition(model.value);

  if (!nextPosition) {
    return false;
  }

  const [x, y]: [number, number] = nextPosition;
  const value: number = getNextValue();

  const newTile: Tile = {
    id: `tile-${new Date().getMilliseconds().toString()}`,
    value,
    style: getStylePosition(x, y),
  };

  tiles.value.push(newTile);
  model.value[x][y] = newTile;

  return true;
};

const initModel = (size: number): void => {
  model.value = Array<OptionalTile[]>();
  tiles.value = Array<Tile>();

  for (let i: number = 0; i < size; i++) {
    const row: Tile[] = Array<Tile>(size);

    model.value.push(row);
  }

  gridStyles.gridTemplateRows = `repeat(${size}, 1fr)`;
  gridStyles.gridTemplateColumns = `repeat(${size}, 1fr)`;

  createNewSquare();
};

initModel(props.size);

watch(
  () => props.size,
  (val: number) => {
    initModel(val);
  }
);

const getTileByAxis = (
  axis: Axis,
  mainAxisIndex: number,
  crossAxisIndex: number
): OptionalTile => {
  switch (axis) {
    case Axis.X:
      return model.value[mainAxisIndex][crossAxisIndex];
    case Axis.Y:
      return model.value[crossAxisIndex][mainAxisIndex];
    default:
      throw new Error(`Invalid axis value: "${axis}"`);
  }
};

const setTileByAxis = (
  axis: Axis,
  mainAxisIndex: number,
  crossAxisIndex: number,
  tile: Tile
): void => {
  switch (axis) {
    case Axis.X:
      model.value[mainAxisIndex][crossAxisIndex] = tile;
      tile.style = getStylePosition(mainAxisIndex, crossAxisIndex);
      break;
    case Axis.Y:
      model.value[crossAxisIndex][mainAxisIndex] = tile;
      tile.style = getStylePosition(crossAxisIndex, mainAxisIndex);
      break;
    default:
      throw new Error(`Invalid axis value: "${axis}"`);
  }
};

const move = (command: string): void => {
  const { direction, axis }: MovementConfig = getMovementConfig(
    command as Command
  );
  const { size } = props;

  let somethingMoved = false;

  // Cross axis pivoting - ci: Cross Axis Index
  for (let ci: number = 0; ci < size; ci++) {
    // Main axis pivoting - mi: Main Axis Index
    for (
      let mi: number = getStart(direction, size);
      isContinueLoop(direction, mi, size);
      mi = changeLoopIndex(direction, mi)
    ) {
      // Lookup the square to move through the main axis - li: Lookup Index (assigned to the main axis)
      for (
        let li: number = changeLoopIndex(direction, mi);
        isContinueLoop(direction, li, size, true);
        li = changeLoopIndex(direction, li)
      ) {
        const pivotSquare = getTileByAxis(axis, mi, ci);
        const lookupSquare = getTileByAxis(axis, li, ci);

        if (pivotSquare) {
          if (lookupSquare) {
            if (lookupSquare.value === pivotSquare.value) {
              setTileByAxis(axis, mi, ci, lookupSquare);
              clearTile(axis, li, ci);
              delay(() => {
                removeTile(pivotSquare);
                lookupSquare.value *= 2;
              }, 250);
              somethingMoved = true;
            }
            break;
          }
        } else {
          if (lookupSquare) {
            setTileByAxis(axis, mi, ci, lookupSquare);
            clearTile(axis, li, ci);
            somethingMoved = true;
          }
        }
      }
    }
  }

  if (somethingMoved) {
    if (status.value === GameStatus.Started && find2048()) {
      status.value = GameStatus.Won;
      return;
    }

    delay(() => {
      createNewSquare();

      if (!existMergeableSquares()) {
        status.value = GameStatus.Lost;
      }
    }, 150);
  }
};

const removeTile = (tileToRemove: Tile): void => {
  const indexToRemove = tiles.value.findIndex(
    (tile) => tile.id === tileToRemove.id
  );

  if (indexToRemove >= 0) {
    tileToRemove.style.zIndex = -1;
    tiles.value.splice(indexToRemove, 1);
  }
};

const clearTile = (
  axis: Axis,
  mainAxisIndex: number,
  crossAxisIndex: number
): void => {
  switch (axis) {
    case Axis.X:
      model.value[mainAxisIndex][crossAxisIndex] = undefined;
      break;
    case Axis.Y:
      model.value[crossAxisIndex][mainAxisIndex] = undefined;
      break;
    default:
      throw new Error(`Invalid axis value: "${axis}"`);
  }
};

const find2048 = (): boolean => {
  return !!model.value.find(
    (row) => !!row.find((square: OptionalTile) => square?.value === 2048)
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

watch(
  () => status.value,
  (val: GameStatus) => {
    switch (val) {
      case GameStatus.Lost:
        alert('You lost');
        break;
      case GameStatus.Won:
        alert('You won');
        break;
    }
  }
);

defineExpose({
  move,
  restart: () => initModel(props.size),
});
</script>

<template>
  <div
    class="grid"
    v-if="size && model && model.length > 0"
    :style="gridStyles"
  >
    <template v-for="row in size" :key="`grid-row-${row}`">
      <div
        v-for="col in size"
        :key="`grid-cell-${row}-${col}`"
        class="grid-cell"
      />
    </template>

    <template v-for="tile in tiles" :key="tile.id">
      <div class="tile" :class="`tile-${tile.value}`" :style="tile.style">
        <h1>{{ tile.value }}</h1>
      </div>
    </template>
  </div>
  <div class="message">{{ status }}</div>
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
  border: 1px solid var(--color-border);
  justify-content: center;
  align-items: center;
  display: flex;
  background-color: #fff9eb;
}

.message {
  padding-top: 8px;
}
.tile {
  position: absolute;
  transition: transform 100ms;
  width: 75px;
  height: 75px;
  border: 1px solid var(--color-border);
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
