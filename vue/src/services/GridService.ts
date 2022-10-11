import type { OptionalTile, Tile } from '../types';

import {
  generateId,
  getNextPosition,
  getNextValue,
  getStylePosition,
} from '../utils';

class GridService {
  createNewSquare = (model: OptionalTile[][], tiles: Tile[]): boolean => {
    const nextPosition = getNextPosition(model);

    if (!nextPosition) {
      return false;
    }

    const [x, y]: [number, number] = nextPosition;
    const value: number = getNextValue();

    const newTile: Tile = {
      id: `tile-${generateId()}`,
      value,
      style: getStylePosition(x, y),
    };

    tiles.push(newTile);
    model[x][y] = newTile;

    return true;
  };
}

export default GridService;
