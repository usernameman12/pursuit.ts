export let CellType

;(function(CellType) {
  CellType[(CellType["Empty"] = 0)] = "Empty"
  CellType[(CellType["Wall"] = 1)] = "Wall"
  CellType[(CellType["Token"] = 2)] = "Token"
  CellType[(CellType["WormBody"] = 3)] = "WormBody"
})(CellType || (CellType = {}))

export let Direction

;(function(Direction) {
  Direction[(Direction["Up"] = 0)] = "Up"
  Direction[(Direction["Down"] = 1)] = "Down"
  Direction[(Direction["Left"] = 2)] = "Left"
  Direction[(Direction["Right"] = 3)] = "Right"
})(Direction || (Direction = {}))
