/// <reference path="./patternSearchTree.ts"/>
/// <reference path="./move.ts"/>
/// <reference path="./player.ts"/>
/// <reference path="./gobang.ts"/>

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

  export var computeHeuristicAt = function(player: Player, move: Move, engine: Gobang): number {
    var totalHeuristics = 0;

    // search right
    var node = root;
    var heuristics = 0;
    for (var i = 0; i < maxDepth; i++) {
      if (engine.isOutOfBound({ row: move.row, column: move.column+i })) {
        break;
      }

      var ownership = color2ownership(engine.board[move.row][move.column+i], player.color);
      if (node.children[ownership]) {
        node = node.children[ownership];
        heuristics = Math.max(node.score, heuristics);
      } else {
        break;
      }
    }
    totalHeuristics += heuristics;

    // search down
    node = root;
    heuristics = 0
    for (var i = 0; i < maxDepth; i++) {
      if (engine.isOutOfBound({ row: move.row+i, column: move.column })) {
        break;
      }

      var ownership = color2ownership(engine.board[move.row+i][move.column], player.color);
      if (node.children[ownership]) {
        node = node.children[ownership];
        heuristics = Math.max(node.score, heuristics);
      } else {
        break;
      }
    }
    totalHeuristics += heuristics;

    // search down-right
    node = root;
    heuristics = 0
    for (var i = 0; i < maxDepth; i++) {
      if (engine.isOutOfBound({ row: move.row+i, column: move.column+i })) {
        break;
      }

      var ownership = color2ownership(engine.board[move.row+i][move.column+i], player.color);
      if (node.children[ownership]) {
        node = node.children[ownership];
        heuristics = Math.max(node.score, heuristics);
      } else {
        break;
      }
    }
    totalHeuristics += heuristics;

    // search up-right
    node = root;
    heuristics = 0
    for (var i = 0; i < maxDepth; i++) {
      if (engine.isOutOfBound({ row: move.row-i, column: move.column+i })) {
        break;
      }

      var ownership = color2ownership(engine.board[move.row-i][move.column+i], player.color);
      if (node.children[ownership]) {
        node = node.children[ownership];
        heuristics = Math.max(node.score, heuristics);
      } else {
        break;
      }
    }
    totalHeuristics += heuristics;

    return totalHeuristics;
  }

  export var computeHeuristicOfBoard = function(player: Player, engine: Gobang): number {
    var totalHeuristics = 0;

    for (var i = 0; i < engine.size; i++) {
      for (var j = 0; j < engine.size; j++) {
        totalHeuristics += computeHeuristicAt(player, { row: i, column: j }, engine);
      }
    }

    return totalHeuristics;
  }
}
