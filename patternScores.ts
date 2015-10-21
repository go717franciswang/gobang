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
        "00110",
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
  export var alternativeScore = [
    {
      "patternNames": ["长连"],
      "score": 100000
    },
    {
      "patternNames": ["活四"],
      "score": 10000
    },
    {
      "patternNames": ["冲四", "冲四"],
      "score": 10000
    },
    {
      "patternNames": ["冲四", "活三"],
      "score": 10000
    },
    {
      "patternNames": ["活三", "活三"],
      "score": 5000
    },
    {
      "patternNames": ["活三", "眠三"],
      "score": 1000
    },
    {
      "patternNames": ["冲四"],
      "score": 500
    },
    {
      "patternNames": ["活三"],
      "score": 200
    },
    {
      "patternNames": ["活二", "活二"],
      "score": 100
    },
    {
      "patternNames": ["眠三"],
      "score": 50
    },
    {
      "patternNames": ["活二", "眠二"],
      "score": 10
    },
    {
      "patternNames": ["活二"],
      "score": 5
    },
    {
      "patternNames": ["眠二"],
      "score": 3
    },
  ];
}
