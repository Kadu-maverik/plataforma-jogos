const {
    criarPartida,
    adicionarJogador,
    pegarPartida
} = require("../core/matchManager");

function lobbySocket(io) {

    io.on("connection", (socket) => {

        console.log("Socket conectado:", socket.id);

        // CRIAR SALA
        socket.on("criarSala", (data) => {

            const codigo = Math.random()
                .toString(36)
                .substring(2, 8)
                .toUpperCase();

            criarPartida(socket.id, codigo, data?.jogo || "dama");

            adicionarJogador(codigo, { id: socket.id });

            socket.join(codigo);

            socket.emit("salaCriada", codigo);
        });

        // ENTRAR SALA
        socket.on("entrarSala", (codigo) => {

            const partida = pegarPartida(codigo);

            if (!partida) {
                socket.emit("erroSala", "Sala inexistente");
                return;
            }

            adicionarJogador(codigo, { id: socket.id });

            socket.join(codigo);

            io.to(codigo).emit("jogadoresProntos", {
                codigo
            });
        });

        // DISCONNECT
        socket.on("disconnect", () => {
            console.log("Socket saiu:", socket.id);
        });

    });
}

module.exports = lobbySocket;