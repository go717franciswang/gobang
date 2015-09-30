/// <reference path="./player.ts"/>
/// <reference path="./gobang.ts"/>
/// <reference path="./move.ts"/>
/// <reference path="./heuristics.ts"/>

module GobangOnline {
  export class HumanPlayer implements Player {
    public color: Color;
    public takingTurn: boolean;
    private context: Gobang;

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
      console.log('heuristics: ' + computeHeuristicOfBoard(this, this.context));
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
