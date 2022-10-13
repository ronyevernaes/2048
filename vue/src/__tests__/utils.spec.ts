import { describe, it, expect } from 'vitest';
import { randomize, getMovementConfig } from '../utils';
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

describe.skip('generateId', () => {
  it('returns a unique string', () => {});
});

describe.skip('delay', () => {
  it('executes a callback after certain time', () => {});
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

  describe.skip('getStart', () => {
    it('returns 0 when direction is Start', () => {});
    it('returns N - 1 when direction is End', () => {});
  });

  describe.skip('continueLoop', () => {
    it('returns true when index not reached last value for direction Start', () => {});
    it('returns false when index reached last value for direction Start', () => {});
    it('returns true when index not reached last value for direction End', () => {});
    it('returns false when index reached last value for direction End', () => {});
  });

  describe.skip('changeLoopIndex', () => {
    it('moves the index towards the direction when direction Start', () => {});
    it('moves the index against the direction when direction Start', () => {});
    it('moves the index towards the direction when direction End', () => {});
    it('moves the index against the direction when direction End', () => {});
  });
});
