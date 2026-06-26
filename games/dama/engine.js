/**
 * ENGINE DO JOGO DE DAMA
 * Apenas regras do jogo (sem socket, sem DB, sem API)
 */

class DamaEngine {
    constructor() {
        this.board = this.createBoard();
        this.currentPlayer = "white"; // white começa
        this.gameOver = false;
    }

    /**
     * Cria tabuleiro 8x8
     * null = casa vazia
     * white = peça branca
     * black = peça preta
     */
    createBoard() {
        const board = Array(8).fill(null).map(() => Array(8).fill(null));

        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 8; col++) {
                if ((row + col) % 2 === 1) {
                    board[row][col] = "black";
                }
            }
        }

        for (let row = 5; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                if ((row + col) % 2 === 1) {
                    board[row][col] = "white";
                }
            }
        }

        return board;
    }

    /**
     * Verifica se posição está dentro do tabuleiro
     */
    inBounds(x, y) {
        return x >= 0 && x < 8 && y >= 0 && y < 8;
    }

    /**
     * Obtém peça numa posição
     */
    getPiece(x, y) {
        if (!this.inBounds(x, y)) return null;
        return this.board[x][y];
    }

    /**
     * Move peça (regra principal)
     */
    movePiece(fromX, fromY, toX, toY) {
        if (this.gameOver) return { error: "Jogo terminou" };

        const piece = this.getPiece(fromX, fromY);

        if (!piece) return { error: "Não existe peça nessa posição" };
        if (piece !== this.currentPlayer) return { error: "Não é tua vez" };

        const target = this.getPiece(toX, toY);
        if (target !== null) return { error: "Casa ocupada" };

        const dx = toX - fromX;
        const dy = toY - fromY;

        // movimento simples
        if (Math.abs(dx) === 1 && Math.abs(dy) === 1) {
            return this.simpleMove(fromX, fromY, toX, toY);
        }

        // captura
        if (Math.abs(dx) === 2 && Math.abs(dy) === 2) {
            return this.captureMove(fromX, fromY, toX, toY);
        }

        return { error: "Movimento inválido" };
    }

    /**
     * Movimento simples
     */
    simpleMove(fromX, fromY, toX, toY) {
        const piece = this.board[fromX][fromY];

        if (!this.isValidDirection(piece, fromX, toX)) {
            return { error: "Movimento inválido para esta peça" };
        }

        this.board[toX][toY] = piece;
        this.board[fromX][fromY] = null;

        this.switchTurn();
        return { success: true, board: this.board };
    }

    /**
     * Captura de peça adversária
     */
    captureMove(fromX, fromY, toX, toY) {
        const midX = (fromX + toX) / 2;
        const midY = (fromY + toY) / 2;

        const piece = this.board[fromX][fromY];
        const enemy = this.board[midX][midY];

        if (!enemy || enemy === piece) {
            return { error: "Não há peça adversária para capturar" };
        }

        this.board[toX][toY] = piece;
        this.board[fromX][fromY] = null;
        this.board[midX][midY] = null;

        this.switchTurn();
        return { success: true, board: this.board };
    }

    /**
     * Direção válida (peças normais só andam para frente)
     */
    isValidDirection(piece, fromX, toX) {
        if (piece === "white") {
            return toX < fromX; // sobe
        }
        if (piece === "black") {
            return toX > fromX; // desce
        }
        return false;
    }

    /**
     * Troca turno
     */
    switchTurn() {
        this.currentPlayer = this.currentPlayer === "white" ? "black" : "white";
        this.checkGameOver();
    }

    /**
     * Verifica fim do jogo
     */
    checkGameOver() {
        let whiteExists = false;
        let blackExists = false;

        for (let row of this.board) {
            for (let cell of row) {
                if (cell === "white") whiteExists = true;
                if (cell === "black") blackExists = true;
            }
        }

        if (!whiteExists || !blackExists) {
            this.gameOver = true;
        }
    }

    /**
     * Estado atual do jogo
     */
    getState() {
        return {
            board: this.board,
            currentPlayer: this.currentPlayer,
            gameOver: this.gameOver
        };
    }
}

module.exports = DamaEngine;