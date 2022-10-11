import { Axis } from '../types';
import type { OptionalTile, Position, Tile } from '../types';

import { generateId, getStylePosition, randomize } from '../utils';

class GridService {
  createNewTile = (model: OptionalTile[][], tiles: Tile[]): boolean => {
    const nextPosition = this.getNextPosition(model);

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

    tiles.push(newTile);
    model[x][y] = newTile;

    return true;
  };

  getTileByAxis = (
    model: OptionalTile[][],
    position: Position
  ): OptionalTile => {
    const { axis, mainAxisIndex, crossAxisIndex } = position;

    switch (axis) {
      case Axis.X:
        return model[mainAxisIndex][crossAxisIndex];
      case Axis.Y:
        return model[crossAxisIndex][mainAxisIndex];
      default:
        throw new Error(`Invalid axis value: "${axis}"`);
    }
  };

  setTileByAxis = (
    model: OptionalTile[][],
    position: Position,
    tile: Tile
  ): void => {
    const { axis, mainAxisIndex, crossAxisIndex } = position;

    switch (axis) {
      case Axis.X:
        model[mainAxisIndex][crossAxisIndex] = tile;
        tile.style = getStylePosition(mainAxisIndex, crossAxisIndex);
        break;
      case Axis.Y:
        model[crossAxisIndex][mainAxisIndex] = tile;
        tile.style = getStylePosition(crossAxisIndex, mainAxisIndex);
        break;
      default:
        throw new Error(`Invalid axis value: "${axis}"`);
    }
  };

  clearTile = (model: OptionalTile[][], position: Position): void => {
    const { axis, mainAxisIndex, crossAxisIndex } = position;

    switch (axis) {
      case Axis.X:
        model[mainAxisIndex][crossAxisIndex] = undefined;
        break;
      case Axis.Y:
        model[crossAxisIndex][mainAxisIndex] = undefined;
        break;
      default:
        throw new Error(`Invalid axis value: "${axis}"`);
    }
  };

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
}

export default GridService;
