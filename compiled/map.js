import { CellType } from "./types"
import { GRID_SIZE, WALL_RATIO } from "./config"

export class MapGrid {
  constructor() {
    this.grid = []
    for (let y = 0; y < GRID_SIZE; y++) {
      this.grid[y] = []
      for (let x = 0; x < GRID_SIZE; x++) {
        this.grid[y][x] =
          Math.random() < WALL_RATIO ? CellType.Wall : CellType.Empty
      }
    }

    // Ensreue borders are walls
    for (let i = 0; i < GRID_SIZE; i++) {
      this.grid[0][i] = CellType.Wall
      this.grid[GRID_SIZE - 1][i] = CellType.Wall
      this.grid[i][0] = CellType.Wall
      this.grid[i][GRID_SIZE - 1] = CellType.Wall
    }
  }

  isFree(pos) {
    if (pos.x < 0 || pos.x >= GRID_SIZE || pos.y < 0 || pos.y >= GRID_SIZE)
      return false
    return this.grid[pos.y][pos.x] === CellType.Empty
  }

  setCell(pos, type) {
    this.grid[pos.y][pos.x] = type
  }

  getCell(pos) {
    return this.grid[pos.y][pos.x]
  }

  getFreePositions() {
    let free = []
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        if (this.grid[y][x] === CellType.Empty) {
          free.push({ x, y })
        }
      }
    }
    return free
  }
}
