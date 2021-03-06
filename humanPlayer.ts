/// <reference path="./player.ts"/>
/// <reference path="./gobang.ts"/>
/// <reference path="./move.ts"/>

module GobangOnline {
  export class HumanPlayer implements Player {
    public color: Color;
    public takingTurn: boolean;
    private context: Gobang;
    public onWinCallback;
    public onLossCallback;

    constructor() {
      this.takingTurn = false;
    }

    setColor(color: Color) {
      this.color = color;
    }

    takeTurn(context: Gobang, lastMove: Move): void {
      this.takingTurn = true;
      this.context = context;
    }

    makeMove(move: Move) {
      this.takingTurn = false;
      this.context.registerMove(this, move);
    }

    badMove(context: Gobang, badMove: Move): void {

    }

    win(): void {
      this.onWinCallback();
    }

    lose(): void {
      this.onLossCallback();
    }
  }
}
