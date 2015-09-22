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
    if (this.isWinningMove(move, player)) {
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

  isWinningMove(move: Move, player: Player): boolean {
    var directions: number[][] = [[0,1], [1,0], [1,1], [-1,1]];
    for (var i = 0; i < directions.length; i++) {
      var dx = directions[i][0];
      var dy = directions[i][1];
      var run = 1;

      var m = 1;
      while (move.column+dx*m >= 0
        && move.column+dx*m < this.size
        && move.row+dy*m >= 0
        && move.row+dy*m < this.size
        && this.board[move.row+dy*m][move.column+dx*m] == player.color
      ) {
        run++;
        m++;
      }

      var m = -1;
      while (move.column+dx*m >= 0
        && move.column+dx*m < this.size
        && move.row+dy*m >= 0
        && move.row+dy*m < this.size
        && this.board[move.row+dy*m][move.column+dx*m] == player.color
      ) {
        run++;
        m--;
      }

      if (run >= 5) {
        return true;
      }
    }

    return false;
  }
}

interface Move {
    row: number;
    column: number;
}

interface Player {
  color: number;
  setColor(color: number): void;
  takeTurn(context: Gobang, lastMove: Move): void;
  badMove(context: Gobang, badMove: Move): void;
  win(): void;
  lose(): void;
}
