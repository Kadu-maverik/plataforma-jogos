// games/dama/socket.js

const DamaEngine = require('./engine');
const matchManager = require('../../core/matchManager');

/**
 * Regista os eventos do jogo de Dama para um socket específico
 * @param {Server} io
 * @param {Socket} socket
 */
function registerDamaSocket(io, socket) {

    /**
     * 🎯 Entrar numa partida de dama
     */
    socket.on('dama:joinMatch', ({ matchId, userId }) => {
        try {
            const match = matchManager.getMatch(matchId);

            if (!match) {
                return socket.emit('dama:error', { message: 'Partida não encontrada' });
            }

            socket.join(matchId);

            // Associa socket ao jogador
            matchManager.attachSocket(matchId, userId, socket.id);

            // Se o jogo ainda não iniciou, inicia engine
            if (!match.engine) {
                match.engine = new DamaEngine(match.players);
            }

            io.to(matchId).emit('dama:state', {
                board: match.engine.getBoard(),
                turn: match.engine.getCurrentPlayer()
            });

        } catch (err) {
            console.error(err);
            socket.emit('dama:error', { message: 'Erro ao entrar na partida' });
        }
    });

    /**
     * ♟️ Jogada
     */
    socket.on('dama:move', ({ matchId, from, to, userId }) => {
        try {
            const match = matchManager.getMatch(matchId);

            if (!match || !match.engine) {
                return socket.emit('dama:error', { message: 'Partida inválida' });
            }

            // Valida se é o jogador certo
            if (!match.engine.isPlayerTurn(userId)) {
                return socket.emit('dama:error', { message: 'Não é o teu turno' });
            }

            // Executa jogada no engine
            const result = match.engine.move(from, to);

            if (!result.success) {
                return socket.emit('dama:error', { message: result.message });
            }

            // Atualiza estado para todos
            io.to(matchId).emit('dama:update', {
                board: match.engine.getBoard(),
                turn: match.engine.getCurrentPlayer(),
                lastMove: { from, to }
            });

            /**
             * 🏁 Verifica fim de jogo
             */
            if (match.engine.isGameOver()) {
                const winner = match.engine.getWinner();

                io.to(matchId).emit('dama:gameOver', {
                    winner
                });

                // Guarda resultado no sistema
                matchManager.finishMatch(matchId, winner);
            }

        } catch (err) {
            console.error(err);
            socket.emit('dama:error', { message: 'Erro ao processar jogada' });
        }
    });

    /**
     * 🚪 Sair da partida
     */
    socket.on('dama:leave', ({ matchId, userId }) => {
        try {
            socket.leave(matchId);

            matchManager.removePlayer(matchId, userId);

            io.to(matchId).emit('dama:playerLeft', {
                userId
            });

        } catch (err) {
            console.error(err);
        }
    });

    /**
     * ❌ Desconexão
     */
    socket.on('disconnect', () => {
        try {
            const matchId = matchManager.findMatchBySocket(socket.id);

            if (!matchId) return;

            const userId = matchManager.getUserBySocket(socket.id);

            matchManager.removePlayer(matchId, userId);

            io.to(matchId).emit('dama:playerDisconnected', {
                userId
            });

        } catch (err) {
            console.error(err);
        }
    });
}

module.exports = registerDamaSocket;