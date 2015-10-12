/// <reference path="./move.ts"/>

module GobangOnline {

  export enum MsgType { TakeTurn, Move };

  export interface Message {
    type:MsgType;
    move?:Move;
  }
}
