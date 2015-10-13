/// <reference path="./move.ts"/>

module GobangOnline {

  export enum MsgType { TakeTurn, Move, GameOver };

  export interface Message {
    type:MsgType;
    move?:Move;
    winnerColor?:Color;
  }
}
