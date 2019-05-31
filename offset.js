const height = 300;
const width = 300;
let grid = [];
let next = [];
const dA = 1;
const dB = 0.5;
const feed = 0.036;
const kill = 0.060;
const time = 1;

function setup() {
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

  for (var i = 100; i < 110; i++) {
    for (var j = 100; j < 110; j++) {
      grid[i][j].b = 1;
    }
  }

  createCanvas(height, width);
  pixelDensity(1);
}

function setNext() {
  for(let x = 1; x < width - 1; x++) {
    for (let y = 1; y < height - 1; y++) {
      const cell = grid[x][y];
      next[x][y] = {
        a: constrain(
          cell.a + (dA * laplace(x, y, 'a') - cell.a * cell.b * cell.b + feed * (1 - cell.a)) * time,
          0,
          1,
        ),
        b: constrain(
          cell.b + (dB * laplace(x, y, 'b') + cell.a * cell.b * cell.b - (kill + feed) * cell.b) * time,
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

  background(240);

  loadPixels();

  grid.forEach((row, x) => {
    row.forEach((cell, y) => {
      const dilation = 3;
      const pix = (x + y * width) * 4;

      let scale = 100;
      let c = constrain(Math.floor((cell.a - cell.b) * 255), 0, scale) * 255 / scale;

      let [
        r1,
        g1,
        b1,
        a1,
        r2,
        g2,
        b2,
        a2,
      ] = [
        pixels[pix + 0],
        pixels[pix + 1],
        pixels[pix + 2],
        pixels[pix + 3],

        pixels[pix + 4 * dilation],
        pixels[pix + 5 * dilation],
        pixels[pix + 6 * dilation],
        pixels[pix + 7 * dilation],
      ];

      if (!r1 || r1 !== 0) {
        pixels[pix + 4 * dilation] = 255;
      }
      pixels[pix + 4 * dilation] -= c;
      
      if (!g2 || g2 !== 0) {
        pixels[pix + 5 * dilation] = 255;
      }
      pixels[pix + 5 * dilation] -= c;
      
      if (!b2 || b2 !== 0) {
        pixels[pix + 6 * dilation] = 255;
      }
      pixels[pix + 6 * dilation] -= c;





    });
  });
  updatePixels();
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