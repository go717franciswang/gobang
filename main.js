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
