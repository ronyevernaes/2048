export interface Tile {
  id: string;
  value: number;
  x: number;
  y: number;
}

export type OptionalTile = Tile | undefined;

export enum Command {
  ArrowUp = 'ArrowUp',
  ArrowDown = 'ArrowDown',
  ArrowLeft = 'ArrowLeft',
  ArrowRight = 'ArrowRight',
}

export enum Axis {
  X = 'X',
  Y = 'Y',
}

export enum Direction {
  Start = 'Start',
  End = 'End',
}

export interface MovementConfig {
  axis: Axis;
  direction: Direction;
}

export enum GameStatus {
  Started = 'Started',
  Won = 'Won',
  Lost = 'Lost',
}

export interface Position {
  axis: Axis;
  mainIndex: number;
  crossIndex: number;
}

export interface TileGenerationOpts {
  firstTile?: number;
  values: number[];
}
