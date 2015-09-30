var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var GobangOnline;
(function (GobangOnline) {
    var Boot = (function (_super) {
        __extends(Boot, _super);
        function Boot() {
            _super.apply(this, arguments);
        }
        Boot.prototype.preload = function () {
            this.load.image('preloadBar', 'assets/loader.png');
        };
        Boot.prototype.create = function () {
            this.game.state.start('Preloader', true, false);
        };
        return Boot;
    })(Phaser.State);
    GobangOnline.Boot = Boot;
})(GobangOnline || (GobangOnline = {}));
var GobangOnline;
(function (GobangOnline) {
    var Preloader = (function (_super) {
        __extends(Preloader, _super);
        function Preloader() {
            _super.apply(this, arguments);
        }
        Preloader.prototype.preload = function () {
            this.preloadBar = this.add.sprite(200, 250, 'preloadBar');
            this.load.setPreloadSprite(this.preloadBar);
            this.load.image('menu', 'assets/menu.jpg');
            this.load.image('singlePlayerButton', 'assets/Play-button.gif');
            this.load.image('board', 'assets/board.jpg');
            this.load.spritesheet('piece', 'assets/pieces.png', 289, 289, 2);
        };
        Preloader.prototype.create = function () {
            var tween = this.add.tween(this.preloadBar).to({ alpha: 0 }, 1000, Phaser.Easing.Linear.None, true);
            tween.onComplete.add(this.startMainMenu, this);
        };
        Preloader.prototype.startMainMenu = function () {
            this.game.state.start('MainMenu', true, false);
        };
        return Preloader;
    })(Phaser.State);
    GobangOnline.Preloader = Preloader;
})(GobangOnline || (GobangOnline = {}));
var GobangOnline;
(function (GobangOnline) {
    var MainMenu = (function (_super) {
        __extends(MainMenu, _super);
        function MainMenu() {
            _super.apply(this, arguments);
        }
        MainMenu.prototype.create = function () {
            var _this = this;
            this.background = this.add.sprite(0, 0, 'menu');
            this.background.alpha = 0;
            this.background.scale.x = this.game.width / this.background.width;
            this.background.scale.y = this.game.height / this.background.height;
            this.add.tween(this.background).to({ alpha: 1.0 }, 2000, Phaser.Easing.Bounce.InOut, true);
            this.singlePlayerButton = this.add.sprite(this.game.width / 2, this.game.height / 2, 'singlePlayerButton');
            this.singlePlayerButton.anchor.setTo(0.5, 0.5);
            this.singlePlayerButton.inputEnabled = true;
            this.singlePlayerButton.events.onInputDown.add(function () {
                _this.game.state.start('SinglePlayer');
            }, this);
        };
        return MainMenu;
    })(Phaser.State);
    GobangOnline.MainMenu = MainMenu;
})(GobangOnline || (GobangOnline = {}));
var GobangOnline;
(function (GobangOnline) {
    (function (Color) {
        Color[Color["Empty"] = 0] = "Empty";
        Color[Color["Black"] = 1] = "Black";
        Color[Color["White"] = 2] = "White";
    })(GobangOnline.Color || (GobangOnline.Color = {}));
    var Color = GobangOnline.Color;
    ;
    var Gobang = (function () {
        function Gobang(size, player1, player2) {
            this.size = size;
            this.player1 = player1;
            this.player2 = player2;
            this.gameOver = false;
            this.board = [];
            for (var i = 0; i < size; i++) {
                this.board[i] = [];
                for (var j = 0; j < size; j++) {
                    this.board[i][j] = Color.Empty;
                }
            }
            if (Math.floor(Math.random() * 2) == 0) {
                this.pendingPlayer = player1;
                this.nonPendingPlayer = player2;
            }
            else {
                this.nonPendingPlayer = player1;
                this.pendingPlayer = player2;
            }
            this.pendingPlayer.setColor(Color.Black);
            this.nonPendingPlayer.setColor(Color.White);
        }
        Gobang.prototype.startGame = function () {
            this.pendingPlayer.takeTurn(this, null);
        };
        Gobang.prototype.setOnRegisterMove = function (callback) {
            this.onRegisterMove = callback;
        };
        Gobang.prototype.registerMove = function (player, move) {
            if (this.gameOver || player != this.pendingPlayer) {
                return;
            }
            if (this.board[move.row][move.column] != Color.Empty) {
                player.badMove(this, move);
                return;
            }
            this.board[move.row][move.column] = player.color;
            if (this.isGameOver(player)) {
                this.gameOver = true;
                player.win();
                this.nonPendingPlayer.lose();
            }
            this.swapPlayingPendingState();
            this.pendingPlayer.takeTurn(this, move);
            this.onRegisterMove(player, move);
        };
        Gobang.prototype.swapPlayingPendingState = function () {
            var tmp = this.pendingPlayer;
            this.pendingPlayer = this.nonPendingPlayer;
            this.nonPendingPlayer = tmp;
        };
        Gobang.prototype.isGameOver = function (checkPlayer) {
            var run;
            for (var i = 0; i < this.size; i++) {
                run = 0;
                for (var j = 0; j < this.size; j++) {
                    if (this.board[i][j] == checkPlayer.color) {
                        run++;
                    }
                    else {
                        run = 0;
                    }
                    if (run == 5) {
                        return true;
                    }
                }
            }
            for (var i = 0; i < this.size; i++) {
                run = 0;
                for (var j = 0; j < this.size; j++) {
                    if (this.board[j][i] == checkPlayer.color) {
                        run++;
                    }
                    else {
                        run = 0;
                    }
                    if (run == 5) {
                        return true;
                    }
                }
            }
            for (var i = 0; i < (this.size - 4) * 2 - 1; i++) {
                run = 0;
                var r = Math.max(this.size - 5 - i, 0);
                var c = Math.max(i - (this.size - 5), 0);
                while (r < this.size && c < this.size) {
                    if (this.board[r][c] == checkPlayer.color) {
                        run++;
                    }
                    else {
                        run = 0;
                    }
                    if (run == 5) {
                        return true;
                    }
                    r++;
                    c++;
                }
            }
            for (var i = 0; i < (this.size - 4) * 2 - 1; i++) {
                run = 0;
                var r = Math.min(i + 4, this.size - 1);
                var c = Math.max(i - (this.size - 5), 0);
                while (r >= 0 && c < this.size) {
                    if (this.board[r][c] == checkPlayer.color) {
                        run++;
                    }
                    else {
                        run = 0;
                    }
                    if (run == 5) {
                        return true;
                    }
                    r--;
                    c++;
                }
            }
            return false;
        };
        Gobang.prototype.isMoveValid = function (move) {
            return move.row >= 0
                && move.row < this.size
                && move.column >= 0
                && move.column < this.size
                && this.board[move.row][move.column] == Color.Empty;
        };
        return Gobang;
    })();
    GobangOnline.Gobang = Gobang;
})(GobangOnline || (GobangOnline = {}));
var GobangOnline;
(function (GobangOnline) {
    var HumanPlayer = (function () {
        function HumanPlayer() {
            this.takingTurn = false;
        }
        HumanPlayer.prototype.setColor = function (color) {
            this.color = color;
        };
        HumanPlayer.prototype.takeTurn = function (context, lastMove) {
            this.takingTurn = true;
            this.context = context;
        };
        HumanPlayer.prototype.makeMove = function (move) {
            this.takingTurn = false;
            this.context.registerMove(this, move);
        };
        HumanPlayer.prototype.badMove = function (context, badMove) {
        };
        HumanPlayer.prototype.win = function () {
            console.log('human wins');
        };
        HumanPlayer.prototype.lose = function () {
        };
        return HumanPlayer;
    })();
    GobangOnline.HumanPlayer = HumanPlayer;
})(GobangOnline || (GobangOnline = {}));
var GobangOnline;
(function (GobangOnline) {
    var AiPlayer = (function () {
        function AiPlayer() {
        }
        AiPlayer.prototype.setColor = function (color) {
            this.color = color;
        };
        AiPlayer.prototype.takeTurn = function (context, lastMove) {
            var availableMoves = [];
            for (var i = 0; i < context.size; i++) {
                for (var j = 0; j < context.size; j++) {
                    if (context.board[i][j] == GobangOnline.Color.Empty) {
                        availableMoves.push({ row: i, column: j });
                    }
                }
            }
            var randIdx = Math.floor(Math.random() * availableMoves.length);
            context.registerMove(this, availableMoves[randIdx]);
        };
        AiPlayer.prototype.badMove = function (context, badMove) {
        };
        AiPlayer.prototype.win = function () {
        };
        AiPlayer.prototype.lose = function () {
        };
        return AiPlayer;
    })();
    GobangOnline.AiPlayer = AiPlayer;
})(GobangOnline || (GobangOnline = {}));
var GobangOnline;
(function (GobangOnline) {
    var SinglePlayer = (function (_super) {
        __extends(SinglePlayer, _super);
        function SinglePlayer() {
            _super.apply(this, arguments);
        }
        SinglePlayer.prototype.create = function () {
            var _this = this;
            this.board = this.add.sprite(this.game.width / 2, this.game.height / 2, 'board');
            this.board.anchor.setTo(0.5, 0.5);
            var scale = this.game.height / this.board.height;
            this.board.scale.setTo(scale, scale);
            this.humanPlayer = new GobangOnline.HumanPlayer();
            this.aiPlayer = new GobangOnline.AiPlayer();
            this.engine = new GobangOnline.Gobang(16, this.humanPlayer, this.aiPlayer);
            this.engine.setOnRegisterMove(function (player, move) {
                var pos = _this.move2position(move);
                var piece = _this.add.sprite(pos.x, pos.y, 'piece');
                if (player.color == GobangOnline.Color.White) {
                    piece.frame = 1;
                }
                piece.anchor.setTo(0.5, 0.5);
                piece.scale.setTo(0.12);
            });
            this.engine.startGame();
        };
        SinglePlayer.prototype.move2position = function (move) {
            return {
                x: move.column * 525 / 15 + 135,
                y: move.row * 525 / 15 + 35
            };
        };
        SinglePlayer.prototype.position2move = function (position) {
            return {
                row: Math.round((position.y - 35) / (525 / 15)),
                column: Math.round((position.x - 135) / (525 / 15))
            };
        };
        SinglePlayer.prototype.update = function () {
            if (this.humanPlayer.takingTurn) {
                if (this.game.input.activePointer.isDown) {
                    var move = this.position2move(this.game.input.activePointer);
                    if (this.engine.isMoveValid(move)) {
                        this.humanPlayer.makeMove(move);
                    }
                }
            }
        };
        return SinglePlayer;
    })(Phaser.State);
    GobangOnline.SinglePlayer = SinglePlayer;
})(GobangOnline || (GobangOnline = {}));
var GobangOnline;
(function (GobangOnline) {
    var Game = (function (_super) {
        __extends(Game, _super);
        function Game() {
            _super.call(this, 800, 600, Phaser.AUTO, 'content', null);
            this.state.add('Boot', GobangOnline.Boot, false);
            this.state.add('Preloader', GobangOnline.Preloader, false);
            this.state.add('MainMenu', GobangOnline.MainMenu, false);
            this.state.add('SinglePlayer', GobangOnline.SinglePlayer, false);
            this.state.start('Boot');
        }
        return Game;
    })(Phaser.Game);
    GobangOnline.Game = Game;
})(GobangOnline || (GobangOnline = {}));
window.onload = function () {
    var game = new GobangOnline.Game();
};
var GobangOnline;
(function (GobangOnline) {
    GobangOnline.patternScore = [
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
    ];
})(GobangOnline || (GobangOnline = {}));
var GobangOnline;
(function (GobangOnline) {
    var PieceOwnership;
    (function (PieceOwnership) {
        PieceOwnership[PieceOwnership["None"] = 0] = "None";
        PieceOwnership[PieceOwnership["Mine"] = 1] = "Mine";
        PieceOwnership[PieceOwnership["Opponent"] = 2] = "Opponent";
        PieceOwnership[PieceOwnership["Root"] = 3] = "Root";
    })(PieceOwnership || (PieceOwnership = {}));
    ;
    var Node = (function () {
        function Node(ownership) {
            this.ownership = ownership;
            this.children = {};
            this.score = 0;
            this.rivalScore = 0;
        }
        return Node;
    })();
    GobangOnline.root = new Node(PieceOwnership.Root);
    for (var i = 0; i < GobangOnline.patternScore.length; i++) {
        var patternData = GobangOnline.patternScore[i];
        for (var j = 0; j < patternData.patterns.length; j++) {
            var pattern = patternData.patterns[j];
            var node = GobangOnline.root;
            for (var k = 0; k < pattern.length; k++) {
                var ownership = parseInt(pattern[k]);
                if (!node.children[ownership]) {
                    node.children[ownership] = new Node(ownership);
                }
                node = node.children[ownership];
                if (k == pattern.length - 1) {
                    node.score = patternData.score;
                    node.rivalScore = patternData.rivalScore;
                }
            }
            node = GobangOnline.root;
            for (var k = pattern.length - 1; k >= 0; k--) {
                var ownership = parseInt(pattern[k]);
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
})(GobangOnline || (GobangOnline = {}));
