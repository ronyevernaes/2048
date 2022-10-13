import { Axis, Direction } from '../types';

import type {
  MovementConfig,
  OptionalTile,
  Position,
  Tile,
  TileGenerationOpts,
} from '../types';

import {
  changeLoopIndex,
  continueLoop,
  delay,
  generateId,
  getStart,
  randomize,
} from '../utils';

class GridService {
  positions: OptionalTile[][];
  tiles: Tile[];
  size: number;
  opts: TileGenerationOpts;

  constructor(
    positions: OptionalTile[][],
    tiles: Tile[],
    opts?: TileGenerationOpts
  ) {
    this.positions = positions;
    this.tiles = tiles;
    this.size = positions.length;
    this.opts = opts ? opts : { firstTile: 2, values: [1] };
  }

  createNewTile = (): boolean => {
    this.validateData();
    const nextPosition = this.getNextPosition(this.positions);

    if (!nextPosition) {
      return false;
    }

    const [x, y]: [number, number] = nextPosition;
    const value: number = this.getNextValue(this.tiles.length === 0);

    const newTile: Tile = {
      id: `tile-${generateId()}`,
      value,
      x,
      y,
    };

    this.tiles.push(newTile);
    this.positions[x][y] = newTile;

    return true;
  };

  move = async (movement: MovementConfig): Promise<boolean> => {
    this.validateData();
    const { size } = this;
    const { direction, axis } = movement;

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
          (await this.lookupAndMove(direction, pivotPosition)) ||
          somethingMoved;
      }
    }

    return somethingMoved;
  };

  private validateData() {
    if (!this.positions || !this.tiles) {
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

  private getNextValue = (isFirstValue: boolean): number => {
    // Here you can add the values which a tile can be initialized
    if (isFirstValue && this.opts.firstTile) {
      return this.opts.firstTile;
    }

    const index: number = randomize(this.opts.values.length);

    return this.opts.values[index];
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
        return this.positions[mainIndex][crossIndex];
      case Axis.Y:
        return this.positions[crossIndex][mainIndex];
      default:
        throw new Error(`Invalid axis value: "${axis}"`);
    }
  };

  private setTileByAxis = (position: Position, tile: Tile): void => {
    const { axis, mainIndex, crossIndex } = position;

    switch (axis) {
      case Axis.X:
        this.positions[mainIndex][crossIndex] = tile;
        tile.x = mainIndex;
        tile.y = crossIndex;
        break;
      case Axis.Y:
        this.positions[crossIndex][mainIndex] = tile;
        tile.x = crossIndex;
        tile.y = mainIndex;
        break;
      default:
        throw new Error(`Invalid axis value: "${axis}"`);
    }
  };

  private clearTile = (position: Position): void => {
    const { axis, mainIndex, crossIndex } = position;

    switch (axis) {
      case Axis.X:
        this.positions[mainIndex][crossIndex] = undefined;
        break;
      case Axis.Y:
        this.positions[crossIndex][mainIndex] = undefined;
        break;
      default:
        throw new Error(`Invalid axis value: "${axis}"`);
    }
  };

  // Lookup the square to move through the main axis - li: Lookup Index (assigned to the main axis)
  private lookupAndMove = async (
    direction: Direction,
    pivotPosition: Position
  ): Promise<boolean> => {
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
            (await this.compareAndMergeTiles(
              lookupPosition,
              pivotPosition,
              lookupSquare,
              pivotSquare
            )) || somethingMoved;
          break;
        }
      } else if (lookupSquare) {
        this.moveTile(lookupPosition, pivotPosition, lookupSquare);
        somethingMoved = true;
      }
    }

    return somethingMoved;
  };

  private compareAndMergeTiles = async (
    start: Position,
    end: Position,
    fromTile: Tile,
    toTile: Tile
  ): Promise<boolean> => {
    if (fromTile.value === toTile.value) {
      await this.mergeTiles(start, end, fromTile, toTile);
      return true;
    }
    return false;
  };

  private mergeTiles = async (
    start: Position,
    end: Position,
    fromTile: Tile,
    toTile: Tile
  ): Promise<void> => {
    this.moveTile(start, end, fromTile);
    await delay(() => {
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
      this.tiles.splice(indexToRemove, 1);
    }
  };
}

export default GridService;
