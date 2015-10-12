/// <reference path="./player.ts"/>
/// <reference path="./gobang.ts"/>
/// <reference path="./move.ts"/>
/// <reference path="./peerjs.d.ts"/>
/// <reference path="./message.ts"/>

module GobangOnline {
  export class RemotePlayer implements Player {
    public color: Color;
    private context: Gobang;

    constructor(private conn:PeerJs.DataConnection) {
    }

    setColor(color:Color) {
      this.color = color;
    }

    takeTurn(context:Gobang, lastMove:Move): void {
      this.context = context;
      this.conn.send({ type: MsgType.TakeTurn, lastMove: lastMove });
    }

    makeMove(move:Move) {
      this.context.registerMove(this, move);
    }

    badMove(context:Gobang, badMove:Move): void {
    }

    win(): void {
    }

    lose(): void {
    }
  }
}
