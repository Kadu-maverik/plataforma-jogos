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

const io = new Server(server, {
    cors: {
        origin: "*"
    }
});

// SOCKETS
lobbySocket(io);
damaSocket(io);

// MIDDLEWARES
app.use(cors());
app.use(express.json());

// FRONTEND (static files)
app.use(express.static(path.join(__dirname, "client")));

// ROUTES API
app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);

// LOGIN PRIMEIRO (IMPORTANTE)
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "login.html"));
});

// SOCKET LOG
io.on("connection", (socket) => {
    console.log("Jogador conectado:", socket.id);

    socket.on("disconnect", () => {
        console.log("Jogador saiu:", socket.id);
    });
});

// DATABASE
conectarMongo();

// PORT
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Servidor iniciado na porta ${PORT}`);
});