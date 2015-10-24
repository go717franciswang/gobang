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
    private stageGroup:Phaser.Group;
    private worldScale:number = 1;
    private oldDistance:number;
    private distance:number;
    private oldCenter:{x:number; y:number};
    private center:{x:number; y:number};

    init(aiDepth, maxCandidates) {
      this.aiDepth = aiDepth;
      this.maxCandidates = maxCandidates;
    }

    create() {
      this.stageGroup = this.game.add.group();
      this.board = this.add.sprite(this.game.width/2, this.game.height/2, 'board');
      this.stageGroup.add(this.board);
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
        var pos = this.move2position(move);
        var piece = this.add.sprite(pos.x, pos.y, 'piece');
        if (player.color == Color.White) {
          piece.frame = 1;
        }

        piece.anchor.setTo(0.5, 0.5);
        piece.scale.setTo(30/piece.width);
        this.stageGroup.add(piece);
      });
      this.engine.startGame();
    }

    move2position(move: Move): { x: number; y: number } {
      return {
        x: move.column*(Settings.BOARD_X_END - Settings.BOARD_X_START)/(Settings.BOARD_SIZE-1)+Settings.BOARD_X_START,
        y: move.row*(Settings.BOARD_Y_END - Settings.BOARD_Y_START)/(Settings.BOARD_SIZE-1)+Settings.BOARD_Y_START
      };
    }

    position2move(position: { x: number; y: number }): Move {
      return {
        row: Math.round((position.y-Settings.BOARD_Y_START)/((Settings.BOARD_Y_END - Settings.BOARD_Y_START)/(Settings.BOARD_SIZE-1))),
        column: Math.round((position.x-Settings.BOARD_X_START)/((Settings.BOARD_X_END - Settings.BOARD_X_START)/(Settings.BOARD_SIZE-1)))
      };
    }

    update() {

      // pinch-zoom described in
      // http://www.html5gamedevs.com/topic/8762-zoom-outin-camera-as-seen-in-angry-birds/
      if (this.input.pointer1.isDown && this.input.pointer2.isDown) {
        this.oldCenter = this.center;
        this.center = { x: (this.input.pointer1.x+this.input.pointer2.x)/2, y: (this.input.pointer1.y+this.input.pointer2.y)/2 };
        this.oldDistance = this.distance;
        this.distance = Phaser.Math.distance(this.input.pointer1.x, this.input.pointer1.y, this.input.pointer2.x, this.input.pointer2.y);
        var delta = Math.abs(this.oldDistance - this.distance);

        // zoom
        if (delta > 4) {
          if (this.oldDistance < this.distance) {
            this.worldScale -= 0.02;
          } else {
            this.worldScale += 0.02;
          }

          this.worldScale = Phaser.Math.clamp(this.worldScale, 0.5, 1.5);
          this.stageGroup.scale.set(this.worldScale);

        // follow
        } else {
          if (Math.abs(this.center.x - this.oldCenter.x) > 4) {
            if (this.center.x > this.oldCenter.x) {
              this.camera.x += 4;
            }
          }

          if (Math.abs(this.center.y - this.oldCenter.y) > 4) {
            if (this.center.y > this.oldCenter.y) {
              this.camera.y += 4;
            }
          }
        }

      } else if (this.humanPlayer.takingTurn) {
        var move = this.position2move(this.game.input.activePointer);

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
