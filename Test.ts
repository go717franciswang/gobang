/// <reference path="./board.ts"/>
///<reference path="./move.ts" />

module GobangOnline {
  // load board from string representation, where
  // . represent none
  // x represents black
  // o represents white
  // ? represents an acceptable answer
  // O represents wrong move
  function loadBoard(data: string[]): { board:Board, acceptableAnwsers:Move[] } {
    var size = data.length;
    var board = new Board(size);
    var acceptableAnwsers = [];

    for (var i = 0; i < size; i++) {
      var row = data[i].trim();

      for (var j = 0; j < size; j++) {
        var m = { row: i, column: j };
        if (row[j] == "x") {
          board.setColorAt(m, Color.Black);
        } else if (row[j] == "o") {
          board.setColorAt(m, Color.White);
        } else if (row[j] == "?") {
          acceptableAnwsers.push(m);
        }
      }
    }

    return { board: board, acceptableAnwsers: acceptableAnwsers };
  }

  function assertAcceptableAnser(answer:Move, acceptableAnwsers:Move[], data:string[]) {
    for (var i = 0; i < acceptableAnwsers.length; i++) {
      var validAnswer = acceptableAnwsers[i];
      if (answer.row == validAnswer.row && answer.column == validAnswer.column) return
    }

    for (var i = 0; i < data.length; i++) {
      var id = ""+i+"|";
      if (answer.row == i) {
        var row = data[i].substr(0, answer.column) + "O" + data[i].substr(answer.column+1, data[i].length-answer.column-1);
        console.log(id+row);
      } else {
        console.log(id+data[i]);
      }
    }
    throw "Assertion failed: expected "+JSON.stringify(acceptableAnwsers)+", got "+JSON.stringify(answer);
  }

  export function test1() {
    var data = [".......",
                ".......",
                ".o.o.?.",
                "..oxx..",
                ".xox...",
                "..x....",
                ".?....."];
    var info = loadBoard(data);
    var solver = new Solver(Color.White, 1, 100, Algo.Alphabeta);
    var m = solver.solve(info.board);
    assertAcceptableAnser(m, info.acceptableAnwsers, data);
  }
}
