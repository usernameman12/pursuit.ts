import { Position, CellType, Direction } from "./types";
import { MapGrid } from "./map";

export class Worm {
  body: Position[];
  direction: Direction;
  map: MapGrid;

  constructor(map: MapGrid) {
    this.map = map;
    this.reset();
  }

  reset() {
    // Find free spot for head
    const free = this.map.getFreePositions();
    if (free.length === 0) throw new Error("No free space for worm!");
    this.body = [free[Math.floor(Math.random() * free.length)]];
    this.direction = Direction.Right;

    // Mark worm on map
    this.body.forEach(pos => this.map.setCell(pos, CellType.WormBody));
  }

  getHead(): Position {
    return this.body[0];
  }

  nextHeadPosition(dir: Direction = this.direction): Position {
    const head = this.getHead();
    switch (dir) {
      case Direction.Up: return { x: head.x, y: head.y - 1 };
      case Direction.Down: return { x: head.x, y: head.y + 1 };
      case Direction.Left: return { x: head.x - 1, y: head.y };
      case Direction.Right: return { x: head.x + 1, y: head.y };
    }
  }

  move(dir: Direction = this.direction): boolean {
    const next = this.nextHeadPosition(dir);

    // Check collisions
    if (!this.map.isFree(next) && this.map.getCell(next) !== CellType.Token) {
      // Hits wall or itself
      return false;
    }

    // Move worm
    this.direction = dir;

    const tail = this.body.pop();
    if (tail) this.map.setCell(tail, CellType.Empty);

    this.body.unshift(next);

    this.map.setCell(next, CellType.WormBody);

    return true;
  }

  grow() {
    const tail = this.body[this.body.length - 1];
    this.body.push(tail);
  }

  occupies(pos: Position): boolean {
    return this.body.some(segment => segment.x === pos.x && segment.y === pos.y);
  }
}
