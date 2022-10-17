import type { OptionalTile, Tile } from '@/types';
import { Axis, Direction } from '@/types';
import { describe, expect, it } from 'vitest';
import GridService from '../GridService';

describe('GridService', () => {
  it('creates a random tile', () => {
    const positions: OptionalTile[][] = [
      [undefined, undefined, undefined, undefined],
      [undefined, undefined, undefined, undefined],
      [undefined, undefined, undefined, undefined],
      [undefined, undefined, undefined, undefined],
    ];
    const tiles: Tile[] = [];
    const service = new GridService(positions, tiles);

    service.createNewTile();

    const count = positions.reduce((rowCount, currentRow) => {
      const cells = currentRow.filter(
        (cell: OptionalTile) => cell !== undefined
      );
      return rowCount + (cells ? cells.length : 0);
    }, 0);

    expect(count).toBe(1);
    expect(tiles.length).toBe(1);
  });

  it('moves a tile towards up when the movement is up', async () => {
    const tile = { id: 'id', value: 1, x: 1, y: 1 };
    const positions: OptionalTile[][] = [
      [undefined, undefined, undefined, undefined],
      [undefined, tile, undefined, undefined],
      [undefined, undefined, undefined, undefined],
      [undefined, undefined, undefined, undefined],
    ];
    const tiles: Tile[] = [tile];
    const service = new GridService(positions, tiles);

    await service.move({
      axis: Axis.Y,
      direction: Direction.Start,
    });

    expect(positions[1][0]).toBeTruthy();
    expect(positions[1][1]).toBeFalsy();
  });

  it('moves a tile towards down when the movement is down', async () => {
    const tile = { id: 'id', value: 1, x: 1, y: 1 };
    const positions: OptionalTile[][] = [
      [undefined, undefined, undefined, undefined],
      [undefined, tile, undefined, undefined],
      [undefined, undefined, undefined, undefined],
      [undefined, undefined, undefined, undefined],
    ];
    const tiles: Tile[] = [tile];
    const service = new GridService(positions, tiles);

    await service.move({
      axis: Axis.Y,
      direction: Direction.End,
    });

    expect(positions[1][3]).toBeTruthy();
    expect(positions[1][1]).toBeFalsy();
  });

  it('moves a tile towards left when the movement is left', async () => {
    const tile = { id: 'id', value: 1, x: 1, y: 1 };
    const positions: OptionalTile[][] = [
      [undefined, undefined, undefined, undefined],
      [undefined, tile, undefined, undefined],
      [undefined, undefined, undefined, undefined],
      [undefined, undefined, undefined, undefined],
    ];
    const tiles: Tile[] = [tile];
    const service = new GridService(positions, tiles);

    await service.move({
      axis: Axis.X,
      direction: Direction.Start,
    });

    expect(positions[0][1]).toBeTruthy();
    expect(positions[1][1]).toBeFalsy();
  });

  it('moves a tile towards right when the movement is right', async () => {
    const tile = { id: 'id', value: 1, x: 1, y: 1 };
    const positions: OptionalTile[][] = [
      [undefined, undefined, undefined, undefined],
      [undefined, tile, undefined, undefined],
      [undefined, undefined, undefined, undefined],
      [undefined, undefined, undefined, undefined],
    ];
    const tiles: Tile[] = [tile];
    const service = new GridService(positions, tiles);

    await service.move({
      axis: Axis.X,
      direction: Direction.End,
    });

    expect(positions[3][1]).toBeTruthy();
    expect(positions[1][1]).toBeFalsy();
  });

  it('adds two tiles with the same value when moved in the same direction', async () => {
    const tile1 = { id: 'id', value: 1, x: 1, y: 1 };
    const tile2 = { id: 'id', value: 1, x: 1, y: 1 };
    const positions: OptionalTile[][] = [
      [undefined, undefined, undefined, undefined],
      [undefined, tile1, undefined, tile2],
      [undefined, undefined, undefined, undefined],
      [undefined, undefined, undefined, undefined],
    ];
    const tiles: Tile[] = [tile1, tile2];
    const service = new GridService(positions, tiles);

    await service.move({
      axis: Axis.Y,
      direction: Direction.Start,
    });

    expect(positions[1][0]).toBeTruthy();
    expect(positions[1][1]).toBeFalsy();
    expect(positions[3][1]).toBeFalsy();

    expect(positions[1][0]?.value).toBe(2);
  });

  it('not add two tiles with different values when moved in the same direction', async () => {
    const tile1 = { id: 'id', value: 1, x: 1, y: 1 };
    const tile2 = { id: 'id', value: 2, x: 1, y: 1 };
    const positions: OptionalTile[][] = [
      [undefined, undefined, undefined, undefined],
      [undefined, tile1, undefined, tile2],
      [undefined, undefined, undefined, undefined],
      [undefined, undefined, undefined, undefined],
    ];
    const tiles: Tile[] = [tile1, tile2];
    const service = new GridService(positions, tiles);

    await service.move({
      axis: Axis.Y,
      direction: Direction.Start,
    });

    expect(positions[1][0]).toBeTruthy();
    expect(positions[1][1]).toBeTruthy();
    expect(positions[3][1]).toBeFalsy();

    expect(positions[1][0]?.value).toBe(1);
    expect(positions[1][1]?.value).toBe(2);
  });
});
