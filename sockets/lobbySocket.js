const {
    criarPartida,
    adicionarJogador,
    pegarPartida
} = require("../core/matchManager");

function lobbySocket(io, socket) {

    socket.on("criarSala", (data) => {

        let codigo =
            Math.random()
                .toString(36)
                .substring(2, 8)
                .toUpperCase();

        let partida = criarPartida(
            socket.id,
            codigo,
            data?.jogo || "dama"
        );

        adicionarJogador(codigo, {
            id: socket.id
        });

        socket.join(codigo);

        socket.emit("salaCriada", codigo);

        io.to(codigo).emit("roomPlayers", partida.players || []);
    });

    socket.on("entrarSala", (data) => {

        const codigo = data.roomId;

        let partida = pegarPartida(codigo);

        if (!partida) {
            socket.emit("erroSala", "Sala não existe");
            return;
        }

        if (partida.players && partida.players.length >= 2) {
            socket.emit("erroSala", "Sala cheia");
            return;
        }

        adicionarJogador(codigo, {
            id: socket.id
        });

        partida = pegarPartida(codigo);

        socket.join(codigo);

        io.to(codigo).emit("roomPlayers", partida.players || []);

        if (partida.players && partida.players.length === 2) {
            io.to(codigo).emit("startGame", {
                codigo: codigo
            });
        }
    });

    socket.on("disconnect", () => {
        // aqui depois ligamos ao matchManager
    });

}

module.exports = lobbySocket;