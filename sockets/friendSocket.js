module.exports = (io) => {
    io.on("connection", (socket) => {
        console.log("👥 Friend system conectado:", socket.id);

        // enviar pedido de amizade
        socket.on("friend:request", (data) => {
            io.emit("friend:request", {
                from: socket.id,
                to: data.to
            });
        });

        // aceitar pedido
        socket.on("friend:accept", (data) => {
            io.emit("friend:accepted", {
                from: socket.id,
                to: data.to
            });
        });

        socket.on("disconnect", () => {
            console.log("👥 Friend system saiu:", socket.id);
        });
    });
};