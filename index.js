const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io").listen(server);

// Keep track of enemies
var enemies = [];

app.use(express.static(__dirname + "/public"));

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html");
});

io.on("connection", function (socket) {
    socket.on("chickenPosition", (position) => {
        socket.broadcast.emit("otherChickenPosition", position);
    });

    socket.on("eggDropCoordinates", (coordinates) => {
        socket.broadcast.emit("eggWasDropped", coordinates);
    });

    socket.on("healthChange", (health) => {
        socket.broadcast.emit("healthLevel", health);
    });
    socket.on("enemyHealthChange", (health) => {
        socket.broadcast.emit("enemyHealthLevel", health);
    });

    socket.on("disconnect", function () {
        delete io.emit("disconnect", socket.id);
        console.log("user disconnected");
    });
});

server.listen(8080, function () {
    console.log(`Listening on ${server.address().port}`);
});

// socket.emit("currentPlayers", players);
// // Broadcast sends event to all other sockets in the name space except for own player info.
// socket.broadcast.emit("newPlayer", players[socket.id]);
// console.log("a user connected with id: ", socket.id);

// when a new player connects, store data about that player in the players object
// players[socket.id] = {
//     // Randomly select between white or black team for each player
//     team: Math.floor(Math.random() * 2) > 1 ? "white" : "black",
//     // store x and y position of new player
//     x: 100,
//     y: 100,
//     playerId: socket.id,
// };
