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
    var heuristics = 0;
    var directions = [[0, 1], [1, 0], [1, 1], [1, -1]];

    for (var i = 0; i < directions.length; i++) {
      var node = root;
      var dx = directions[i][0];
      var dy = directions[i][1];

      for (var j = 0; j < maxDepth; i++) {
        var m = { row: move.row+dy*j, column: move.column+dx*j };
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
          heuristics = Math.max(heuristics, getRivalScore ? node.rivalScore : node.score);
        } else {
          break;
        }
      }
    }

    return heuristics;
  }

  export var computeHeuristicOfBoard = function(player: Player, board: Board): number {
    var heuristics = 0;
    var heuristicsRival = 0;

    for (var i = 0; i < board.size; i++) {
      for (var j = 0; j < board.size; j++) {
        var m = { row: i, column: j };
        heuristics = Math.max(heuristics, computeHeuristicAt(player, m, board, false));
        heuristicsRival = Math.max(heuristicsRival, computeHeuristicAt(player, m, board, true));
      }
    }

    return heuristics - heuristicsRival;
  }
}
