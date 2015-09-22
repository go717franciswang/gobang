/// <reference path="./phaser"/>

module GobangOnline {

  export class Boot extends Phaser.State {

    preload() {
      this.load.image('preloadBar', 'assets/loader.png');
    }

    create() {
      this.game.state.start('Preloader', true, false);
    }
  }
}
