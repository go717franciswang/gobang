/// <reference path="./phaser.d.ts"/>
/// <reference path="./pixi.d.ts"/>
/// <reference path="./move.ts"/>
/// <reference path="./gobang.ts"/>
/// <reference path="./humanPlayer.ts"/>
/// <reference path="./aiPlayer.ts"/>

module GobangOnline {

  export class SinglePlayer extends Phaser.State {

    board: Phaser.Sprite;
    humanPlayer: HumanPlayer;
    aiPlayer: AiPlayer;
    engine: Gobang;

    create() {
      this.board = this.add.sprite(this.game.width/2, this.game.height/2, 'board');
      this.board.anchor.setTo(0.5, 0.5);
      var scale: number = this.game.height / this.board.height;
      this.board.scale.setTo(scale, scale);
      this.humanPlayer = new HumanPlayer();
      this.humanPlayer.onWinCallback = () => {
        var msg = this.game.add.bitmapText(this.game.width/2, this.game.height/2, 'Castaway', 'YOU WON!');
        msg.anchor.setTo(0.5, 0.5);
      };
      this.humanPlayer.onLossCallback = () => {
        var msg = this.game.add.bitmapText(this.game.width/2, this.game.height/2, 'Castaway', 'YOU LOST!');
        msg.anchor.setTo(0.5, 0.5);
      };

      this.aiPlayer = new AiPlayer(2, 100);
      this.engine = new Gobang(16, this.humanPlayer, this.aiPlayer);
      this.engine.setOnRegisterMove((player, move) => {
        var pos = this.move2position(move);
        var piece = this.add.sprite(pos.x, pos.y, 'piece');
        if (player.color == Color.White) {
          piece.frame = 1;
        }

        piece.anchor.setTo(0.5, 0.5);
        piece.scale.setTo(0.12);
      });
      this.engine.startGame();
    }

    move2position(move: Move): { x: number; y: number } {
      return {
        x: move.column*525/15+135,
        y: move.row*525/15+35
      };
    }

    position2move(position: { x: number; y: number }): Move {
      return {
        row: Math.round((position.y-35)/(525/15)),
        column: Math.round((position.x-135)/(525/15))
      };
    }

    update() {
      if (this.humanPlayer.takingTurn) {
        if (this.game.input.activePointer.isDown) {
          var move = this.position2move(this.game.input.activePointer);
          if (this.engine.board.isMoveValid(move)) {
            this.humanPlayer.makeMove(move);
          }
        }
      }
    }
  }
}
