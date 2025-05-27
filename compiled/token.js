import { CellType } from "./types"

export class Token {
  constructor(map) {
    this.map = map
    this.spawn()
  }

  spawn() {
    const free = this.map.getFreePositions()
    if (free.length === 0) return
    this.position = free[Math.floor(Math.random() * free.length)]
    this.map.setCell(this.position, CellType.Token)
  }

  clear() {
    this.map.setCell(this.position, CellType.Empty)
  }
}
