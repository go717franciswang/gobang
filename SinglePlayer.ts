/// <reference path="./phaser.d.ts"/>
/// <reference path="./pixi.d.ts"/>

module GobangOnline {

  export class SinglePlayer extends Phaser.State {

    board: Phaser.Sprite;

    create() {
      this.board = this.add.sprite(this.game.width/2, this.game.height/2, 'board');
      this.board.anchor.setTo(0.5, 0.5);
      var scale: number = this.game.height / this.board.height;
      this.board.scale.setTo(scale, scale);

    }
  }
}
