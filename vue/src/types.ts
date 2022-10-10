import type { CSSProperties } from 'vue';
export interface Tile {
  id: string;
  value: number;
  style: CSSProperties;
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
