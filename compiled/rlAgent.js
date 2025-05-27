import {
  LEARNING_RATE,
  DISCOUNT_FACTOR,
  EPSILON_DECAY,
  MIN_EPSILON,
  INITIAL_EPSILON
} from "./config"

export class RLAgent {
  qTable = new Map()
  epsilon = INITIAL_EPSILON

  constructor(map, worm, token) {
    this.map = map
    this.worm = worm
    this.token = token
  }

  getState() {
    // Simplified state encoding: relative position of token to worm head
    // and immediate obstacle detection in 4 directions (walls or worm body)

    const head = this.worm.getHead()
    const dx = this.token.position.x - head.x
    const dy = this.token.position.y - head.y

    // Obstacle detection: 1 if obstacle, 0 if free in each direction
    const obstacles = [
      this.isObstacle({ x: head.x, y: head.y - 1 }) ? 1 : 0, // Up
      this.isObstacle({ x: head.x, y: head.y + 1 }) ? 1 : 0, // Down
      this.isObstacle({ x: head.x - 1, y: head.y }) ? 1 : 0, // Left
      this.isObstacle({ x: head.x + 1, y: head.y }) ? 1 : 0 // Right
    ].join("")

    // Quantize relative position into -1 (left/up), 0 (same), 1 (right/down)
    const qdx = dx > 0 ? "1" : dx < 0 ? "-1" : "0"
    const qdy = dy > 0 ? "1" : dy < 0 ? "-1" : "0"

    return `${qdx},${qdy},${obstacles}`
  }

  isObstacle(pos) {
    if (pos.x < 0 || pos.x >= this.map.grid[0].length) return true
    if (pos.y < 0 || pos.y >= this.map.grid.length) return true
    const cell = this.map.getCell(pos)
    if (cell === 2 || cell === 1) return true // worm body or wall
    return false
  }

  chooseAction(state) {
    if (Math.random() < this.epsilon) {
      // Exploration: random direction
      return [0, 1, 2, 3][Math.floor(Math.random() * 4)]
    }

    // Exploitation: pick best action from Q-table
    if (!this.qTable.has(state)) {
      this.qTable.set(state, [0, 0, 0, 0])
    }
    const qValues = this.qTable.get(state)
    const maxQ = Math.max(...qValues)
    const bestActions = qValues
      .map((q, i) => (q === maxQ ? i : -1))
      .filter(i => i !== -1)
    const chosen = bestActions[Math.floor(Math.random() * bestActions.length)]
    return chosen
  }

  updateQ(prevState, action, reward, nextState) {
    if (!this.qTable.has(prevState)) {
      this.qTable.set(prevState, [0, 0, 0, 0])
    }
    if (!this.qTable.has(nextState)) {
      this.qTable.set(nextState, [0, 0, 0, 0])
    }
    const qValues = this.qTable.get(prevState)
    const nextQValues = this.qTable.get(nextState)

    const maxNextQ = Math.max(...nextQValues)
    const oldQ = qValues[action]

    // Q-learning update
    qValues[action] =
      oldQ + LEARNING_RATE * (reward + DISCOUNT_FACTOR * maxNextQ - oldQ)

    // Decay epsilon
    this.epsilon = Math.max(MIN_EPSILON, this.epsilon * EPSILON_DECAY)
  }
}
