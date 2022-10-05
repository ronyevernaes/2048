<script lang="ts">
export default { name: 'GridComponent' };
</script>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import type { Ref } from 'vue';

import Square from './Square.vue';
import {
  getNextPosition,
  getNextValue,
  getMovementConfig,
  getStart,
  isContinueLoop,
  changeLoopIndex,
} from '../utils.ts';
import type { MovementConfig, OptionalNumber } from '../types.ts';
import { Axis, Command, Direction, GameStatus } from '../types.ts';

const props = defineProps({
  size: {
    type: Number,
    default: 4,
  },
});

const model: Ref<number[][]> = ref([]);
const status: Ref<GameStatus> = ref(GameStatus.Started);
const gridStyles: CSSProperties = {};

const createNewSquare = (): boolean => {
  const nextPosition = getNextPosition(model.value);

  if (!nextPosition) {
    return false;
  }

  const [x, y]: [number, number] = nextPosition;
  const firstValue: number = getNextValue();
  model.value[x][y] = firstValue;

  return true;
};

const initModel = (size: number): void => {
  model.value = Array();
  for (let i: number = 0; i < size; i++) {
    const row: number[] = Array(size);

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

const getValueByAxis = (
  axis: Axis,
  mainAxisIndex: number,
  crossAxisIndex: number
): number => {
  switch (axis) {
    case Axis.X:
      return model.value[crossAxisIndex][mainAxisIndex];  
    case Axis.Y:
      return model.value[mainAxisIndex][crossAxisIndex];
    default:
      throw new Error(`Invalid axis value: "${axis}"`);
  }
};

const setValueByAxis = (
  axis: Axis,
  mainAxisIndex: number,
  crossAxisIndex: number,
  value: number
): void => {
  switch (axis) {
    case Axis.X:
      model.value[crossAxisIndex][mainAxisIndex] = value;
      break;
    case Axis.Y:
      model.value[mainAxisIndex][crossAxisIndex] = value;
      break;
    default:
      throw new Error(`Invalid axis value: "${axis}"`);
  }
};

const move = (command: string): void => {
  const { direction, axis }: MovementConfig = getMovementConfig(command as Command);
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
        const pivotSquare = getValueByAxis(axis, mi, ci);
        const lookupSquare = getValueByAxis(axis, li, ci);

        if (pivotSquare) {
          if (lookupSquare) {
            if (lookupSquare === pivotSquare) {
              setValueByAxis(axis, mi, ci, lookupSquare * 2);
              setValueByAxis(axis, li, ci, undefined);
              somethingMoved = true;
            }
            break;
          }
        } else {
          if (lookupSquare) {
            setValueByAxis(axis, mi, ci, lookupSquare);
            setValueByAxis(axis, li, ci, undefined);
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

    createNewSquare();

    if (!existMergeableSquares()) {
      status.value = GameStatus.Lost;
    }
  }
};

const find2048 = (): boolean => {
  return !!model.value.find(
    row => row.find(square => square === 2048)
  );
};

// This has to be called when there is no space
const existMergeableSquares = (): boolean => {
  const { size } = props;

  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      // compares [i, j] with [i + 1, j], [i, j + 1], [i - 1, j], [i, j - 1]
      if (!model.value[i][j] ||
        i < (size - 1) && (
          model.value[i][j] === model.value[i + 1][j] ||
          model.value[i][j] === model.value[i][j + 1]
        ) ||
        i > 0 && (
          model.value[i][j] === model.value[i - 1][j] ||
          model.value[i][j] === model.value[i][j - 1]
        )
      ) {
        return true;
      }
    }
  }
  return false;
}

watch(
  () => status.value,
  (val: number) => {
    switch(val) {
      case GameStatus.Lost:
        alert('You lost');
        break;
      case GameStatus.Won:
        alert('You won');
        break;
    }
  }
);

// Restart game
// Transitions

const getValue = (x: number, y: number): number => {
  if (!model.value || model.value.length === 0) {
    return 0;
  }
  if (!model.value[x] || model.value[x].length === 0) {
    return 0;
  }
  if (!model.value[x][y]) {
    return 0;
  }
  return model.value[x][y];
};

defineExpose({
  move,
  restart: () => initModel(props.size),
});
</script>

<template>
  <div class="grid" v-if="size && model && model.length > 0" :style="gridStyles">
    <template v-for="row in size" :key="`grid-row-${row}`">
      <Square
        v-for="col in size"
        :key="`grid-row-${col}`"
        :value="getValue(row - 1, col - 1)"
      />
    </template>
  </div>
  <div class="message">{{ status }}</div>
</template>

<style scoped>
.grid {
  flex: 0 0 auto;
  display: grid;
}
.message {
  padding-top: 8px;
}
</style>
