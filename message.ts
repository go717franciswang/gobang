/// <reference path="./move.ts"/>

module GobangOnline {

  export enum MsgType { TakeTurn, Move, GameOver, NewPlayer, PopupText, Timer };

  export interface Message {
    type:MsgType;
    move?:Move;
    moveId?:number;
    winnerColor?:Color;
    text?:string;
    milliSecLeft?:number;
    color?:Color;
  }
}
