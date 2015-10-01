/// <reference path="./player.ts"/>
/// <reference path="./heuristics.ts"/>
/// <reference path="./board.ts"/>

module GobangOnline {
  export class AiPlayer implements Player {
    public color: Color;

    constructor() {

    }

    setColor(color: Color) {
      this.color = color;
    }

    takeTurn(context: Gobang, lastMove: Move): void {
      // console.log('heuristics: ' + computeHeuristicOfBoard(this, context.board));

      var topCandidates = this.getTopCandidates(context.board, 1);
      context.registerMove(this, topCandidates[0]);

    }

    getTopCandidates(board: Board, maxCandidates: number): Move[] {
      var candidates = this.getCandidates(board);
      var candidateHeuristics = [];

      for (var i = 0; i < candidates.length; i++) {
        var move = candidates[i];
        board.setColorAt(move, this.color);
        candidateHeuristics.push([move, computeHeuristicOfBoard(this, board)]);
        board.revertLastMove();
      }

      candidateHeuristics.sort(function(a, b) { return b[1]-a[1] });
      var topCandidates: Move[] = [];

      for (var i = 0; i < Math.min(maxCandidates, candidateHeuristics.length); i++) {
        topCandidates.push(candidateHeuristics[i][0]);
      }

      return topCandidates;
    }

    getCandidates(board: Board): Move[] {
      var candidates: Move[] = [];
      for (var i = 0; i < board.size; i++) {
        for (var j = 0; j < board.size; j++) {
          var move = { row: i, column: j };
          if (board.colorAt(move) == Color.Empty && board.hasNeighbor(move)) {
            candidates.push(move);
          }
        }
      }

      if (candidates.length == 0) {
        var mid = Math.round(board.size/2);
        candidates.push({ row: mid, column: mid });
      }

      return candidates;
    }

    badMove(context: Gobang, badMove: Move): void {

    }

    win(): void {

    }

    lose(): void {

    }
  }
}
