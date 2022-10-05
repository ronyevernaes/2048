export type OptionalNumber = number | undefined;

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
