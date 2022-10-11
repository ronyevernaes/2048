<script lang="ts">
export default { name: 'GridComponent' };
</script>

<script setup lang="ts">
import { ref, watch } from 'vue';
import type { Ref, CSSProperties } from 'vue';

import type { MovementConfig, OptionalTile, Position, Tile } from '../types';
import { Axis, Command, Direction, GameStatus } from '../types';
import GridService from '../services/GridService';

import {
  delay,
  getMovementConfig,
  getStart,
  isContinueLoop,
  changeLoopIndex,
  getStylePosition,
} from '../utils';

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

const service = new GridService();

const createNewTile = (): boolean => {
  return service.createNewTile(model.value, tiles.value);
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

  createNewTile();
};

initModel(props.size);

watch(
  () => props.size,
  (val: number) => {
    initModel(val);
  }
);

const move = (command: string): Promise<void> => {
  return new Promise((resolve, reject) => {
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
        const pivotPosition: Position = {
          axis,
          mainAxisIndex: mi,
          crossAxisIndex: ci,
        };

        somethingMoved =
          lookupAndMove(direction, pivotPosition) || somethingMoved;
      }
    }

    if (somethingMoved) {
      if (status.value === GameStatus.Started && find2048()) {
        status.value = GameStatus.Won;
        return;
      }

      delay(() => {
        createNewTile();

        if (!existMergeableSquares()) {
          status.value = GameStatus.Lost;
        }
        resolve();
      }, 150);
    } else {
      resolve();
    }
  });
};

// Lookup the square to move through the main axis - li: Lookup Index (assigned to the main axis)
const lookupAndMove = (
  direction: Direction,
  pivotPosition: Position
): boolean => {
  const { axis, mainAxisIndex: mi, crossAxisIndex: ci } = pivotPosition;
  let somethingMoved = false;
  const start: number = changeLoopIndex(direction, mi);

  for (
    let li = start;
    isContinueLoop(direction, li, props.size, true);
    li = changeLoopIndex(direction, li)
  ) {
    const lookupPosition = {
      axis,
      mainAxisIndex: li,
      crossAxisIndex: ci,
    };
    const pivotSquare = service.getTileByAxis(model.value, pivotPosition);
    const lookupSquare = service.getTileByAxis(model.value, lookupPosition);

    if (pivotSquare) {
      if (lookupSquare) {
        somethingMoved =
          compareAndMergeTiles(
            lookupPosition,
            pivotPosition,
            lookupSquare,
            pivotSquare
          ) || somethingMoved;
        break;
      }
    } else if (lookupSquare) {
      moveTile(lookupPosition, pivotPosition, lookupSquare);
      somethingMoved = true;
    }
  }

  return somethingMoved;
};

const compareAndMergeTiles = (
  start: Position,
  end: Position,
  fromTile: Tile,
  toTile: Tile
): boolean => {
  if (fromTile.value === toTile.value) {
    mergeTiles(start, end, fromTile, toTile);
    return true;
  }
  return false;
};

const mergeTiles = (
  start: Position,
  end: Position,
  fromTile: Tile,
  toTile: Tile
): void => {
  moveTile(start, end, fromTile);
  delay(() => {
    removeTile(toTile);
    fromTile.value *= 2;
  }, 50);
};

const moveTile = (start: Position, end: Position, tile: Tile): void => {
  service.setTileByAxis(model.value, end, tile);
  service.clearTile(model.value, start);
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
