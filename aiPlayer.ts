/// <reference path="./player.ts"/>

module GobangOnline {
  export class AiPlayer implements Player {
    public color: number;

    constructor() {

    }

    setColor(color: number) {
      this.color = color;
    }

    takeTurn(context: Gobang, lastMove: Move): void {
      var availableMoves: Move[] = [];
      for (var i = 0; i < context.size; i++) {
        for (var j = 0; j < context.size; j++) {
          if (context.board[i][j] == EMPTY) {
            availableMoves.push({ row: i, column: j });
          }
        }
      }

      var randIdx = Math.floor(Math.random()*availableMoves.length);
      context.registerMove(this, availableMoves[randIdx]);
    }

    badMove(context: Gobang, badMove: Move): void {

    }

    win(): void {

    }

    lose(): void {

    }
  }
}
