const bcrypt = require("bcrypt");
const User = require("../models/User");


async function register(req,res){


    try{


        const {
            nome,
            email,
            senha
        } = req.body;



        // verificar se já existe

        const existe = await User.findOne({
            email
        });


        if(existe){

            return res.status(400).json({
                mensagem:"Email já cadastrado"
            });

        }



        // criptografar senha

        const senhaHash = await bcrypt.hash(
            senha,
            10
        );



        const novoUsuario = await User.create({

            nome,

            email,

            senha:senhaHash

        });



        res.json({

            mensagem:"Conta criada com sucesso",

            usuario:{

                id:novoUsuario._id,
                nome:novoUsuario.nome,
                email:novoUsuario.email

            }

        });



    }catch(error){


        res.status(500).json({

            erro:error.message

        });


    }


}



module.exports = register;