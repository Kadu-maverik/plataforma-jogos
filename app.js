const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

require("dotenv").config();


const conectarMongo = require("./database/mongodb");


const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");


const lobbySocket = require("./sockets/lobbySocket");
const damaSocket = require("./games/dama/socket");



const app = express();


const server = http.createServer(app);



const io = new Server(server,{

cors:{

origin:"*"

}

});




// sockets

lobbySocket(io);

damaSocket(io);





// middlewares

app.use(cors());

app.use(express.json());



// frontend

app.use(
express.static("client")
);





// rotas

app.use(
"/api/user",
userRoutes
);


app.use(
"/api/auth",
authRoutes
);


const path = require("path");

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "menu.html"));
});


// conexão jogadores

io.on(
"connection",
(socket)=>{


console.log(
"Jogador conectado:",
socket.id
);



socket.on(
"disconnect",
()=>{


console.log(
"Jogador saiu:",
socket.id
);


});


});






// banco

conectarMongo();





const PORT =
process.env.PORT || 3000;



server.listen(
PORT,
()=>{


console.log(
`Servidor iniciado na porta ${PORT}`
);


});