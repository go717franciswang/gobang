/// <reference path="./phaser"/>

module GobangOnline {

  export class Preloader extends Phaser.State {

    preloadBar: Phaser.Sprite;

    preload() {

      this.preloadBar = this.add.sprite(200, 250, 'preloadBar');
      this.load.setPreloadSprite(this.preloadBar);

      this.load.image('menu', 'assets/menu.jpg');
      this.load.image('singlePlayerButton', 'assets/Play-button.gif');
      this.load.image('button', 'assets/blue-button-hi.png');
      this.load.image('board', 'assets/board.jpg');
      this.load.spritesheet('piece', 'assets/pieces.png', 289, 289, 2);
      this.load.bitmapFont('Castaway', 'assets/fonts/Castaway.png', 'assets/fonts/Castaway.xml');
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
