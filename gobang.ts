///<reference path="./player.ts" />
///<reference path="./move.ts" />
///<reference path="./board.ts" />

module GobangOnline {

  export class Gobang {
    public board: Board;
    public pendingPlayer: Player;
    private nonPendingPlayer: Player;
    private onRegisterMove:Function;
    public onGameOver:Function;
    private gameOver: boolean = false;

    constructor(public size: number, public player1: Player, public player2: Player) {
      this.board = new Board(size);

      if (Math.floor(Math.random()*2) == 0) {
        console.log('player 1\'s turn');
        this.pendingPlayer = player1;
        this.nonPendingPlayer = player2;
      } else {
        console.log('player 2\'s turn');
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

      if (this.board.colorAt(move) != Color.Empty) {
        player.badMove(this, move);
        return;
      }

      this.board.setColorAt(move, player.color);
      if (this.isGameOver(player)) {
        this.gameOver = true;
        player.win();
        this.nonPendingPlayer.lose();

        if (this.onGameOver) {
          this.onGameOver();
        }
        return;
      }

      this.swapPlayingPendingState();
      this.pendingPlayer.takeTurn(this, move);

      if (this.onRegisterMove) {
        this.onRegisterMove(player, move);
      }
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
          if (this.board.colorAt({ row: i, column: j }) == checkPlayer.color) {
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
          if (this.board.colorAt({ row: j, column: i }) == checkPlayer.color) {
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
          if (this.board.colorAt({ row: r, column: c }) == checkPlayer.color) {
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
          if (this.board.colorAt({ row: r, column: c }) == checkPlayer.color) {
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
