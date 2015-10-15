///<reference path="./move.ts" />

module GobangOnline {
  export enum Color { Empty, Black, White };

  export function getOpponentColor(color: Color): Color {
    return color == Color.Black ? Color.White : Color.Black;
  }

  export class Board {
    private table: Color[][];
    private moveLog: Move[];

    constructor(public size) {
      this.table = [];
      this.moveLog = [];

      for (var i = 0; i < size; i++) {
        this.table[i] = [];

        for (var j = 0; j < size; j++) {
          this.table[i][j] = Color.Empty;
        }
      }
    }

    getMoveCount() {
      return this.moveLog.length;
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
  }
}
