class Dama {


constructor(){

this.tabuleiro = this.criarTabuleiro();

this.turno = "branco";

this.fim = false;

}




criarTabuleiro(){


let tab = [];


for(let l=0;l<8;l++){

tab[l]=[];

for(let c=0;c<8;c++){

tab[l][c]=null;

}

}



// pretas

for(let l=0;l<3;l++){

for(let c=0;c<8;c++){


if((l+c)%2!==0){

tab[l][c]="preto";

}


}

}



// brancas

for(let l=5;l<8;l++){

for(let c=0;c<8;c++){


if((l+c)%2!==0){

tab[l][c]="branco";

}


}

}


return tab;


}






mover(origem,destino){



if(this.fim)
return false;



let peca =
this.tabuleiro
[origem.l]
[origem.c];



if(!peca)
return false;



// só mexe a própria cor

if(peca !== this.turno)
return false;



let distanciaL =
Math.abs(
destino.l - origem.l
);



let distanciaC =
Math.abs(
destino.c - origem.c
);




// movimento simples diagonal

if(
distanciaL===1 &&
distanciaC===1 &&
!this.tabuleiro[destino.l][destino.c]
){


this.tabuleiro[destino.l][destino.c]=peca;

this.tabuleiro[origem.l][origem.c]=null;


this.trocarTurno();


this.verificarVitoria();


return true;


}



// captura

if(
distanciaL===2 &&
distanciaC===2
){


let meioL =
(origem.l + destino.l)/2;


let meioC =
(origem.c + destino.c)/2;



let inimigo =
this.tabuleiro[meioL][meioC];



if(
inimigo &&
inimigo!==peca &&
!this.tabuleiro[destino.l][destino.c]
){


this.tabuleiro[destino.l][destino.c]=peca;


this.tabuleiro[origem.l][origem.c]=null;


this.tabuleiro[meioL][meioC]=null;



this.trocarTurno();


this.verificarVitoria();


return true;



}


}



return false;


}






trocarTurno(){


this.turno =
this.turno==="branco"
?
"preto"
:
"branco";


}






verificarVitoria(){


let branco=false;

let preto=false;



for(let l=0;l<8;l++){

for(let c=0;c<8;c++){


if(this.tabuleiro[l][c]==="branco")
branco=true;


if(this.tabuleiro[l][c]==="preto")
preto=true;


}

}



if(!branco || !preto){


this.fim=true;


}



}



}



module.exports=Dama;