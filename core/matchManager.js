const {

criarPartida,
adicionarJogador,
pegarPartida

}=require("../core/matchManager");



function lobbySocket(io){


io.on("connection",(socket)=>{



socket.on(
"criarSala",
(data)=>{


let codigo =
Math.random()
.toString(36)
.substring(2,8)
.toUpperCase();



let partida =
criarPartida(
socket.id,
codigo,
data?.jogo || "dama"
);



adicionarJogador(
codigo,
{
id:socket.id
}
);



socket.join(codigo);



socket.emit("salaCriada", codigo);

io.to(codigo).emit("roomPlayers", partida.jogadores || []);



});






socket.on("entrarSala", (data) => {

    const codigo = data.roomId;


let partida = pegarPartida(codigo);

if (!partida) {
    socket.emit("erroSala", "Sala não existe");
    return;
}

if (partida.jogadores && partida.jogadores.length >= 2) {
    socket.emit("erroSala", "Sala cheia");
    return;
}

partida = adicionarJogador(codigo, {
    id: socket.id
});



socket.join(codigo);

io.to(codigo).emit("roomPlayers", partida.jogadores || []);


if (partida.jogadores && partida.jogadores.length === 2) {
    io.to(codigo).emit("startGame", {
        codigo: codigo
    });
}



});




socket.on(
"disconnect",
()=>{


});



});



}


module.exports=lobbySocket;