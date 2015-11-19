// patterns taken from http://zjh776.iteye.com/blog/1979748
// scores taken from http://cisjournal.org/journalofcomputing/archive/vol3no4/vol3no4_19.pdf
// more patterns http://tieba.baidu.com/p/2180847383

module GobangOnline {
  export var patternScore = [
    {
      name: "连五",
      patterns: [
        "11111"
      ],
      score: 100000,
      rivalScore: 10000
    },
    {
      name: "活四",
      patterns: [
        "011110"
      ],
      score: 5000,
      rivalScore: 2100
    },
    {
      name: "冲四",
      patterns: [
        "011112",
        "10111",
        "11011"
      ],
      score: 2101,
      rivalScore: 1800
    },
    {
      name: "活三",
      patterns: [
        "01110",
        "010110"
      ],
      score: 1800,
      rivalScore: 1200
    },
    {
      name: "眠三",
      patterns: [
        "001112",
        "010112",
        "011012",
        "0100110",
        "0101010",
        "2011102"
      ],
      score: 600,
      rivalScore: 480
    },
    {
      name: "活二",
      patterns: [
        "001100",
        "01010",
        "010010"
      ],
      score: 300,
      rivalScore: 240
    },
    {
      name: "眠二",
      patterns: [
        "000112",
        "001012",
        "010012",
        "0100010",
        "2010102",
        "2011002"
      ],
      score: 100,
      rivalScore: 80
    },
  ];

  // http://zjh776.iteye.com/blog/1979748
  var alternativeScore = [
    {
      "patternNames": { "连五": 1 },
      "score": 100000
    },
    {
      "patternNames": { "活四": 1 },
      "score": 10000
    },
    {
      "patternNames": { "冲四": 2 },
      "score": 10000
    },
    {
      "patternNames": { "冲四": 1, "活三": 1 },
      "score": 10000
    },
    {
      "patternNames": { "冲四": 1 },
      "score": 8000
    },
    {
      "patternNames": { "活三": 2 },
      "score": 5000
    },
    {
      "patternNames": { "活三": 1, "眠三": 1 },
      "score": 1000
    },
    {
      "patternNames": { "活三": 1 },
      "score": 800
    },
    {
      "patternNames": { "活二": 2 },
      "score": 100
    },
    {
      "patternNames": { "眠三": 1 },
      "score": 50
    },
    {
      "patternNames": { "活二": 1, "眠二": 1 },
      "score": 10
    },
    {
      "patternNames": { "活二": 1 },
      "score": 5
    },
    {
      "patternNames": { "眠二": 1 },
      "score": 3
    },
  ];

  console.log(alternativeScore);

  function countPatternNames(patterNames:string[]) {
    var count = {};
    for (var i = 0; i < patterNames.length; i++) {
      var name = patterNames[i];
      if (count[name] == undefined) {
        count[name] = 0;
      }

      count[name] += 1;
    }

    return count;
  }

  function isPatternSubset(subsetPatterns, parentPatterns) {
    for (var name in subsetPatterns) {
      if (parentPatterns[name] == undefined || parentPatterns[name] < subsetPatterns[name]) {
        return false;
      }
    }

    return true;
  }

  export function alternativePatternsToScore(patternNames:string[]) {

    var count = countPatternNames(patternNames);

    for (var i = 0; i < alternativeScore.length; i++) {
      if (isPatternSubset(alternativeScore[i].patternNames, count)) {
        return alternativeScore[i].score;
      }
    }

    return 0;
  }
}
