/// <reference path="./patternSearchTree.ts"/>
/// <reference path="./move.ts"/>
/// <reference path="./player.ts"/>
/// <reference path="./board.ts"/>

module GobangOnline {

  var color2ownership = function(pieceColor: Color, playerColor: Color): PieceOwnership {
    if (pieceColor == playerColor) {
      return PieceOwnership.Mine;
    } else if (pieceColor == Color.Empty) {
      return PieceOwnership.None;
    } else {
      return PieceOwnership.Opponent;
    }
  };

  export var computeHeuristicAt = function(player: Player, move: Move, board: Board, getRivalScore: boolean=false): number {
    var totalHeuristics = 0;
    var directions = [[0, 1], [1, 0], [1, 1], [-1, 1]];

    for (var i = 0; i < directions.length; i++) {
      var node = root;
      var heuristics = 0;
      var dx = directions[i][1];
      var dy = directions[i][0];

      for (var j = 0; j < maxDepth; i++) {
        var m = { row: move.row+dy*i, column: move.column+dx*i };
        if (board.isOutOfBound(m)) {
          break;
        }

        var ownership: PieceOwnership;
        if (getRivalScore) {
          ownership = color2ownership(board.colorAt(m), getOpponentColor(player.color));
        } else {
          ownership = color2ownership(board.colorAt(m), player.color);
        }

        if (node.children[ownership]) {
          node = node.children[ownership];
        } else {
          heuristics = getRivalScore ? node.rivalScore : node.score;
          break;
        }
      }
      totalHeuristics += heuristics;
    }

    return totalHeuristics;
  }

  export var computeHeuristicOfBoard = function(player: Player, board: Board): number {
    var totalHeuristics = 0;

    for (var i = 0; i < board.size; i++) {
      for (var j = 0; j < board.size; j++) {
        totalHeuristics += computeHeuristicAt(player, { row: i, column: j }, board, false);
        totalHeuristics -= computeHeuristicAt(player, { row: i, column: j }, board, true);
      }
    }

    return totalHeuristics;
  }
}
