import { MapGrid } from "./map";
import { Worm } from "./worm";
import { Token } from "./token";
import { RLAgent } from "./rlAgent";
import { Renderer } from "./renderer";
import { Direction } from "./types";

const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
const map = new MapGrid();
const worm = new Worm(map);
const token = new Token(map);
const agent = new RLAgent(map, worm, token);
const renderer = new Renderer(canvas);

let episode = 0;
let stepCount = 0;
let maxStepsPerEpisode = 200;

let prevState = agent.getState();
let prevAction: Direction = Direction.Right;

function resetEpisode() {
  // Clear map from worm and token
  worm.body.forEach(pos => map.setCell(pos, 0));
  token.clear();

  worm.reset();
  token.spawn();

  stepCount = 0;
  prevState = agent.getState();
  prevAction = Direction.Right;
  episode++;
}

function step() {
  stepCount++;
  const state = agent.getState();
  const action = agent.chooseAction(state);

  const nextPos = worm.nextHeadPosition(action);

  let reward = -0.1; // small penalty for each step to encourage faster token getting

  // Check collision with wall or worm
  const cell = map.getCell(nextPos);
  if (cell === 1 || cell === 3) { // Wall or WormBody
    reward = -1;
    agent.updateQ(prevState, prevAction, reward, state);
    resetEpisode();
    return;
  }

  // Check if token found
  const gotToken = cell === 2;
  if (gotToken) {
    reward = 1; //reward
  }

  const moved = worm.move(action);
  if (!moved) {
    reward = -1;
    agent.updateQ(prevState, prevAction, reward, state);
    resetEpisode();
    return;
  }

  if (gotToken) {
    worm.grow();
    token.clear();
    token.spawn();
  }

  const nextState = agent.getState();

  agent.updateQ(prevState, prevAction, reward, nextState);

  prevState = nextState;
  prevAction = action;

  if (stepCount >= maxStepsPerEpisode) {
    resetEpisode();
  }

  renderer.draw(map, worm, token);
}

function gameLoop() {
  step();
  requestAnimationFrame(gameLoop);
}

resetEpisode();
gameLoop();
