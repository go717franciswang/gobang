/// <reference path="./phaser.d.ts"/>
/// <reference path="./pixi.d.ts"/>
/// <reference path="./move.ts"/>
/// <reference path="./gobang.ts"/>
/// <reference path="./peerjs.d.ts"/>
/// <reference path="./remotePlayer.ts"/>
/// <reference path="./message.ts"/>
/// <reference path="./board.ts"/>
/// <reference path="./settings.ts"/>

module GobangOnline {


  export class MultiPlayer extends Phaser.State {
    board:Phaser.Sprite;
    remotePlayer1:RemotePlayer;
    remotePlayer2:RemotePlayer;
    engine:Gobang;

    private server:PeerJs.Peer;
    private client:PeerJs.Peer;
    private connToClients:PeerJs.DataConnection[];
    private connToServer:PeerJs.DataConnection;

    private takingTurn = false;
    private pendingMove:Move;
    private localBoard:Board;
    private timer1:Phaser.Text;
    private timer2:Phaser.Text;
    private turnBeganAt:number;
    private milliSecLeft1:number;
    private milliSecLeft2:number;
    private click:Phaser.Sound;
    private beep:Phaser.Sound;

    create() {
      this.click = this.add.audio('click');
      this.beep = this.add.audio('beep');
      this.board = this.add.sprite(this.game.width/2, this.game.height/2, 'board');
      this.board.anchor.setTo(0.5, 0.5);
      var scale: number = this.game.height / this.board.height;
      this.board.scale.setTo(scale, scale);
      this.createServerIfNotExist();
      this.localBoard = new Board(Settings.BOARD_SIZE);

      var style = { font: "bold 32px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };
      this.timer1 = this.add.text(this.game.width-25, 0, Settings.MAX_SECONDS_PER_GAME.toString(), style);
      this.timer1.anchor.setTo(1, 0);
      this.timer2 = this.add.text(this.game.width-25, 30, Settings.MAX_SECONDS_PER_GAME.toString(), style);
      this.timer2.anchor.setTo(1, 0);
    }

    createServerIfNotExist() {
      this.server = new Peer(Settings.ROOMID, { key: Settings.API_KEY });

      this.server.on('error', (e) => {
        console.log(e);
        if (e.toString().match(/ID.*is taken/)) {
          this.createClient();
        }
      });

      this.server.on('open', () => {
        this.connToClients = [];
        console.log('server created!');
        this.createClient();

        this.server.on('connection', (conn) => {
          console.log('someone joined');
          this.connToClients.push(conn);
          this.handleConnectionToClient(conn);

          if (this.connToClients.length == 2) {
            console.log('got enough players');
            console.log('game start in 1 second');
            setTimeout(() => {
              this.remotePlayer1 = new RemotePlayer(this.connToClients[0]);
              this.remotePlayer2 = new RemotePlayer(this.connToClients[1]);
              this.engine = new Gobang(Settings.BOARD_SIZE, this.remotePlayer1, this.remotePlayer2);
              this.engine.blackPlayer.send({ type: MsgType.PopupText, text: 'GAME BEGAN\nYOU ARE BLACK' });
              this.engine.whitePlayer.send({ type: MsgType.PopupText, text: 'GAME BEGAN\nYOU ARE WHITE' });

              this.engine.blackPlayer.onTakeTurnCallback = (moveCountBeforeTurn:number, milliSecLeft:number) => {
                this.broadCast({ type: MsgType.Timer, milliSecLeft: milliSecLeft, color: Color.Black });
                setTimeout(() => {
                  // if no new move was made after many seconds
                  if (moveCountBeforeTurn == this.engine.board.getMoveCount()) {
                    this.declareWinner(Color.White);
                  }
                }, milliSecLeft + 1000);
              };

              this.engine.whitePlayer.onTakeTurnCallback = (moveCountBeforeTurn:number, milliSecLeft:number) => {
                this.broadCast({ type: MsgType.Timer, milliSecLeft: milliSecLeft, color: Color.White });
                setTimeout(() => {
                  // if no new move was made after many seconds
                  if (moveCountBeforeTurn == this.engine.board.getMoveCount()) {
                    this.declareWinner(Color.Black);
                  }
                }, milliSecLeft + 1000);
              };

              this.engine.startGame();

              this.engine.onGameOver = () => {
                this.declareWinner(this.engine.pendingPlayer.color);
              };
            }, 1000);
          }
        });
      });
    }

    declareWinner(winnerColor) {
      this.broadCast({ type: MsgType.GameOver, winnerColor: winnerColor });
      setTimeout(() => {
        this.server.destroy();
      }, 1000);
    }

    broadCast(msg:Message) {
      this.connToClients.forEach(conn => {
        conn.send(msg);
      });
    }

    handleConnectionToClient(conn:PeerJs.DataConnection) {
      conn.on('open', () => {

      });

      conn.on('data', (data) => {
        console.log('server got message: ', data);
        switch(data.type) {
          case MsgType.Move:
            var move:Move = data.move;
            this.broadCast({ type: GobangOnline.MsgType.Move, move: move, moveId: this.engine.board.getMoveCount() });
            this.engine.pendingPlayer.makeMove(move);
          break;
          case MsgType.NewPlayer:
            if (this.isFirstClient(conn)) {
              this.connToClients[0].send({ type: MsgType.PopupText, text: 'WAITING FOR ANOTHER PLAYER' });
            } else if (this.isSecondClient(conn)) {
              this.broadCast({ type: MsgType.PopupText, text: 'GAME IS READY' });
            } else {
              this.broadCast({ type: MsgType.PopupText, text: 'AN OBSERVER HAS ENTERED' });
              setTimeout(() => {
                for (var i = 0; i < this.engine.board.getMoveCount(); i++) {
                  conn.send({ type: MsgType.Move, move: this.engine.board.getMoveAt(i), moveId: i });
                }
              }, 1000);
            }
          break;
        }
      });
    }

    isFirstClient(conn:PeerJs.DataConnection) {
      return conn.peer == this.connToClients[0].peer;
    }

    isSecondClient(conn:PeerJs.DataConnection) {
      return conn.peer == this.connToClients[1].peer;
    }

    createClient() {
      this.client = new Peer({ key: Settings.API_KEY });

      this.client.on('error', () => {

      });

      this.client.on('open', () => {
        this.connToServer = this.client.connect(Settings.ROOMID, { reliable: true });

        this.connToServer.on('open', () => {
          this.handleConnectionToServer();
          this.client.disconnect();
          this.connToServer.send({ type: MsgType.NewPlayer });
        });
      });
    }

    handleConnectionToServer() {
      this.connToServer.on('error', () => {

      });

      this.connToServer.on('data', (data) => {
        console.log('client got message: ', data);
        switch(data.type) {
          case GobangOnline.MsgType.Timer:
            this.turnBeganAt = (new Date()).getTime();
            if (data.color == Color.Black) {
              this.milliSecLeft1 = data.milliSecLeft;
              this.milliSecLeft2 = null;
            } else {
              this.milliSecLeft2 = data.milliSecLeft;
              this.milliSecLeft1 = null;
            }
          break;
          case GobangOnline.MsgType.TakeTurn:
            this.takingTurn = true;
          break;
          case MsgType.Move:
            var move:Move = data.move;
            var pos = move2position(move);
            var piece = this.add.sprite(pos.x, pos.y, 'piece');
            var blackTurn = data.moveId%2 == 0;
            if (!blackTurn) {
              piece.frame = 1;
            }

            piece.anchor.setTo(0.5, 0.5);
            piece.scale.setTo(30/piece.width);

            if (blackTurn) {
              this.localBoard.setColorAt(move, Color.Black);
            } else {
              this.localBoard.setColorAt(move, Color.White);
            }

            this.click.play();
          break;
          case MsgType.GameOver:
            var txt = data.winnerColor == Color.Black ? 'BLACK WINS' : 'WHITE WINS';
            var msg = this.game.add.bitmapText(this.game.width/2, this.game.height/2, 'Castaway', txt);
            msg.anchor.setTo(0.5, 0.5);
            addMenuButton(this.game);
          break;
          case MsgType.PopupText:
            var msg = this.game.add.bitmapText(this.game.width/2, this.game.height/2, 'Castaway', data.text);
            msg.anchor.setTo(0.5, 0.5);
            this.add.tween(msg).to({ alpha: 0 }, 700, null, true, 1000);
          break;
        }
      });
    }

    update() {
      if (this.milliSecLeft1) {
        var secondsLeft = Math.max(0, Math.ceil((this.milliSecLeft1 - (new Date().getTime() - this.turnBeganAt))/1000));
        if (secondsLeft != parseInt(this.timer1.text) && secondsLeft < 30) {
          this.beep.play();
        }
        this.timer1.setText(secondsLeft.toString());
      }

      if (this.milliSecLeft2) {
        var secondsLeft = Math.max(0, Math.ceil((this.milliSecLeft2 - (new Date().getTime() - this.turnBeganAt))/1000));
        if (secondsLeft != parseInt(this.timer2.text) && secondsLeft < 30) {
          this.beep.play();
        }
        this.timer2.setText(secondsLeft.toString());
      }

      if (this.takingTurn) {
        var move = position2move(this.game.input.activePointer);

        if (this.game.input.activePointer.isDown) {
          if (this.localBoard.isMoveValid(move) && !this.pendingMove) {
            this.pendingMove = move;
          }
        } else {
          if (this.pendingMove && this.pendingMove.row == move.row && this.pendingMove.column == move.column) {
            this.connToServer.send({ type: MsgType.Move, move: move });
            this.takingTurn = false;
          }
          this.pendingMove = null;
        }
      }
    }
  }
}
