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
    public blackPlayer:Player;
    public whitePlayer:Player;

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
      this.blackPlayer = this.pendingPlayer;
      this.whitePlayer = this.nonPendingPlayer;
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
      return this.board.isGameOver(checkPlayer.color);
    }
  }
}
