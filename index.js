const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io").listen(server);

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
    socket.on("enemyHealthChange", (enemyHealth) => {
        socket.broadcast.emit("enemyHealthLevel", enemyHealth);
    });

    socket.on("disconnect", () => {
        socket.broadcast.emit("playerDisconnected");
    });
});

server.listen(process.env.PORT || 8080, () => {
    console.log(`Listening on ${server.address().port}`);
});
