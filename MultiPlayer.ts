/// <reference path="./phaser.d.ts"/>
/// <reference path="./pixi.d.ts"/>
/// <reference path="./move.ts"/>
/// <reference path="./gobang.ts"/>
/// <reference path="./peerjs.d.ts"/>

module GobangOnline {

  export class MultiPlayer extends Phaser.State {
    private server:PeerJs.Peer;

    create() {
      this.createServerIfNotExist();
    }

    createServerIfNotExist() {
      this.server = new Peer('server', { key: 'swe48rh5c9l1h5mi' });

      this.server.on('error', (e) => {
        console.log(e);
      });

      this.server.on('open', () => {
        console.log('server created!');
      })
    }
  }
}
