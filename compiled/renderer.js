import { CELL_SIZE, GRID_SIZE } from "./config"
import { CellType } from "./types"

export class Renderer {
  constructor(canvas) {
    this.canvas = canvas
    this.ctx = canvas.getContext("2d")
  }

  draw(map, worm, token) {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

    // Draw grid
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        switch (map.grid[y][x]) {
          case CellType.Empty:
            this.ctx.fillStyle = "#222"
            break
          case CellType.Wall:
            this.ctx.fillStyle = "#555"
            break
          case CellType.Token:
            this.ctx.fillStyle = "#0f0"
            break
          case CellType.WormBody:
            this.ctx.fillStyle = "#0af"
            break
        }
        this.ctx.fillRect(
          x * CELL_SIZE,
          y * CELL_SIZE,
          CELL_SIZE - 1,
          CELL_SIZE - 1
        )
      }
    }
  }
}
