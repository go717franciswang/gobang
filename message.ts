module GobangOnline {

  export enum MsgType { GameReady, TakeTurn, Move };

  export interface Message {
    type:MsgType;
  }
}
