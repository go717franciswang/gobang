/// <reference path="./phaser.d.ts"/>
/// <reference path="./pixi.d.ts"/>
/// <reference path="./move.ts"/>
/// <reference path="./gobang.ts"/>
/// <reference path="./peerjs.d.ts"/>
/// <reference path="./remotePlayer.ts"/>
/// <reference path="./message.ts"/>
/// <reference path="./board.ts"/>

module GobangOnline {
  var API_KEY = 'swe48rh5c9l1h5mi';
  var ROOMID = 'server';
  var BOARD_SIZE = 16;

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
    private blackTurn = true;
    private localBoard:Board;

    create() {
      this.board = this.add.sprite(this.game.width/2, this.game.height/2, 'board');
      this.board.anchor.setTo(0.5, 0.5);
      var scale: number = this.game.height / this.board.height;
      this.board.scale.setTo(scale, scale);
      this.createServerIfNotExist();
      this.localBoard = new Board(BOARD_SIZE);
    }

    createServerIfNotExist() {
      this.server = new Peer(ROOMID, { key: API_KEY });

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
              this.engine = new Gobang(BOARD_SIZE, this.remotePlayer1, this.remotePlayer2);
              this.engine.blackPlayer.send({ type: MsgType.PopupText, text: 'GAME BEGAN\nYOU ARE BLACK' });
              this.engine.whitePlayer.send({ type: MsgType.PopupText, text: 'GAME BEGAN\nYOU ARE WHITE' });
              this.engine.startGame();

              this.engine.onGameOver = () => {
                this.broadCast({ type: MsgType.GameOver, winnerColor: this.engine.pendingPlayer.color });
              };
            }, 1000);
          }
        });
      });
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
            this.broadCast({ type: GobangOnline.MsgType.Move, move: move });
            this.engine.pendingPlayer.makeMove(move);
          break;
          case MsgType.NewPlayer:
            if (this.isFirstClient(conn)) {
              this.connToClients[0].send({ type: MsgType.PopupText, text: 'WAITING FOR ANOTHER PLAYER' });
            } else if (this.isSecondClient(conn)) {
              this.broadCast({ type: MsgType.PopupText, text: 'GAME IS READY' });
            } else {
              this.broadCast({ type: MsgType.PopupText, text: 'AN OBSERVER HAS ENTERED' });
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
      this.client = new Peer({ key: API_KEY });

      this.client.on('error', () => {

      });

      this.client.on('open', () => {
        this.connToServer = this.client.connect(ROOMID, { reliable: true });

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
          case GobangOnline.MsgType.TakeTurn:
            this.takingTurn = true;
          break;
          case MsgType.Move:
            var move:Move = data.move;
            var pos = this.move2position(move);
            var piece = this.add.sprite(pos.x, pos.y, 'piece');
            if (!this.blackTurn) {
              piece.frame = 1;
            }

            piece.anchor.setTo(0.5, 0.5);
            piece.scale.setTo(0.12);

            if (this.blackTurn) {
              this.localBoard.setColorAt(move, Color.Black);
            } else {
              this.localBoard.setColorAt(move, Color.White);
            }

            this.blackTurn = !this.blackTurn;
          break;
          case MsgType.GameOver:
            var txt = data.winnerColor == Color.Black ? 'BLACK WINS' : 'WHITE WINS';
            var msg = this.game.add.bitmapText(this.game.width/2, this.game.height/2, 'Castaway', txt);
            msg.anchor.setTo(0.5, 0.5);
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
      if (this.takingTurn) {
        var move = this.position2move(this.game.input.activePointer);

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

    position2move(position: { x: number; y: number }): Move {
      return {
        row: Math.round((position.y-35)/(525/15)),
        column: Math.round((position.x-135)/(525/15))
      };
    }

    move2position(move: Move): { x: number; y: number } {
      return {
        x: move.column*525/15+135,
        y: move.row*525/15+35
      };
    }
  }
}
