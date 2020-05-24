const config = {
    // Choose between Canvas or WebGL renderer depending on user browser,
    // where WebGL is preferred
    type: Phaser.AUTO,
    // Render our game in canvas element of this id if exists, if not create a canvas element
    parent: "funky-chicken-destroyer",
    width: 1762,
    height: 1164,
    scene: [Scene1, Scene2],
    physics: {
        default: "arcade",
        arcade: {
            debug: false,
            gravity: { y: 150 },
        },
    },
    // scene: {
    //     preload: preload,
    //     create: create,
    //     update: update,
    // },
};

var game = new Phaser.Game(config);

var gameSettings = {
    playerSpeed: 500,
};

// function preload() {}

// function create() {
//     this.socket = io();
// }

// function update() {}
