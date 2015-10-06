/// <reference path="./phaser.d.ts"/>
/// <reference path="./pixi.d.ts"/>
/// <reference path="./Preloader.ts"/>

module GobangOnline {

  export class DifficultyMenu extends Phaser.State {

    background: Phaser.Sprite;

    create() {
      this.background = this.add.sprite(0, 0, 'menu');
      this.background.alpha = 0;
      this.background.scale.x = this.game.width / this.background.width;
      this.background.scale.y = this.game.height / this.background.height;

      this.add.tween(this.background).to({ alpha: 1.0 }, 2000, Phaser.Easing.Bounce.InOut, true);

      addButton(this.game, this.game.width/2, this.game.height/2-150, 'EASY', () => {
        this.game.state.start('SinglePlayer');
      });

      addButton(this.game, this.game.width/2, this.game.height/2, 'MEDIUM', () => {
        this.game.state.start('SinglePlayer');
      });

      addButton(this.game, this.game.width/2, this.game.height/2+150, 'HARD', () => {
        this.game.state.start('SinglePlayer');
      });
    }
  }
}
