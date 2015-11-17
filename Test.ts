/// <reference path="./board.ts"/>
///<reference path="./move.ts" />

module GobangOnline {
  // load board from string representation, where 0 represent none, 1 represents black, and 2 represents white
  export function loadBoard(data: string): Board {
    var rows = data.split("\n");
    var size = rows.length;
    var board = new Board(size);
    for (var i = 0; i < size; i++) {
      var row = rows[i].trim();

      for (var j = 0; j < size; j++) {
        if (row[j] == "1") {
          board.setColorAt({row: i, column: j}, Color.Black);
        } else if (row[j] == "2") {
          board.setColorAt({row: i, column: j}, Color.White);
        }
      }
    }

    return board;
  }
}
