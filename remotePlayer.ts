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
    private milliSecLeft:number;
    private turnBeganAt:number;

    constructor(private conn:PeerJs.DataConnection) {
      this.milliSecLeft = Settings.MAX_SECONDS_PER_GAME*1000;
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
      this.onTakeTurnCallback(this.context.board.getMoveCount(), this.milliSecLeft);
      this.turnBeganAt = new Date().getTime();
    }

    makeMove(move:Move) {
      this.context.registerMove(this, move);
      this.milliSecLeft -= new Date().getTime() - this.turnBeganAt;
    }

    getSecondsLeft() {
      return Math.ceil(this.milliSecLeft / 1000);
    }

    badMove(context:Gobang, badMove:Move): void {
    }

    win(): void {
    }

    lose(): void {
    }
  }
}
