const mongoose = require("mongoose");


const UserSchema = new mongoose.Schema({

    nome:{
        type:String,
        required:true
    },


    email:{
        type:String,
        required:true,
        unique:true
    },


    senha:{
        type:String,
        required:true
    },


    avatar:{
        type:String,
        default:"default.png"
    },


    estatisticas:{


        partidas:{

            type:Number,
            default:0

        },


        vitorias:{

            type:Number,
            default:0

        },


        derrotas:{

            type:Number,
            default:0

        }

    },


    ranking:{


        elo:{

            type:Number,
            default:1000

        },


        pontos:{

            type:Number,
            default:0

        }


    },


    criadoEm:{

        type:Date,
        default:Date.now

    }


});


module.exports = mongoose.model(
    "User",
    UserSchema
);