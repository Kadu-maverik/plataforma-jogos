const partidas = {};


function criarPartida(id,sala,jogo){

partidas[sala]={

id:id,

jogo:jogo,

jogadores:[],

estado:"esperando",

criada:new Date()

};


return partidas[sala];

}



function adicionarJogador(sala,jogador){


let partida = partidas[sala];


if(!partida)
return false;



if(partida.jogadores.length >= 2){

return false;

}



partida.jogadores.push(jogador);



if(partida.jogadores.length===2){

partida.estado="em_andamento";

}



return partida;


}




function removerJogador(sala,id){


if(!partidas[sala])
return;



partidas[sala].jogadores =
partidas[sala]
.jogadores
.filter(
j=>j.id!==id
);



if(partidas[sala].jogadores.length===0){

delete partidas[sala];

}



}



function pegarPartida(sala){

return partidas[sala];

}



module.exports={

criarPartida,

adicionarJogador,

removerJogador,

pegarPartida

};