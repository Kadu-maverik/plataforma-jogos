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

io.to(codigo).emit("roomPlayers", partida.players || []);



});






socket.on("entrarSala", (data) => {

    const codigo = data.roomId;



let partida =
adicionarJogador(
codigo,
{
id:socket.id
}
);



if(!partida){


socket.emit(
"erroSala",
"Sala cheia ou inexistente"
);


return;


}



socket.join(codigo);

io.to(codigo).emit("roomPlayers", partida.players || []);



io.to(codigo).emit("startGame", {
    codigo: codigo
});



});




socket.on(
"disconnect",
()=>{


});


});



}


module.exports=lobbySocket;