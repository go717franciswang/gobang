/// <reference path="./phaser.d.ts"/>
/// <reference path="./pixi.d.ts"/>
/// <reference path="./move.ts"/>
/// <reference path="./gobang.ts"/>
/// <reference path="./peerjs.d.ts"/>
/// <reference path="./remotePlayer.ts"/>
/// <reference path="./message.ts"/>

module GobangOnline {
  enum MsgType { GameReady, YourTurn, Move };
  var API_KEY = 'swe48rh5c9l1h5mi';
  var ROOMID = 'server';

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

    create() {
      this.board = this.add.sprite(this.game.width/2, this.game.height/2, 'board');
      this.board.anchor.setTo(0.5, 0.5);
      var scale: number = this.game.height / this.board.height;
      this.board.scale.setTo(scale, scale);
      this.createServerIfNotExist();
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
        console.log('server created!');
        this.createClient();

        this.server.on('connection', (conn) => {
          this.connToClients.push(conn);
          this.handleConnectionToClient(conn);

          if (this.connToClients.length == 2) {
            this.remotePlayer1 = new RemotePlayer(this.connToClients[0]);
            this.remotePlayer2 = new RemotePlayer(this.connToClients[1]);
            this.engine = new Gobang(16, this.remotePlayer1, this.remotePlayer2);
            this.broadCast({ type: GobangOnline.MsgType.GameReady });
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
        switch(data.type) {
          case MsgType.Move:
            // make move
          break;
        }
      });
    }

    createClient() {
      this.client = new Peer({ key: API_KEY });

      this.client.on('error', () => {

      });

      this.client.on('open', () => {
        this.connToServer = this.client.connect(ROOMID);

        this.connToServer.on('open', () => {
          this.handleConnectionToServer();
          this.client.disconnect();
        });
      });
    }

    handleConnectionToServer() {
      this.connToServer.on('error', () => {

      });

      this.connToServer.on('data', (data) => {
        switch(data.type) {
          case MsgType.GameReady:
          break;
          case GobangOnline.MsgType.TakeTurn:
            this.takingTurn = true;
          break;
          case MsgType.Move:
          break;
        }
      });
    }
  }
}
