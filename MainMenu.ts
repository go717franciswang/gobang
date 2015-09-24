/// <reference path="./phaser.d.ts"/>
/// <reference path="./pixi.d.ts"/>

module GobangOnline {

  export class MainMenu extends Phaser.State {

    background: Phaser.Sprite;
    singlePlayerButton: Phaser.Sprite;

    create() {
      this.background = this.add.sprite(0, 0, 'menu');
      this.background.alpha = 0;
      this.background.scale.x = this.game.width / this.background.width;
      this.background.scale.y = this.game.height / this.background.height;

      this.add.tween(this.background).to({ alpha: 1.0 }, 2000, Phaser.Easing.Bounce.InOut, true);

      this.singlePlayerButton = this.add.sprite(this.game.width/2, this.game.height/2, 'singlePlayerButton');
      this.singlePlayerButton.anchor.setTo(0.5, 0.5);
      this.singlePlayerButton.inputEnabled = true;
      this.singlePlayerButton.events.onInputDown.add(() => {
        this.game.state.start('SinglePlayer');
      }, this);
    }
  }
}
