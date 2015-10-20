/// <reference path="./player.ts"/>
/// <reference path="./heuristics.ts"/>
/// <reference path="./board.ts"/>

module GobangOnline {
  export class AiPlayer implements Player {
    public color: Color;
    private maximizingMove: Move;

    constructor(private depth:number, private maxCandidates:number) {
      console.log(this.depth, this.maxCandidates);
    }

    setColor(color: Color) {
      this.color = color;
    }

    takeTurn(context: Gobang, lastMove: Move): void {
      // console.log('heuristics: ' + computeHeuristicOfBoard(this, context.board));

      var v = this.alphabeta(context.board, this.depth, -Infinity, Infinity, true);
      console.log(v, this.maximizingMove);
      console.log('end turn');
      context.registerMove(this, this.maximizingMove);
    }

    alphabeta(node:Board, depth:number, alpha:number, beta:number, maximizingPlayer:boolean):number {
      if (depth == 0) {
        return computeHeuristicOfBoard(this.color, node);
      }

      if (maximizingPlayer) {
        var v = alpha;
        var maximizingMove:Move;

        var moves = this.getTopCandidates(node, this.maxCandidates, true);
        for (var i = 0; i < moves.length; i++) {
          var m = moves[i];
          node.setColorAt(m, this.color);
          var tmp = this.alphabeta(node, depth-1, v, beta, !maximizingPlayer);
          if (depth == this.depth) {
            console.log(tmp, m);
          }
          if (depth == this.depth && tmp > v) {
            this.maximizingMove = m;
          }
          //console.log(depth, i, m, tmp)
          v = Math.max(v, tmp);
          node.revertLastMove();
          if (beta <= v) {
            return v;
          }
        }

        return v;
      } else {
        var v = beta;

        var moves = this.getTopCandidates(node, this.maxCandidates, false);
        for (var i = 0; i < moves.length; i++) {
          var m = moves[i];
          node.setColorAt(m, getOpponentColor(this.color));
          var tmp = this.alphabeta(node, depth-1, alpha, v, !maximizingPlayer);
          //console.log(depth, i, m, tmp)
          v = Math.min(v, tmp);
          node.revertLastMove();
          if (v <= alpha) {
            return v;
          }
        }

        return v;
      }
    }

    getTopCandidates(board: Board, maxCandidates: number, maximizingPlayer:boolean): Move[] {
      var candidates = this.getCandidates(board);
      if (candidates.length <= maxCandidates) return candidates;
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

      //console.log(candidates);
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
