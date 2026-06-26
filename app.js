const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config();

// DATABASE
const conectarMongo = require("./database/mongodb");

// ROUTES
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");

// SOCKETS
const lobbySocket = require("./sockets/lobbySocket");
const chatSocket = require("./sockets/chatSocket");
const friendSocket = require("./sockets/friendSocket");

// GAME SOCKETS
const damaSocket = require("./games/dama/socket");
const xadrezSocket = require("./games/xadrez/socket");
const dominoSocket = require("./games/domino/socket");
const velhaSocket = require("./games/velha/socket");

// APP + SERVER
const app = express();
const server = http.createServer(app);

// SOCKET.IO
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// =========================
// 🔌 CONECTAR SOCKETS
// =========================
lobbySocket(io);
chatSocket(io);
friendSocket(io);

io.on("connection", (socket) => {
    console.log("Jogador conectado:", socket.id);

    lobbySocket(io, socket);
    chatSocket(io, socket);
    friendSocket(io, socket);

    damaSocket(io, socket);
});

// =========================
// 🧠 MIDDLEWARES
// =========================
app.use(cors());
app.use(express.json());

// =========================
// 🌐 FRONTEND (CLIENT)
// =========================
app.use(express.static(path.join(__dirname, "client")));

// =========================
// 🔗 ROTAS API
// =========================
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

// =========================
// 🏠 ROTA PRINCIPAL
// =========================
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "login.html"));
});

// =========================
// 🔌 SOCKET GLOBAL LOG
// =========================
io.on("connection", (socket) => {
    console.log("🟢 Jogador conectado:", socket.id);

    socket.on("disconnect", () => {
        console.log("🔴 Jogador saiu:", socket.id);
    });
});

// =========================
// 🗄️ BANCO DE DADOS
// =========================
conectarMongo();

// =========================
// 🚀 START SERVER
// =========================
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`🚀 Servidor iniciado na porta ${PORT}`);
});