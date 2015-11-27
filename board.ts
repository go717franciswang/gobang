///<reference path="./move.ts" />

module GobangOnline {
  export enum Color { Empty, Black, White };

  export function getOpponentColor(color: Color): Color {
    return color == Color.Black ? Color.White : Color.Black;
  }

  export function buildSquareMatrix(size:number, defaultValue:any) {
    var matrix = [];
    for (var i = 0; i < size; i++) {
      matrix[i] = [];

      for (var j = 0; j < size; j++) {
        matrix[i][j] = defaultValue;
      }
    }

    return matrix;
  }

  export function move2position(move: Move): { x: number; y: number } {
    return {
      x: move.column*(Settings.BOARD_X_END - Settings.BOARD_X_START)/(Settings.BOARD_SIZE-1)+Settings.BOARD_X_START,
      y: move.row*(Settings.BOARD_Y_END - Settings.BOARD_Y_START)/(Settings.BOARD_SIZE-1)+Settings.BOARD_Y_START
    };
  }

  export function position2move(position: { x: number; y: number }): Move {
    return {
      row: Math.round((position.y-Settings.BOARD_Y_START)/((Settings.BOARD_Y_END - Settings.BOARD_Y_START)/(Settings.BOARD_SIZE-1))),
      column: Math.round((position.x-Settings.BOARD_X_START)/((Settings.BOARD_X_END - Settings.BOARD_X_START)/(Settings.BOARD_SIZE-1)))
    };
  }

  export class Board {
    private table: Color[][];
    private moveLog: Move[];

    constructor(public size) {
      this.table = buildSquareMatrix(size, Color.Empty);
      this.moveLog = [];
    }

    printBoard() {
      var rows = [];
      for (var i = 0; i < this.table.length; i++) {
        var row = "";
        for (var j = 0; j < this.table.length; j++) {
          switch (this.table[i][j]) {
            case Color.Empty: row += "."; break;
            case Color.Black: row += "x"; break;
            case Color.White: row += "o"; break;
          }
        }

        rows.push(row);
      }
      return rows;
    }

    getMoveAt(id) {
      return this.moveLog[id];
    }

    getMoveCount() {
      return this.moveLog.length;
    }

    getLastMove() {
      return this.moveLog[this.getMoveCount()-1];
    }

    colorAt(move: Move): Color {
      return this.table[move.row][move.column];
    }

    setColorAt(move: Move, color: Color): void {
      this.table[move.row][move.column] = color;
      this.moveLog.push(move);
    }

    revertLastMove(): void {
      var lastMove = this.moveLog.pop();
      this.table[lastMove.row][lastMove.column] = Color.Empty;
    }

    isMoveValid(move: Move): boolean {
      return !this.isOutOfBound(move) && this.colorAt(move) == Color.Empty;
    }

    isOutOfBound(move: Move): boolean {
      return move.row < 0
        || move.row >= this.size
        || move.column < 0
        || move.column >= this.size;
    }

    hasNeighbor(move: Move): boolean {
      for (var dx = -1; dx <= 1; dx++) {
        for (var dy = -1; dy <= 1; dy++) {
          var neighbor: Move = { row: move.row+dy, column: move.column+dx };
          if (!(dx == 0 && dy == 0) && !this.isOutOfBound(neighbor) && this.colorAt(neighbor) != Color.Empty) {
            return true;
          }
        }
      }

      return false;
    }

    isGameOver(playerColor: Color): boolean {
      var run: number;

      // check rows
      for (var i: number = 0; i < this.size; i++) {
        run = 0;

        for (var j: number = 0; j < this.size; j++) {
          if (this.colorAt({ row: i, column: j }) == playerColor) {
            run++;
          } else {
            run = 0;
          }

          if (run == 5) {
            return true;
          }
        }
      }

      // check columns
      for (var i: number = 0; i < this.size; i++) {
        run = 0;

        for (var j: number = 0; j < this.size; j++) {
          if (this.colorAt({ row: j, column: i }) == playerColor) {
            run++;
          } else {
            run = 0;
          }

          if (run == 5) {
            return true;
          }
        }
      }

      // check right-down diagnals
      for (var i: number = 0; i < (this.size-4)*2-1; i++) {
        run = 0;
        var r: number = Math.max(this.size-5-i, 0);
        var c: number = Math.max(i-(this.size-5), 0);

        while (r < this.size && c < this.size) {
          if (this.colorAt({ row: r, column: c }) == playerColor) {
            run++;
          } else {
            run = 0;
          }

          if (run == 5) {
            return true;
          }
          r++;
          c++;
        }
      }

      // check right-up diagnals
      for (var i: number = 0; i < (this.size-4)*2-1; i++) {
        run = 0;
        var r: number = Math.min(i+4, this.size-1);
        var c: number = Math.max(i-(this.size-5), 0);

        while (r >= 0 && c < this.size) {
          if (this.colorAt({ row: r, column: c }) == playerColor) {
            run++;
          } else {
            run = 0;
          }

          if (run == 5) {
            return true;
          }
          r--;
          c++;
        }
      }

      return false;
    }
  }
}
