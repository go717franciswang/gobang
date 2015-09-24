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
    var SinglePlayer = (function (_super) {
        __extends(SinglePlayer, _super);
        function SinglePlayer() {
            _super.apply(this, arguments);
        }
        SinglePlayer.prototype.create = function () {
            this.board = this.add.sprite(this.game.width / 2, this.game.height / 2, 'board');
            this.board.anchor.setTo(0.5, 0.5);
            var scale = this.game.height / this.board.height;
            this.board.scale.setTo(scale, scale);
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
            if (this.game.input.activePointer.isDown) {
                var move = this.position2move(this.game.input.activePointer);
                if (this.isMoveValid(move)) {
                    var pos = this.move2position(move);
                    var piece = this.add.sprite(pos.x, pos.y, 'piece');
                    piece.anchor.setTo(0.5, 0.5);
                    piece.scale.setTo(0.12);
                }
            }
        };
        SinglePlayer.prototype.isMoveValid = function (move) {
            return move.row >= 0 && move.row < 16 && move.column >= 0 && move.column < 16;
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
var EMPTY = 0;
var BLACK = 1;
var WHITE = 2;
var Gobang = (function () {
    function Gobang(size, player1, player2) {
        this.size = size;
        this.player1 = player1;
        this.player2 = player2;
        this.board = [];
        for (var i = 0; i < size; i++) {
            this.board[i] = [];
            for (var j = 0; j < size; j++) {
                this.board[i][j] = EMPTY;
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
        this.pendingPlayer.setColor(BLACK);
        this.nonPendingPlayer.setColor(WHITE);
        this.pendingPlayer.takeTurn(this, null);
    }
    Gobang.prototype.registerMove = function (player, move) {
        if (player != this.pendingPlayer) {
            return;
        }
        if (this.board[move.row][move.column] != EMPTY) {
            player.badMove(this, move);
            return;
        }
        this.board[move.row][move.column] = player.color;
        if (this.isGameOver(player)) {
            player.win();
            this.nonPendingPlayer.lose();
        }
        this.swapPlayingPendingState();
        this.pendingPlayer.takeTurn(this, move);
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
            while (r < this.size || c < this.size) {
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
            while (r >= 0 || c < this.size) {
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
    return Gobang;
})();
