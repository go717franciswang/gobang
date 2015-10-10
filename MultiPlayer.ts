/// <reference path="./phaser.d.ts"/>
/// <reference path="./pixi.d.ts"/>
/// <reference path="./move.ts"/>
/// <reference path="./gobang.ts"/>
/// <reference path="./peerjs.d.ts"/>

module GobangOnline {
  enum MsgType { Move }
  var API_KEY = 'swe48rh5c9l1h5mi';
  var ROOMID = 'server';

  export class MultiPlayer extends Phaser.State {
    private server:PeerJs.Peer;
    private client:PeerJs.Peer;
    private connToClients:PeerJs.DataConnection[];
    private connToServer:PeerJs.DataConnection;

    create() {
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
        });
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
          case MsgType.Move:
          break;
        }
      });
    }
  }
}
