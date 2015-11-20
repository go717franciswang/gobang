/// <reference path="./phaser.d.ts"/>
/// <reference path="./pixi.d.ts"/>
/// <reference path="./move.ts"/>
/// <reference path="./gobang.ts"/>
/// <reference path="./humanPlayer.ts"/>
/// <reference path="./aiPlayer.ts"/>
/// <reference path="./settings.ts"/>

module GobangOnline {

  export class SinglePlayer extends Phaser.State {

    board: Phaser.Sprite;
    humanPlayer: HumanPlayer;
    aiPlayer: AiPlayer;
    engine: Gobang;
    private aiDepth:number;
    private maxCandidates:number;
    private pendingMove:Move;
    private click:Phaser.Sound;

    init(aiDepth, maxCandidates) {
      this.aiDepth = aiDepth;
      this.maxCandidates = maxCandidates;
    }

    create() {
      this.click = this.add.audio('click');
      this.board = this.add.sprite(this.game.width/2, this.game.height/2, 'board');
      this.board.anchor.setTo(0.5, 0.5);
      var scale: number = this.game.height / this.board.height;
      this.board.scale.setTo(scale, scale);
      this.humanPlayer = new HumanPlayer();
      this.humanPlayer.onWinCallback = () => {
        var msg = this.game.add.bitmapText(this.game.width/2, this.game.height/2, 'Castaway', 'YOU WON!');
        msg.anchor.setTo(0.5, 0.5);
      };
      this.humanPlayer.onLossCallback = () => {
        var msg = this.game.add.bitmapText(this.game.width/2, this.game.height/2, 'Castaway', 'YOU LOST!');
        msg.anchor.setTo(0.5, 0.5);
      };

      this.aiPlayer = new AiPlayer(this.aiDepth, this.maxCandidates);
      this.engine = new Gobang(Settings.BOARD_SIZE, this.humanPlayer, this.aiPlayer);
      this.engine.setOnRegisterMove((player, move) => {
        var pos = move2position(move);
        var piece = this.add.sprite(pos.x, pos.y, 'piece');
        if (player.color == Color.White) {
          piece.frame = 1;
        }

        piece.anchor.setTo(0.5, 0.5);
        piece.scale.setTo(30/piece.width);
        this.click.play();
      });
      this.engine.startGame();
    }

    update() {
      if (this.humanPlayer.takingTurn) {
        var move = position2move(this.game.input.activePointer);

        if (this.game.input.activePointer.isDown) {
          if (this.engine.board.isMoveValid(move) && !this.pendingMove) {
            this.pendingMove = move;
          }
        } else {
          if (this.pendingMove && this.pendingMove.row == move.row && this.pendingMove.column == move.column) {
            this.humanPlayer.makeMove(move);
          }
          this.pendingMove = null;
        }
      }
    }

/*
    render() {
      this.game.debug.text("Mouse: " + this.game.input.activePointer.clientX, 300, 132);
      this.game.debug.text("Mouse: " + this.game.input.activePointer.clientY, 300, 162);
    }
  */
  }
}
