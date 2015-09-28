// patterns taken from http://zjh776.iteye.com/blog/1979748
// scores taken from http://cisjournal.org/journalofcomputing/archive/vol3no4/vol3no4_19.pdf

var gobangPatternScore = [
  {
    name: "长连",
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
    rivalScore: 3000
  },
  {
    name: "冲四",
    patterns: [
      "011112",
      "0101110",
      "0110110"
    ],
    score: 2100,
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
      "10011",
      "10101",
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
      "10001",
      "2010102",
      "2011002"
    ],
    score: 100,
    rivalScore: 80
  },
]
