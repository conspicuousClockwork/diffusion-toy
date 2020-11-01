const height = 200;
const width = 200;
let grid = [];
let next = [];
const dA = 1;
const dB = 0.5;
const feed = 0.008;
const kill = 0.035;

const time = 1;

// set up grid structures and P5
function setup() {
  createGrid();

  // P5 setup
  createCanvas(height, width);
  pixelDensity(1);
}

// create structures to hold buffer of data
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

  // Randomly seed cells
  for (var i = 100; i < 150; i++) {
    for (var j = 100; j < 150; j++) {
      if(Math.random() > .9) {
        grid[i][j].b = Math.random() / Math.random() * Math.random();
      }
    }
  }

  // Print out values
  document.getElementById('kill').innerHTML = kill;
  document.getElementById('feed').innerHTML = feed;
}

// Update the simulation to the next generation
function setNext() {

  // Iterate over every single cell and calculate its' next value
  for(let x = 1; x < width - 1; x++) {
    for (let y = 1; y < height - 1; y++) {
      const cell = grid[x][y];
      next[x][y] = {
        a: constrain(
          cell.a + (dA * laplace(x, y, 'a') - cell.a * cell.b * cell.b + (
          // Change feed over the x axis
          x/width * (.032 - .030) + .030
          ) * (1 - cell.a)) * time,
          0,
          1,
        ),
        b: constrain(
          cell.b + (dB * laplace(x, y, 'b') + cell.a * cell.b * cell.b - (
            // Change feed over the x axis
            x/width * (.032 - .030) + .030
            +
            /// Change kill over the y axis
            y/height * (.056 - .058) + .056
          ) * cell.b) * time,
          0,
          1,
        ),
      };
    }
  }

  // Swap the new and old so we don't have to recreate objects every frame
  let temp = grid;
  grid = next;
  next = temp;
}

function draw() {
  // Update the generation
  setNext();

  // P5 setup
  background(51);
  loadPixels();

  // draw every cell for a given generation
  grid.forEach((row, x) => {
    row.forEach((cell, y) => {
      // Calculating the location of this cell in P5's pixel array
      // P5.js represents pixels in a 1-dimensional array instead of a 2-dimensional one
      const pix = (x + y * width) * 4;

      let scale = 255;
      let c = constrain(Math.floor((cell.a - cell.b) * 255), 0, scale) * 255 / scale;

      // Control how light everything is
      const whiteOut = 100;

      //Update the RGB and Alpha values for every pixel
      pixels[pix + 0] += 
        constrain(
          c * (c ** 2 / 255) + whiteOut,
          200,
          255,
        );
      pixels[pix + 1] +=
        constrain(
          c + (c ** 2 / 25) + whiteOut,
          110,
          255,
        );
      pixels[pix + 2] +=
        constrain(
          c + whiteOut,
          100,
          255,
        );
      pixels[pix + 3] = 255;
    });
  });

  // Write to canvas
  updatePixels();
}

// Laplace function to keep code cleaner
// Take a sum of weighted values surrounding a given cell
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
