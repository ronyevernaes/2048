import { Axis, Command, Direction } from './types';
import type { MovementConfig } from './types';

export const randomize = (max: number): number => {
  const { floor, random } = Math;
  const result = floor(random() * max);

  return result;
};

export const generateId = (): string => {
  return Date.now().toString();
};

export const delay = (fn: Function, interval: number): Promise<void> => {
  return new Promise((resolve) => {
    const myInterval = setInterval(() => {
      fn();
      clearInterval(myInterval);
      resolve();
    }, interval);
  });
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

export const continueLoop = (
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
