/// <reference path="./player.ts"/>
/// <reference path="./gobang.ts"/>
/// <reference path="./move.ts"/>

module GobangOnline {
  export class HumanPlayer implements Player {
    public color: number;
    public takingTurn: boolean;
    private context: Gobang;

    constructor() {
      this.takingTurn = false;
    }

    setColor(color: number) {
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
      console.log('human wins');
    }

    lose(): void {

    }
  }
}
