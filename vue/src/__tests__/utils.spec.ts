import { describe, it, expect } from 'vitest';
import { randomize } from '../utils';

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
    expect(randomize(limit)).toSatisfy(isInTheRange);
    expect(randomize(limit)).toSatisfy(isInTheRange);
  });
});

describe.skip('generateId', () => {
  it('', () => {});
});

describe.skip('delay', () => {
  it('executes a callback after certain time', () => {});
});

describe.skip('getMovementConfig', () => {
  it('', () => {});
});
