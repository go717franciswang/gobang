/// <reference path="./patternScores.ts"/>

module GobangOnline {
  export enum PieceOwnership { None = 0, Mine = 1, Opponent = 2, Root = 3 };

  class Node {
    public children: { [ownership: number]: Node; };
    public score: number;
    public rivalScore: number;

    constructor(public ownership: PieceOwnership) {
      this.children = {};
      this.score = 0;
      this.rivalScore = 0;
    }
  }

  export var root = new Node(PieceOwnership.Root);
  export var maxDepth = 0;

  for (var i = 0; i < patternScore.length; i++) {
    var patternData = patternScore[i];

    for (var j = 0; j < patternData.patterns.length; j++) {
      var pattern: string = patternData.patterns[j];

      var node = root;
      maxDepth = Math.max(maxDepth, pattern.length);
      for (var k = 0; k < pattern.length; k++) {
        var ownership = <PieceOwnership>parseInt(pattern[k]);
        if (!node.children[ownership]) {
          node.children[ownership] = new Node(ownership);
        }

        node = node.children[ownership];
        if (k == pattern.length-1) {
          node.score = patternData.score;
          node.rivalScore = patternData.rivalScore;
        }
      }

      node = root;
      for (var k = pattern.length-1; k >= 0; k--) {
        var ownership = <PieceOwnership>parseInt(pattern[k]);
        if (!node.children[ownership]) {
          node.children[ownership] = new Node(ownership);
        }

        node = node.children[ownership];
        if (k == 0) {
          node.score = patternData.score;
          node.rivalScore = patternData.rivalScore;
        }
      }
    }
  }
}
