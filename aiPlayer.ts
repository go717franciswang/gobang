/// <reference path="./player.ts"/>

class AiPlayer implements Player {
  public color: number;

  constructor() {

  }

  setColor(color: number) {
    this.color = color;
  }

  takeTurn(context: Gobang, lastMove: Move): void {

  }

  badMove(context: Gobang, badMove: Move): void {

  }

  win(): void {

  }

  lose(): void {

  }
}
