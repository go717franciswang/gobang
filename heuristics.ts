/// <reference path="./patternSearchTree.ts"/>
/// <reference path="./move.ts"/>
/// <reference path="./player.ts"/>
/// <reference path="./board.ts"/>

module GobangOnline {

  function color2ownership(pieceColor: Color, playerColor: Color): PieceOwnership {
    if (pieceColor == playerColor) {
      return PieceOwnership.Mine;
    } else if (pieceColor == Color.Empty) {
      return PieceOwnership.None;
    } else {
      return PieceOwnership.Opponent;
    }
  };

  export function computeHeuristicAt(playerColor: Color, move: Move, board: Board, getRivalScore:boolean): number {
    var heuristics = 0;
    var directions = [[0, 1], [1, 0], [1, 1], [1, -1]];

    for (var i = 0; i < directions.length; i++) {

      var node = root;
      var dx = directions[i][0];
      var dy = directions[i][1];

      for (var j = 0; j < maxDepth; j++) {
        var m = { row: move.row+dy*j, column: move.column+dx*j };
        if (board.isOutOfBound(m)) {
          break;
        }

        var ownership: PieceOwnership;
        if (getRivalScore) {
          ownership = color2ownership(board.colorAt(m), getOpponentColor(playerColor));
        } else {
          ownership = color2ownership(board.colorAt(m), playerColor);
        }

        if (node.children[ownership]) {
          node = node.children[ownership];
          //heuristics = Math.max(heuristics, getRivalScore ? node.rivalScore : node.score);
          heuristics = Math.max(heuristics, !getRivalScore ? node.rivalScore : node.score);
          //heuristics = Math.max(heuristics, node.score);
        } else {
          break;
        }
      }
    }

    return heuristics;
  }

  export function computeHeuristicOfBoardOld(playerColor: Color, board: Board): number {
    var heuristics = 0;
    var heuristicsRival = 0;

    var h = [];
    var hr = [];

    for (var i = 0; i < board.size; i++) {
      for (var j = 0; j < board.size; j++) {
        var m = { row: i, column: j };
        //heuristics = Math.max(heuristics, computeHeuristicAt(playerColor, m, board, false));
        //heuristicsRival = Math.max(heuristicsRival, computeHeuristicAt(playerColor, m, board, true));
        heuristics += computeHeuristicAt(playerColor, m, board, false);
        heuristicsRival += computeHeuristicAt(playerColor, m, board, true);
        //h.push(computeHeuristicAt(playerColor, m, board, false));
        //hr.push(computeHeuristicAt(playerColor, m, board, true));
      }
    }

    //h.sort().reverse();
    //hr.sort().reverse();
    //return h[0]+h[1]-hr[0]-hr[1];
    return heuristics - heuristicsRival;
  }

  export function matchPatternsAt(playerColor:Color, move:Move, board:Board, searched:boolean[][]) {
    var patternNames = [];
    var directions = [[0, 1], [1, 0], [1, 1], [1, -1]];

    for (var i = 0; i < directions.length; i++) {
      var node = root;
      var dx = directions[i][0];
      var dy = directions[i][1];
      var edgePatternName = null;

      var j = 0;
      while (true) {
        var m = { row: move.row+dy*j, column: move.column+dx*j };
        if (board.isOutOfBound(m)) {
          break;
        }

        var ownership = color2ownership(board.colorAt(m), playerColor);
        if (node.children[ownership]) {
          node = node.children[ownership];
          if (node.name) {
            edgePatternName = node.name;
            for (var k = 0; k <= j; k++) {
              searched[move.row+dy*k][move.column+dx*k] = true;
            }
          }
        } else {
          break;
        }

        j++;
      }

      if (edgePatternName) {
        // only push the edge pattern to avoid the following situation
        // 011101 misinterpreted as both 活三 and 冲四
        patternNames.push(node.name);
      }
    }

    return patternNames;
  }

  export function computeHeuristicOfBoard(playerColor: Color, board: Board): number {
    var playerPatterns = [];
    var opponentPatterns = [];
    var searched = buildSquareMatrix(board.size, false);
    var searchedOpponent = buildSquareMatrix(board.size, false);

    for (var i = 0; i < board.size; i++) {
      for (var j = 0; j < board.size; j++) {
        var m = { row: i, column: j };

        // do not search searched area to avoid the following situation
        // 11101 misinterpreted as both 冲四 and 活三
        if (!searched[i][j]) {
          playerPatterns = playerPatterns.concat(this.matchPatternsAt(playerColor, m, board, searched));
        }

        if (!searchedOpponent[i][j]) {
          opponentPatterns = opponentPatterns.concat(this.matchPatternsAt(getOpponentColor(playerColor), m, board, searchedOpponent));
        }
      }
    }

    return alternativePatternsToScore(playerPatterns) - alternativePatternsToScore(opponentPatterns)*1.251;
  }
}
