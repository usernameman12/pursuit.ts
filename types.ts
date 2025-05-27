export type Position = {
  x: number;
  y: number;
};

export enum CellType {
  Empty,
  Wall,
  Token,
  WormBody,
}

export enum Direction {
  Up,
  Down,
  Left,
  Right,
}
