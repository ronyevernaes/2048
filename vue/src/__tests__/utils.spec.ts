import { describe, it, expect, vi } from 'vitest';
import {
  randomize,
  getMovementConfig,
  getStart,
  continueLoop,
  changeLoopIndex,
  delay,
  generateId,
} from '../utils';
import { Axis, Command, Direction } from '../types';

describe('randomize', () => {
  it('returns a number between 0 and 1', () => {
    const limit = 2;
    const isInTheRange = (n: number): boolean => n >= 0 && n < limit;

    expect(randomize(limit)).toSatisfy(isInTheRange);
    expect(randomize(limit)).toSatisfy(isInTheRange);
    expect(randomize(limit)).toSatisfy(isInTheRange);
    expect(randomize(limit)).toSatisfy(isInTheRange);
    expect(randomize(limit)).toSatisfy(isInTheRange);
    expect(randomize(limit)).toSatisfy(isInTheRange);
  });
});

describe('generateId', () => {
  it('returns a unique string', () => {
    const now = Date.now();

    vi.useFakeTimers();
    vi.setSystemTime(now);

    expect(generateId()).toBe(now.toString());
    vi.useRealTimers();

  });
});

describe('delay', () => {
  it('executes a callback after certain time', () => {
    const callback = vi.fn(() => {});
    delay(callback, 100);

    const myInterval = setInterval(() => {
      expect(callback).toHaveBeenCalled();
      clearInterval(myInterval);
    }, 150);
  });
});

describe('getMovementConfig', () => {
  it('returns axis Y and direction Start when command is ArrowUp', () => {
    const command = Command.ArrowUp;
    const expected = { axis: Axis.Y, direction: Direction.Start };

    expect(getMovementConfig(command)).toEqual(expected);
  });

  it('returns axis Y and direction End when command is ArrowDown', () => {
    const command = Command.ArrowDown;
    const expected = { axis: Axis.Y, direction: Direction.End };

    expect(getMovementConfig(command)).toEqual(expected);
  });

  it('returns axis X and direction Start when command is ArrowLeft', () => {
    const command = Command.ArrowLeft;
    const expected = { axis: Axis.X, direction: Direction.Start };

    expect(getMovementConfig(command)).toEqual(expected);
  });

  it('returns axis X and direction End when command is ArrowRight', () => {
    const command = Command.ArrowRight;
    const expected = { axis: Axis.X, direction: Direction.End };

    expect(getMovementConfig(command)).toEqual(expected);
  });
});

describe('getStart', () => {
  it('returns 0 when direction is Start', () => {
    const direction = Direction.Start;
    expect(getStart(direction, 10)).toBe(0);
  });

  it('returns N - 1 when direction is End', () => {
    const direction = Direction.End;
    expect(getStart(direction, 10)).toBe(10 - 1);
  });
});

describe('continueLoop', () => {
  it('returns true when index not reached last value for direction Start', () => {
    const direction = Direction.Start;
    expect(continueLoop(direction, 0, 10)).toBe(true);
  });

  it('returns false when index reached last value for direction Start', () => {
    const direction = Direction.Start;
    expect(continueLoop(direction, 10, 10)).toBe(false);
  });

  it('returns true when index not reached last value for direction End', () => {
    const direction = Direction.End;
    expect(continueLoop(direction, 9, 10)).toBe(true);
  });

  it('returns false when index reached last value for direction End', () => {
    const direction = Direction.End;
    expect(continueLoop(direction, 0, 10)).toBe(false);
  });
});

describe('changeLoopIndex', () => {
  it('moves the index towards the direction when direction Start', () => {
    const direction = Direction.Start;
    expect(changeLoopIndex(direction, 0)).toBe(1);
  });

  it('moves the index against the direction when direction Start', () => {
    const direction = Direction.Start;
    expect(changeLoopIndex(direction, 1, true)).toBe(0);
  });

  it('moves the index towards the direction when direction End', () => {
    const direction = Direction.End;
    expect(changeLoopIndex(direction, 1)).toBe(0);
  });

  it('moves the index against the direction when direction End', () => {
    const direction = Direction.End;
    expect(changeLoopIndex(direction, 0, true)).toBe(1);
  });
});
