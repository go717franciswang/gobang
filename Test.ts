/// <reference path="./board.ts"/>
///<reference path="./move.ts" />

module GobangOnline {
  // load board from string representation, where
  // . represent none
  // x represents black
  // o represents white
  // ? represents an acceptable answer
  // 💻 represents new AI move
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

  function assertAcceptableAnser(answer:Move, acceptableAnwsers:Move[], data:string[], testTitle:string) {
    for (var i = 0; i < acceptableAnwsers.length; i++) {
      var validAnswer = acceptableAnwsers[i];
      if (answer.row == validAnswer.row && answer.column == validAnswer.column) {
        printBoard(answer, data);
        console.log(testTitle + " passed");
        return;
      }
    }

    printBoard(answer, data);
    throw "Assertion failed for "+ testTitle +": expected "+JSON.stringify(acceptableAnwsers)+", got "+JSON.stringify(answer);
  }

  function printBoard(answer:Move, data:string[]) {
    for (var i = 0; i < data.length; i++) {
      var id = ""+i+"|";
      if (answer.row == i) {
        var row = data[i].substr(0, answer.column) + "💻" + data[i].substr(answer.column+1, data[i].length-answer.column-1);
        console.log(id+row);
      } else {
        console.log(id+data[i]);
      }
    }
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

    var m1 = new Solver(Color.White, 1, 100, Algo.Alphabeta).solve(info.board);
    assertAcceptableAnser(m1, info.acceptableAnwsers, data, "Easy AI");

    var m2 = new Solver(Color.White, 2, 100, Algo.Alphabeta).solve(info.board);
    assertAcceptableAnser(m2, info.acceptableAnwsers, data, "Intermediate AI");

    var m3 = new Solver(Color.White, 3, 100, Algo.Alphabeta).solve(info.board);
    assertAcceptableAnser(m2, info.acceptableAnwsers, data, "Advanced AI");
  }

  export function test2() {
    var data = [".......",
                "..o.o.o",
                "..oxxx.",
                "..oox..",
                "..?xx..",
                "..xx?..",
                ".o..?.."];
    var info = loadBoard(data);

    var m1 = new Solver(Color.White, 1, 100, Algo.Alphabeta).solve(info.board);
    assertAcceptableAnser(m1, info.acceptableAnwsers, data, "Easy AI");

    var m2 = new Solver(Color.White, 2, 100, Algo.Alphabeta).solve(info.board);
    assertAcceptableAnser(m2, info.acceptableAnwsers, data, "Intermediate AI");

    var m3 = new Solver(Color.White, 3, 100, Algo.Alphabeta).solve(info.board);
    assertAcceptableAnser(m2, info.acceptableAnwsers, data, "Advanced AI");
  }

  export function test3() {
    var data = ["........",
                "........",
                "........",
                "...x....",
                "....x...",
                "...?ooo?",
                "......x.",
                "........"];
    var info = loadBoard(data);

    var m1 = new Solver(Color.Black, 1, 100, Algo.Alphabeta).solve(info.board);
    assertAcceptableAnser(m1, info.acceptableAnwsers, data, "Easy AI"); // this test passes, but it makes the wrong move in game!!!

    var m2 = new Solver(Color.Black, 2, 100, Algo.Alphabeta).solve(info.board);
    assertAcceptableAnser(m2, info.acceptableAnwsers, data, "Intermediate AI");

    var m3 = new Solver(Color.Black, 3, 100, Algo.Alphabeta).solve(info.board);
    assertAcceptableAnser(m2, info.acceptableAnwsers, data, "Advanced AI");
  }

  export function test4() {
    var data = ["..xxx...",
                ".....o..",
                ".....o..",
                ".....o..",
                ".....?..",
                ".....o..",
                "........",
                "........"];
    var info = loadBoard(data);

    var m1 = new Solver(Color.Black, 1, 100, Algo.Alphabeta).solve(info.board);
    assertAcceptableAnser(m1, info.acceptableAnwsers, data, "Easy AI"); // this test passes, but it makes the wrong move in game!!!

    var m2 = new Solver(Color.Black, 2, 100, Algo.Alphabeta).solve(info.board);
    assertAcceptableAnser(m2, info.acceptableAnwsers, data, "Intermediate AI");

    var m3 = new Solver(Color.Black, 3, 100, Algo.Alphabeta).solve(info.board);
    assertAcceptableAnser(m2, info.acceptableAnwsers, data, "Advanced AI");
  }

  export function testAll() {
    test1();
    test2();
    test3();
    test4();
  }
}
