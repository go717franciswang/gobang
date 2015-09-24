module GobangOnline {

  export class Preloader extends Phaser.State {

    preloadBar: Phaser.Sprite;

    preload() {

      this.preloadBar = this.add.sprite(200, 250, 'preloadBar');
      this.load.setPreloadSprite(this.preloadBar);

      this.load.image('menu', 'assets/menu.jpg');
      this.load.image('singlePlayerButton', 'assets/Play-button.gif');
      this.load.image('board', 'assets/board.jpg');
      this.load.spritesheet('piece', 'assets/pieces.png', 289, 289, 2);
    }

    create() {
      var tween = this.add.tween(this.preloadBar).to({ alpha: 0 }, 1000, Phaser.Easing.Linear.None, true);
      tween.onComplete.add(this.startMainMenu, this);
    }

    startMainMenu() {
      this.game.state.start('MainMenu', true, false);
    }
  }
}
