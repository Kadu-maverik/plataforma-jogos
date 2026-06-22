const {
    verificarToken
} = require("../auth/jwt");



function auth(req,res,next){


    try{


        const header =
        req.headers.authorization;



        if(!header){

            return res.status(401).json({

                mensagem:"Sem token"

            });

        }



        const token =
        header.split(" ")[1];



        const usuario =
        verificarToken(token);



        req.usuario = usuario;



        next();



    }catch(error){


        return res.status(401).json({

            mensagem:"Token inválido"

        });


    }


}



module.exports = auth;