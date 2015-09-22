/// <reference path="./phaser"/>
/// <reference path="./pixi.d.ts"/>

module GobangOnline {

  export class MainMenu extends Phaser.State {

    background: Phaser.Sprite;

    create() {
      this.background = this.add.sprite(0, 0, 'menu');
      this.background.alpha = 0;

      this.add.tween(this.background).to({ alpha: 1 }, 2000, Phaser.Easing.Bounce.InOut, true);

    }
  }
}
