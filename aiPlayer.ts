/// <reference path="./player.ts"/>
/// <reference path="./heuristics.ts"/>
/// <reference path="./board.ts"/>

module GobangOnline {
  export class AiPlayer implements Player {
    public color: Color;
    private maximizingMove: Move;

    constructor() {

    }

    setColor(color: Color) {
      this.color = color;
    }

    takeTurn(context: Gobang, lastMove: Move): void {
      // console.log('heuristics: ' + computeHeuristicOfBoard(this, context.board));

      var v = this.alphabeta(context.board, 2, -Infinity, Infinity, true);
      context.registerMove(this, this.maximizingMove);
    }

    alphabeta(node:Board, depth:number, alpha:number, beta:number, maximizingPlayer:boolean):number {
      if (depth == 0) {
        return computeHeuristicOfBoard(this.color, node);
      }

      if (maximizingPlayer) {
        var v = -Infinity;

        var moves = this.getTopCandidates(node, 3, true);
        for (var i = 0; i < moves.length; i++) {
          var m = moves[i];
          node.setColorAt(m, this.color);
          v = Math.max(v, this.alphabeta(node, depth-1, alpha, beta, !maximizingPlayer));
          node.revertLastMove();
          alpha = Math.max(alpha, v);

          if (alpha == v) {
            this.maximizingMove = m;
          }

          if (beta <= alpha) {
            break;
          }
        }

        return v;
      } else {
        var v = Infinity;

        var moves = this.getTopCandidates(node, 3, false);
        for (var i = 0; i < moves.length; i++) {
          var m = moves[i];
          node.setColorAt(m, getOpponentColor(this.color));
          v = Math.min(v, this.alphabeta(node, depth-1, alpha, beta, !maximizingPlayer));
          node.revertLastMove();
          beta = Math.min(beta, v);
          if (beta <= alpha) {
            break;
          }
        }

        return v;
      }
    }

    getTopCandidates(board: Board, maxCandidates: number, maximizingPlayer:boolean): Move[] {
      var candidates = this.getCandidates(board);
      var candidateHeuristics = [];

      for (var i = 0; i < candidates.length; i++) {
        var move = candidates[i];
        board.setColorAt(move, this.color);
        candidateHeuristics.push([move, computeHeuristicOfBoard(this.color, board)]);
        board.revertLastMove();
      }

      if (maximizingPlayer) {
        candidateHeuristics.sort(function(a, b) { return b[1]-a[1] });
      } else {
        candidateHeuristics.sort(function(a, b) { return a[1]-b[1] });
      }
      //console.log(candidateHeuristics);
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
