const express = require("express");

const router = express.Router();


const auth = require("../middleware/auth");



router.get(
"/perfil",
auth,
(req,res)=>{


res.json({

mensagem:"Perfil protegido",

usuario:req.usuario


});


});



module.exports = router;