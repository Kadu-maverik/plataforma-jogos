const bcrypt = require("bcrypt");

const User = require("../models/User");

const {
    criarToken
} = require("./jwt");



async function login(req,res){


try{


const {
    email,
    senha
}=req.body;



const usuario = await User.findOne({
    email
});



if(!usuario){

return res.status(400).json({

mensagem:"Usuário não encontrado"

});

}



const senhaCorreta =
await bcrypt.compare(
    senha,
    usuario.senha
);



if(!senhaCorreta){

return res.status(400).json({

mensagem:"Senha incorreta"

});

}




const token =
criarToken(usuario);



res.json({

mensagem:"Login realizado",

token,


usuario:{

id:usuario._id,

nome:usuario.nome,

email:usuario.email

}

});



}catch(error){


res.status(500).json({

erro:error.message

});


}


}


module.exports = login;