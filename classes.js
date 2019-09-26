class Grid {
  constructor(
    width,
    height,
  ) {
    this._width = width;
    this._height = height;
    this._cells = [];
  }

  get width() { return this._width; }
  get height() { return this._height; }
  get cells() { return this._cells; }

  setup = new Promise((resolve, reject) => { try {
    for (let y = 0; y < this._height; y++) {
      for (let x = 0; x < this._width; x++) {
        this._cells.push(new Cell(x, y, 0, 0))
      }
    }
    this._cells.map((cell) => cell.setRefs());   
  resolve(); } catch(error) { reject(error); }});

  cell(x, y) {
    return this._cells[(this._width * y) + x];
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
    this._x = x;
    this._y = y;
    this.kill = kill;
    this.feed = feed;
    this._grid = grid;
    this._time = time;
  }

  calc = new Promise((resolve, reject) => {
    try {
      this._nextA = constrain(
        this._currentA
          + (dA * this.laplace('a')
          - this._currentA * this._currentB * this._currentB
          + this.feed * (1 - this._currentA)) * time,
        0,
        1,
      );

      this._nextB = constrain(
        this._currentB
          + (dB * this.laplace('b')
          + this._currentA * this._currentB * this._currentB
          - (this.feed + this.kill) * this._currentB) * time,
        0,
        1,
      );
      resolve();
    } catch (error) { reject(error); }
  });

  update = new Promise((resolve, reject) => {
    this._currentA = this._nextA;
    this._currentB = this._nextB;

  });

  setRefs() {
    this._cardinal = [
      this.grid.cell(this.x, this.y + 1),
      this.grid.cell(this.x, this.y - 1),
      this.grid.cell(this.x + 1, this.y),
      this.grid.cell(this.x - 1, this.y),
    ];

    this._diagonal = [
      this.grid.cell(this.x + 1, this.y + 1),
      this.grid.cell(this.x - 1, this.y + 1),
      this.grid.cell(this.x - 1, this.y - 1),
      this.grid.cell(this.x + 1, this.y - 1),
    ];
  }

  laplace(chemical) {
    return this[chemical] * -1
    + this._cardinal.reduce((sum, cell) => sum += cell[chemical] * 0.2, 0)
    + this._diagonal.reduce((sum, cell) => sum += cell[chemical] * 0.05, 0);
  }

  get a() { return this._currentA; }
  get b() { return this._currentB; }

  get x() { return this._x; }
  get y() { return this._y; }
}