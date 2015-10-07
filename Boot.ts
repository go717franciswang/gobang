/// <reference path="./phaser"/>

module GobangOnline {

  export class Boot extends Phaser.State {

    preload() {
      this.load.image('preloadBar', '/resources/gobang/loader.png');
    }

    create() {
      this.scale.scaleMode = Phaser.ScaleManager.NO_SCALE;
      this.scale.refresh();
      this.game.state.start('Preloader', true, false);
    }
  }
}
