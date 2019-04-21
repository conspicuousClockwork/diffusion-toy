class Grid {
  constructor(
    width,
    height,
  ) {
    this._width = width;
    this._height = height;
    this._cells = [];
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        this._cells.push(new Cell(x, y, 0, 0))
      }
    }
  }

  get width() { return this._width; }
  get height() { return this._height; }

  cell(x, y) {
    return this._cells[0];
  }

}

class Cell {
  _currentA;
  _currentB;
  _nextA;
  _nextB;
  constructor(
    x,
    y,
    a,
    b,
    kill,
    feed,
    grid,
    time = 1,
  ) {
    this._currentA = a;
    this._currentB = b;
    this.x = x;
    this.y = y;
    this.kill = kill;
    this.feed = feed;
    this.GRID = grid;
    this.time = time;
  }

  calc = new Promise((resolve, reject) => {
    try {
      let cardinal = [
        this.GRID.cell(this.x, this.y + 1),
        this.GRID.cell(this.x, this.y - 1),
        this.GRID.cell(this.x + 1, this.y),
        this.GRID.cell(this.x - 1, this.y),
      ];

      let diagonal = [
        this.GRID.cell(this.x + 1, this.y + 1),
        this.GRID.cell(this.x - 1, this.y + 1),
        this.GRID.cell(this.x - 1, this.y - 1),
        this.GRID.cell(this.x + 1, this.y - 1),
      ];

      this._nextA = constrain(
        cell.a
          + (dA * this.laplace(this, cardinal, diagonal, 'a')
          - cell.a * cell.b * cell.b
          + this.feed * (1 - cell.a)) * time,
        0,
        1,
      );

      this._nextB = constrain(
        cell.b
          + (dB * this.laplace(this, cardinal, diagonal, 'b')
          + cell.a * cell.b * cell.b
          - (this.feed + this.kill) * cell.b) * time,
        0,
        1,
      );
      resolve();
    } catch (error) { reject(error); }
  });

  switch = new Promise((resolve, reject) => {
    
  });

  laplace(cell, cardinal, diagonal, chemical) {
    return cell[chemical] * -1
    + cardinal.reduce((sum, cell) => sum += cell[chemical] * 0.2, 0)
    + diagonal.reduce((sum, cell) => sum += cell[chemical] * 0.05, 0);
  }

  get a() { return this._currentA; }
  get b() { return this._currentB; }

  set x() { return this.x; }
  set y() { return this.y; }
}