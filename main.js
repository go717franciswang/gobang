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
        if (this.isWinningMove(move, player)) {
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
    Gobang.prototype.isWinningMove = function (move, player) {
        var directions = [[0, 1], [1, 0], [1, 1], [-1, 1]];
        for (var i = 0; i < directions.length; i++) {
            var dx = directions[i][0];
            var dy = directions[i][1];
            var run = 1;
            var m = 1;
            while (move.column + dx * m >= 0
                && move.column + dx * m < this.size
                && move.row + dy * m >= 0
                && move.row + dy * m < this.size
                && this.board[move.row + dy * m][move.column + dx * m] == player.color) {
                run++;
                m++;
            }
            var m = -1;
            while (move.column + dx * m >= 0
                && move.column + dx * m < this.size
                && move.row + dy * m >= 0
                && move.row + dy * m < this.size
                && this.board[move.row + dy * m][move.column + dx * m] == player.color) {
                run++;
                m--;
            }
            if (run >= 5) {
                return true;
            }
        }
        return false;
    };
    return Gobang;
})();
