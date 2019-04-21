const height = 200;
const width = 200;
let grid = [];
let next = [];
const dA = 1;
const dB = 0.5;
// Wave Pool
// const feed = 0.0367;
const feed = 0.008;
// const kill = 0.0649;
const kill = 0.035;

const time = 1;

function setup() {

  createGrid();

  createCanvas(height, width);
  pixelDensity(1);
}

function createGrid() {


  for (let x = 0; x < width; x++) {
    grid[x] = [];
    next[x] = [];
    for (let y = 0; y < height; y++) {
      const a = 1;
      const b = 0;
      grid[x][y] = {
        a: a,
        b: b,
      };
      next[x][y] = {
        a: a,
        b: b,
      };
    }
  }

  for (var i = 100; i < 150; i++) {
    for (var j = 100; j < 150; j++) {
      if(Math.random() > .9) {
        grid[i][j].b = Math.random() / Math.random() * Math.random();
      }
    }
  }
  document.getElementById('kill').innerHTML = kill;
  document.getElementById('feed').innerHTML = feed;
}

function setNext() {
  for(let x = 1; x < width - 1; x++) {
    for (let y = 1; y < height - 1; y++) {
      const cell = grid[x][y];
      next[x][y] = {
        a: constrain(
          cell.a + (dA * laplace(x, y, 'a') - cell.a * cell.b * cell.b + (
          x/width * (.032 - .030) + .030
          // feel
          ) * (1 - cell.a)) * time,
          0,
          1,
        ),
        b: constrain(
          cell.b + (dB * laplace(x, y, 'b') + cell.a * cell.b * cell.b - (
            x/width * (.032 - .030) + .030
            // feed
            +
            y/height * (.056 - .058) + .056
            // kill
          ) * cell.b) * time,
          //cell.b + (dB * laplace(x, y, 'b') + cell.a * cell.b * cell.b - (kill + feed) * cell.b) * time,
          0,
          1,
        ),
      };
    }
  }

  let temp = grid;
  grid = next;
  next = temp;
}

function draw() {
  setNext();

  background(51);

  loadPixels();

  let dead = true;
  grid.forEach((row, x) => {
    row.forEach((cell, y) => {
      if (cell.b > 0 && cell.a > 0 && x !== 0 && x !== width - 1 && y !== 0 && y !== height - 1) { dead = false; }
      const pix = (x + y * width) * 4;

      let xOdd = x % 2;
      let yOdd = y % 2;
      // let scale = constrain(Math.floor(Math.random() * 355), 1, 255);
      let scale = 255;
      let oddScale = 255;
      let c = constrain(Math.floor((cell.a - cell.b) * 255), 0, scale) * 255 / scale;
      //c = Math.floor(c/25) * 25;
      //if (c > 255 / 5) {
      //  c = 255;
      //} else {
      //  c = 0;
     // }

      // const whiteOut = (xOdd && yOdd) || (xOdd && !yOdd) && 255;
      // const whiteOut = ((x + y) % 2) && 255;
      const whiteOut = 100;
      pixels[pix + 0] += 
        constrain(
          c * (c ** 2 / 255) + whiteOut,
          // c + whiteOut,
          200,
          255,
        );
      pixels[pix + 1] +=
        constrain(
          c + (c ** 2 / 25) + whiteOut,
          // c + whiteOut,
          110,
          255,
        );
      pixels[pix + 2] +=
        constrain(
          // c / c ** 2 / c ** 3 / c ** 4 + whiteOut,
          c + whiteOut,
          100,
          255,
        );
      pixels[pix + 3] = 255;
    });
  });
  updatePixels();
  if (dead) {
    createGrid();
  }
}

function laplace(x, y, chem) {
  let sum = 0;
  sum += grid[x][y][chem] * -1;
  sum += grid[x - 1][y][chem] * 0.2
  sum += grid[x + 1][y][chem] * 0.2
  sum += grid[x][y - 1][chem] * 0.2
  sum += grid[x][y + 1][chem] * 0.2
  sum += grid[x + 1][y + 1][chem] * 0.05
  sum += grid[x + 1][y - 1][chem] * 0.05
  sum += grid[x - 1][y + 1][chem] * 0.05
  sum += grid[x - 1][y - 1][chem] * 0.05

  return sum;
}
