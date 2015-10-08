/// <reference path="./phaser"/>
/// <reference path="./Boot.ts"/>
/// <reference path="./Preloader.ts"/>
/// <reference path="./MainMenu.ts"/>
/// <reference path="./SinglePlayer.ts"/>
/// <reference path="./DifficultyMenu.ts"/>
/// <reference path="./MultiPlayer.ts"/>

module GobangOnline {
  export class Game extends Phaser.Game {

    constructor() {

      super(800, 600, Phaser.AUTO, 'content', null);

      this.state.add('Boot', Boot, false);
      this.state.add('Preloader', Preloader, false);
      this.state.add('MainMenu', MainMenu, false);
      this.state.add('DifficultyMenu', DifficultyMenu, false);
      this.state.add('MultiPlayer', MultiPlayer, false);
      this.state.add('SinglePlayer', SinglePlayer, false);

      this.state.start('Boot');
    }
  }
}

window.onload = () => {
  var game = new GobangOnline.Game();
}
