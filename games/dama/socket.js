const Dama = require("./engine");


const partidas = {};
const jogadores = {};



function damaSocket(io){


io.on("connection",(socket)=>{


console.log(
"Jogador dama conectado:",
socket.id
);



socket.on(
"entrarDama",
(sala)=>{


socket.join(sala);



if(!jogadores[sala]){

jogadores[sala]=[];

}



if(jogadores[sala].length >= 2){


socket.emit(
"erroDama",
"Sala cheia"
);


return;

}



let cor =
jogadores[sala].length === 0
?
"branco"
:
"preto";




jogadores[sala].push({

id:socket.id,

cor:cor

});




if(!partidas[sala]){


partidas[sala]=new Dama();


}




socket.emit(
"suaCor",
cor
);





io.to(sala).emit(
"quantidadeJogadores",
jogadores[sala].length
);





if(jogadores[sala].length === 2){


io.to(sala).emit(
"jogadoresProntos",
{
codigo:sala
}
);



io.to(sala).emit(
"estadoDama",
partidas[sala]
);



}



});







socket.on(
"movimentoDama",
(data)=>{


let jogo =
partidas[data.sala];



if(!jogo)
return;




let jogador =
jogadores[data.sala]
.find(
j=>j.id===socket.id
);



if(!jogador)
return;





if(jogo.turno !== jogador.cor){


socket.emit(
"erroDama",
"Não é sua vez"
);


return;

}





let sucesso =
jogo.mover(
data.origem,
data.destino
);




if(sucesso){


io.to(data.sala)
.emit(
"estadoDama",
jogo
);



}




});






socket.on(
"disconnect",
()=>{


for(let sala in jogadores){


jogadores[sala] =
jogadores[sala]
.filter(
j=>j.id !== socket.id
);



}



});




});


}



module.exports = damaSocket;