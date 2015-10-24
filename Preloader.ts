/// <reference path="./phaser"/>

module GobangOnline {

  export class Preloader extends Phaser.State {

    preloadBar: Phaser.Sprite;

    preload() {

      this.preloadBar = this.add.sprite(200, 250, 'preloadBar');
      this.load.setPreloadSprite(this.preloadBar);

      this.load.image('menu', '/resources/gobang/menu.jpg');
      this.load.image('singlePlayerButton', '/resources/gobang/Play-button.gif');
      this.load.image('button', '/resources/gobang/blue-button-hi.png');
      this.load.image('board', '/resources/gobang/board.png');
      this.load.spritesheet('piece', '/resources/gobang/pieces.png', 100, 100, 2);
      this.load.bitmapFont('Castaway', '/resources/gobang/fonts/Castaway.png', '/resources/gobang/fonts/Castaway.xml');
      this.load.audio('click', 'resources/gobang/click.mp3');
      this.load.audio('beep', 'resources/gobang/beep.mp3');

      // Remove antilias. This line does not work when it's in the create function
      this.stage.smoothed = false;
    }

    create() {
      var tween = this.add.tween(this.preloadBar).to({ alpha: 0 }, 1000, Phaser.Easing.Linear.None, true);
      tween.onComplete.add(this.startMainMenu, this);
    }

    startMainMenu() {
      this.game.state.start('MainMenu', true, false);
    }
  }
  export function addButton(game:Phaser.Game, x:number, y:number, text:string, callback:Function):Phaser.Group {
    var button = game.add.button(x, y, 'button', callback);
    button.anchor.setTo(0.5, 0.5);
    button.scale.setTo(0.5, 0.5);
    var bitmapText = game.add.bitmapText(x, y, 'Castaway', text);
    bitmapText.anchor.setTo(0.5, 1);
    var group = game.add.group();
    group.addChild(button);
    group.addChild(bitmapText);

    return group;
  }
}
