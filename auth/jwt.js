const jwt = require("jsonwebtoken");


function criarToken(usuario){


    return jwt.sign(

        {
            id:usuario._id,
            email:usuario.email

        },

        process.env.JWT_SECRET,

        {
            expiresIn:"7d"
        }

    );


}



function verificarToken(token){


    return jwt.verify(

        token,

        process.env.JWT_SECRET

    );


}



module.exports = {

    criarToken,

    verificarToken

};