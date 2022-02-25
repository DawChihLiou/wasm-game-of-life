import { Universe, Cell } from 'wasm-game-of-life';
import { memory } from 'wasm-game-of-life/wasm_game_of_life_bg';

const CELL_SIZE = 5; // px
const GRID_COLOR = '#3E3E3E';
const DEAD_COLOR = '#121212';
const ALIVE_COLOR = '#FFFFFF';

// Frame per Second Timer for performance statistics
const fps = new (class {
  constructor() {
    this.fps = document.getElementById('fps');
    this.frames = [];
    this.lastFrameTimeStamp = performance.now();
  }

  render() {
    // convert the detail time since the last frame render into a measure
    // of frames per second.
    const now = performance.now();
    const delta = now - this.lastFrameTimeStamp;

    this.lastFrameTimeStamp = now;
    const fps = (1 / delta) * 1000;

    // save only the latest 100 timings
    this.frames.push(fps);

    if (this.frames.length > 100) {
      this.frames.shift();
    }

    // find the max, min, and mean of our 100 latest timings.
    let min = Infinity;
    let max = -Infinity;
    let sum = 0;

    for (let i = 0; i < this.frames.length; i++) {
      sum += this.frames[i];
      min = Math.min(this.frames[i], min);
      max = Math.max(this.frames[i], max);
    }

    let mean = sum / this.frames.length;

    // render the statistics.
    this.fps.textContent = `
Frames per Second: 
         latest = ${Math.round(fps)}
avg of last 100 = ${Math.round(mean)}
min of last 100 = ${Math.round(min)}
max of last 100 = ${Math.round(max)}
`.trim();
  }
})();

// Construct the universe room form all of our cells and a 1px border
const universe = Universe.new();
const width = universe.width();
const height = universe.height();

// Give the canvas room for all of our cells and a 1px border
// around each of them.
const canvas = document.getElementById('game-of-life-canvas');
canvas.height = (CELL_SIZE + 1) * height + 1;
canvas.width = (CELL_SIZE + 1) * width + 1;

const ctx = canvas.getContext('2d');

const drawGrid = () => {
  ctx.beginPath();
  ctx.strokeStyle = GRID_COLOR;

  // vertical lines
  for (let i = 0; i <= width; i++) {
    ctx.moveTo(i * (CELL_SIZE + 1) + 1, 0);
    ctx.lineTo(i * (CELL_SIZE + 1) + 1, (CELL_SIZE + 1) * height + 1);
  }

  // horizontal lines
  for (let i = 0; i <= height; i++) {
    ctx.moveTo(0, i * (CELL_SIZE + 1) + 1);
    ctx.lineTo((CELL_SIZE + 1) * width + 1, i * (CELL_SIZE + 1) + 1);
  }

  ctx.stroke();
};

const getIndex = (row, col) => row * width + col;

const drawCells = () => {
  const cellsPtr = universe.cells();
  const cells = new Uint8Array(memory.buffer, cellsPtr, width * height);

  ctx.beginPath();

  // Alive cells
  ctx.fillStyle = ALIVE_COLOR;

  for (let row = 0; row < height; row++) {
    for (let col = 0; col < width; col++) {
      const idx = getIndex(row, col);

      if (cells[idx] !== Cell.Alive) {
        continue;
      }

      ctx.fillRect(
        col * (CELL_SIZE + 1) + 1,
        row * (CELL_SIZE + 1) + 1,
        CELL_SIZE,
        CELL_SIZE,
      );
    }
  }

  // Dead cells
  ctx.fillStyle = DEAD_COLOR;

  for (let row = 0; row < height; row++) {
    for (let col = 0; col < width; col++) {
      const idx = getIndex(row, col);

      if (cells[idx] !== Cell.Dead) {
        continue;
      }

      ctx.fillRect(
        col * (CELL_SIZE + 1) + 1,
        row * (CELL_SIZE + 1) + 1,
        CELL_SIZE,
        CELL_SIZE,
      );
    }
  }

  ctx.stroke();
};

let animationId = null;

const renderLoop = () => {
  fps.render();

  universe.tick();

  drawGrid();
  drawCells();

  animationId = requestAnimationFrame(renderLoop);
};

const playPauseButton = document.getElementById('play-pause');

const isPaused = () => {
  return animationId === null;
};

const play = () => {
  playPauseButton.textContent = '⏸';
  renderLoop();
};

const pause = () => {
  playPauseButton.textContent = '▶️';
  cancelAnimationFrame(animationId);
  animationId = null;
};

playPauseButton.addEventListener('click', (event) => {
  if (isPaused()) {
    play();
  } else {
    pause();
  }
});

canvas.addEventListener('click', (event) => {
  const boundingRect = canvas.getBoundingClientRect();

  const scaleX = canvas.width / boundingRect.width;
  const scaleY = canvas.height / boundingRect.height;

  const canvasLeft = (event.clientX - boundingRect.left) * scaleX;
  const canvasTop = (event.clientY - boundingRect.top) * scaleY;

  const row = Math.min(Math.floor(canvasTop / (CELL_SIZE + 1)), height - 1);
  const col = Math.min(Math.floor(canvasLeft / (CELL_SIZE + 1)), width - 1);

  universe.toggle_cell(row, col);

  drawGrid();
  drawCells();
});

play();
