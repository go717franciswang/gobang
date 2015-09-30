///<reference path="./player.ts" />
///<reference path="./move.ts" />

module GobangOnline {
  export enum Color { Empty, Black, White };

  export class Gobang {
    public board: Color[][];
    private pendingPlayer: Player;
    private nonPendingPlayer: Player;
    private onRegisterMove: any;
    private gameOver: boolean = false;

    constructor(public size: number, public player1: Player, public player2: Player) {
      this.board = [];

      for (var i: number = 0; i < size; i++) {
        this.board[i] = [];

        for (var j: number = 0; j < size; j++) {
          this.board[i][j] = Color.Empty;
        }
      }

      if (Math.floor(Math.random()*2) == 0) {
        this.pendingPlayer = player1;
        this.nonPendingPlayer = player2;
      } else {
        this.nonPendingPlayer = player1;
        this.pendingPlayer = player2;
      }

      this.pendingPlayer.setColor(Color.Black);
      this.nonPendingPlayer.setColor(Color.White);
    }

    startGame() {
      this.pendingPlayer.takeTurn(this, null);
    }

    setOnRegisterMove(callback) {
      this.onRegisterMove = callback;
    }

    registerMove(player: Player, move: Move): void {
      if (this.gameOver || player != this.pendingPlayer) {
        return;
      }

      if (this.board[move.row][move.column] != Color.Empty) {
        player.badMove(this, move);
        return;
      }

      this.board[move.row][move.column] = player.color;
      if (this.isGameOver(player)) {
        this.gameOver = true;
        player.win();
        this.nonPendingPlayer.lose();
      }
      this.swapPlayingPendingState();
      this.pendingPlayer.takeTurn(this, move);

      this.onRegisterMove(player, move);
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

        while (r < this.size && c < this.size) {
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

        while (r >= 0 && c < this.size) {
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

    isMoveValid(move: Move): boolean {
      return !this.isOutOfBound(move) && this.board[move.row][move.column] == Color.Empty;
    }

    isOutOfBound(move: Move): boolean {
      return move.row < 0
        || move.row >= this.size
        || move.column < 0
        || move.column >= this.size;
    }
  }
}
