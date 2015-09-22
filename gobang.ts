///<reference path="./player.ts" />
///<reference path="./move.ts" />

var EMPTY: number = 0;
var BLACK: number = 1;
var WHITE: number = 2;

class Gobang {
  private board: number[][];
  private pendingPlayer: Player;
  private nonPendingPlayer: Player;

  constructor(public size: number, public player1: Player, public player2: Player) {
    this.board = [];

    for (var i: number = 0; i < size; i++) {
      this.board[i] = [];

      for (var j: number = 0; j < size; j++) {
        this.board[i][j] = EMPTY;
      }
    }

    if (Math.floor(Math.random()*2) == 0) {
      this.pendingPlayer = player1;
      this.nonPendingPlayer = player2;
    } else {
      this.nonPendingPlayer = player1;
      this.pendingPlayer = player2;
    }

    this.pendingPlayer.setColor(BLACK);
    this.nonPendingPlayer.setColor(WHITE);
    this.pendingPlayer.takeTurn(this, null);
  }

  registerMove(player: Player, move: Move): void {
    if (player != this.pendingPlayer) {
      return;
    }

    if (this.board[move.row][move.column] != EMPTY) {
      player.badMove(this, move);
      return;
    }

    this.board[move.row][move.column] = player.color;
    if (this.isGameOver(player)) {
      player.win();
      this.nonPendingPlayer.lose();
    }
    this.swapPlayingPendingState();
    this.pendingPlayer.takeTurn(this, move);
  }

  swapPlayingPendingState(): void {
    var tmp: Player = this.pendingPlayer;
    this.pendingPlayer = this.nonPendingPlayer;
    this.nonPendingPlayer = tmp;
  }

  isGameOver(checkPlayer: Player): boolean {
    var run: number;

    // check rows
    for (var i: number = 0; i < this.size; i++) {
      run = 0;

      for (var j: number = 0; j < this.size; j++) {
        if (this.board[i][j] == checkPlayer.color) {
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
        if (this.board[j][i] == checkPlayer.color) {
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

      while (r < this.size || c < this.size) {
        if (this.board[r][c] == checkPlayer.color) {
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

      while (r >= 0 || c < this.size) {
        if (this.board[r][c] == checkPlayer.color) {
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
