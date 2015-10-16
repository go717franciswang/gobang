/// <reference path="./player.ts"/>
/// <reference path="./gobang.ts"/>
/// <reference path="./move.ts"/>
/// <reference path="./peerjs.d.ts"/>
/// <reference path="./message.ts"/>
/// <reference path="./settings.ts"/>

module GobangOnline {
  export class RemotePlayer implements Player {
    public color: Color;
    private context: Gobang;
    public onTakeTurnCallback:Function;

    constructor(private conn:PeerJs.DataConnection) {
    }

    send(msg:Message) {
      this.conn.send(msg);
    }

    setColor(color:Color) {
      this.color = color;
    }

    takeTurn(context:Gobang, lastMove:Move): void {
      this.context = context;
      this.conn.send({ type: MsgType.TakeTurn, lastMove: lastMove });
      this.onTakeTurnCallback(this.context.board.getMoveCount());
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
