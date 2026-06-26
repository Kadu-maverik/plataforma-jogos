module.exports = (io) => {
    io.on("connection", (socket) => {
        console.log("💬 Chat conectado:", socket.id);

        // receber mensagem do jogador
        socket.on("chat:message", (data) => {
            // envia para todos os jogadores
            io.emit("chat:message", {
                id: socket.id,
                message: data.message,
                user: data.user
            });
        });

        socket.on("disconnect", () => {
            console.log("💬 Chat saiu:", socket.id);
        });
    });
};