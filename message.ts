/// <reference path="./move.ts"/>

module GobangOnline {

  export enum MsgType { TakeTurn, Move, GameOver, NewPlayer, PopupText };

  export interface Message {
    type:MsgType;
    move?:Move;
    winnerColor?:Color;
    text?:string;
  }
}
