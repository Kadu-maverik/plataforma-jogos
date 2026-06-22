const express = require("express");

const router = express.Router();


const register = require("../auth/register");

const login = require("../auth/login");



router.post(
"/register",
register
);



router.post(
"/login",
login
);



module.exports = router;