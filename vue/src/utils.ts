import { Axis, Command, Direction } from './types';
import type { MovementConfig, OptionalTile, Tile } from './types';

const randomize = (max: number): number => {
  const { floor, random } = Math;
  const result = floor(random() * max);

  return result;
};

const getAvailablePositions = (data: OptionalTile[][]): string[] => {
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

export const delay = (fn: Function, interval: number) => {
  const myInterval = setInterval(() => {
    fn();
    clearInterval(myInterval);
  }, interval);
};

export const getNextPosition = (
  data: OptionalTile[][]
): [number, number] | false => {
  const availablePositions: string[] = getAvailablePositions(data);

  const index: number = randomize(availablePositions.length);
  const positionStr: string = availablePositions[index];

  if (!positionStr) {
    return false;
  }

  const coordinates: string[] = positionStr.split(':');
  return [parseInt(coordinates[0]), parseInt(coordinates[1])];
};

export const getNextValue = (): number => {
  const initialSquareValues: number[] = [1];
  const index: number = randomize(initialSquareValues.length);

  return initialSquareValues[index];
};

export const getMovementConfig = (command: Command): MovementConfig => {
  switch (command) {
    case Command.ArrowUp:
      return {
        axis: Axis.Y,
        direction: Direction.Start,
      };
    case Command.ArrowDown:
      return {
        axis: Axis.Y,
        direction: Direction.End,
      };
    case Command.ArrowLeft:
      return {
        axis: Axis.X,
        direction: Direction.Start,
      };
    case Command.ArrowRight:
      return {
        axis: Axis.X,
        direction: Direction.End,
      };
    default:
      throw new Error('Invalid command');
  }
};

export const getStart = (direction: Direction, size: number): number => {
  switch (direction) {
    case Direction.Start:
      return 0;
    case Direction.End:
      return size - 1;
    default:
      throw new Error(`Invalid movement config direction: ${direction}`);
  }
};

export const isContinueLoop = (
  direction: Direction,
  index: number,
  size: number,
  fullRange: boolean = false
): boolean => {
  switch (direction) {
    case Direction.Start:
      return index < (fullRange ? size : size - 1);
    case Direction.End:
      return fullRange ? index >= 0 : index > 0;
    default:
      throw new Error(`Invalid movement config direction: ${direction}`);
  }
};

// Moves the index in the axis towards the direction (increase or decrease)
export const changeLoopIndex = (
  direction: Direction,
  index: number,
  otherwise: boolean = false
): number => {
  switch (direction) {
    case Direction.Start:
      return !otherwise ? index + 1 : index - 1;
    case Direction.End:
      return !otherwise ? index - 1 : index + 1;
    default:
      throw new Error(`Invalid movement config direction: ${direction}`);
  }
};

export const getStylePosition = (x: number, y: number): CSSProperties => {
  return {
    transform: `translate(${75 * x}px, ${75 * y}px)`,
  };
};
