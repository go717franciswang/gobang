///<reference path="./move.ts" />

interface Player {
  color: number;
  setColor(color: number): void;
  takeTurn(context: Gobang, lastMove: Move): void;
  makeMove?(move:Move):void;
  send?(msg:Message):void;
  badMove(context: Gobang, badMove: Move): void;
  win(): void;
  lose(): void;
}
