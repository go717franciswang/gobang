/// <reference path="./phaser.d.ts"/>
/// <reference path="./pixi.d.ts"/>
/// <reference path="./move.ts"/>
/// <reference path="./position.ts"/>

module GobangOnline {

  export class SinglePlayer extends Phaser.State {

    board: Phaser.Sprite;

    create() {
      this.board = this.add.sprite(this.game.width/2, this.game.height/2, 'board');
      this.board.anchor.setTo(0.5, 0.5);
      var scale: number = this.game.height / this.board.height;
      this.board.scale.setTo(scale, scale);
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
      if (this.game.input.activePointer.isDown) {
        var move = this.position2move(this.game.input.activePointer);
        if (this.isMoveValid(move)) {
          var pos = this.move2position(move);
          var piece = this.add.sprite(pos.x, pos.y, 'piece');
          piece.anchor.setTo(0.5, 0.5);
          piece.scale.setTo(0.12);
        }
      }
    }

    isMoveValid(move: Move): boolean {
      return move.row >= 0 && move.row < 16 && move.column >= 0 && move.column < 16;
    }
  }
}
