import { Axis, Direction } from '../types';
import type { MovementConfig, OptionalTile, Position, Tile } from '../types';
import {
  changeLoopIndex,
  continueLoop,
  delay,
  generateId,
  getStart,
  getStylePosition,
  randomize,
} from '../utils';

class GridService {
  model: OptionalTile[][];
  tiles: Tile[];
  size: number;

  constructor(model: OptionalTile[][], tiles: Tile[]) {
    this.model = model;
    this.tiles = tiles;
    this.size = model.length;
  }

  createNewTile = (): boolean => {
    this.validateData();
    const nextPosition = this.getNextPosition(this.model);

    if (!nextPosition) {
      return false;
    }

    const [x, y]: [number, number] = nextPosition;
    const value: number = this.getNextValue();

    const newTile: Tile = {
      id: `tile-${generateId()}`,
      value,
      style: getStylePosition(x, y),
    };

    this.tiles.push(newTile);
    this.model[x][y] = newTile;

    return true;
  };

  move = (movement: MovementConfig): Promise<boolean> => {
    this.validateData();
    const { size } = this;
    const { direction, axis } = movement;

    return new Promise((resolve) => {
      let somethingMoved = false;

      // Cross axis pivoting - ci: Cross Axis Index
      for (let ci: number = 0; ci < size; ci++) {
        // Main axis pivoting - mi: Main Axis Index
        const start: number = getStart(direction, size);
        for (
          let mi = start;
          continueLoop(direction, mi, size);
          mi = changeLoopIndex(direction, mi)
        ) {
          const pivotPosition: Position = {
            axis,
            mainIndex: mi,
            crossIndex: ci,
          };

          somethingMoved =
            this.lookupAndMove(direction, pivotPosition) || somethingMoved;
        }
      }

      resolve(somethingMoved);
    });
  };

  private validateData() {
    if (!this.model || !this.tiles) {
      throw new Error('Undefined data');
    }
  }

  private getNextPosition = (
    data: OptionalTile[][]
  ): [number, number] | false => {
    const availablePositions: string[] = this.getAvailablePositions(data);

    const index: number = randomize(availablePositions.length);
    const positionStr: string = availablePositions[index];

    if (!positionStr) {
      return false;
    }

    const coordinates: string[] = positionStr.split(':');
    return [parseInt(coordinates[0]), parseInt(coordinates[1])];
  };

  private getNextValue = (): number => {
    const initialSquareValues: number[] = [1];
    const index: number = randomize(initialSquareValues.length);

    return initialSquareValues[index];
  };

  private getAvailablePositions = (data: OptionalTile[][]): string[] => {
    const availablePositions: string[] = [];

    for (let i = 0; i < data.length; i++) {
      for (let j = 0; j < data[i].length; j++) {
        if (!data[i][j]) {
          availablePositions.push(`${i}:${j}`);
        }
      }
    }

    return availablePositions;
  };

  private getTileByAxis = (position: Position): OptionalTile => {
    const { axis, mainIndex, crossIndex } = position;

    switch (axis) {
      case Axis.X:
        return this.model[mainIndex][crossIndex];
      case Axis.Y:
        return this.model[crossIndex][mainIndex];
      default:
        throw new Error(`Invalid axis value: "${axis}"`);
    }
  };

  private setTileByAxis = (position: Position, tile: Tile): void => {
    const { axis, mainIndex, crossIndex } = position;

    switch (axis) {
      case Axis.X:
        this.model[mainIndex][crossIndex] = tile;
        tile.style = getStylePosition(mainIndex, crossIndex);
        break;
      case Axis.Y:
        this.model[crossIndex][mainIndex] = tile;
        tile.style = getStylePosition(crossIndex, mainIndex);
        break;
      default:
        throw new Error(`Invalid axis value: "${axis}"`);
    }
  };

  private clearTile = (position: Position): void => {
    const { axis, mainIndex, crossIndex } = position;

    switch (axis) {
      case Axis.X:
        this.model[mainIndex][crossIndex] = undefined;
        break;
      case Axis.Y:
        this.model[crossIndex][mainIndex] = undefined;
        break;
      default:
        throw new Error(`Invalid axis value: "${axis}"`);
    }
  };

  // Lookup the square to move through the main axis - li: Lookup Index (assigned to the main axis)
  private lookupAndMove = (
    direction: Direction,
    pivotPosition: Position
  ): boolean => {
    const { size } = this;
    const { axis, mainIndex: mi, crossIndex: ci } = pivotPosition;
    let somethingMoved = false;
    const start: number = changeLoopIndex(direction, mi);

    for (
      let li = start;
      continueLoop(direction, li, size, true);
      li = changeLoopIndex(direction, li)
    ) {
      const lookupPosition = {
        axis,
        mainIndex: li,
        crossIndex: ci,
      };
      const pivotSquare = this.getTileByAxis(pivotPosition);
      const lookupSquare = this.getTileByAxis(lookupPosition);

      if (pivotSquare) {
        if (lookupSquare) {
          somethingMoved =
            this.compareAndMergeTiles(
              lookupPosition,
              pivotPosition,
              lookupSquare,
              pivotSquare
            ) || somethingMoved;
          break;
        }
      } else if (lookupSquare) {
        this.moveTile(lookupPosition, pivotPosition, lookupSquare);
        somethingMoved = true;
      }
    }

    return somethingMoved;
  };

  private compareAndMergeTiles = (
    start: Position,
    end: Position,
    fromTile: Tile,
    toTile: Tile
  ): boolean => {
    if (fromTile.value === toTile.value) {
      this.mergeTiles(start, end, fromTile, toTile);
      return true;
    }
    return false;
  };

  private mergeTiles = (
    start: Position,
    end: Position,
    fromTile: Tile,
    toTile: Tile
  ): void => {
    this.moveTile(start, end, fromTile);
    delay(() => {
      this.removeTile(toTile);
      fromTile.value *= 2;
    }, 50);
  };

  private moveTile = (start: Position, end: Position, tile: Tile): void => {
    this.setTileByAxis(end, tile);
    this.clearTile(start);
  };

  private removeTile = (tileToRemove: Tile): void => {
    const indexToRemove = this.tiles.findIndex(
      (tile) => tile.id === tileToRemove.id
    );

    if (indexToRemove >= 0) {
      tileToRemove.style.zIndex = -1;
      this.tiles.splice(indexToRemove, 1);
    }
  };
}

export default GridService;
