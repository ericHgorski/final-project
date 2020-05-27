const config = {
    // Choose between Canvas or WebGL renderer depending on user browser, where WebGL is preferred.
    type: Phaser.AUTO,
    // Render our game in canvas element of this id if exists, if not create a canvas element.
    parent: "funky-chicken-destroyer",
    width: 1280,
    height: 800,
    scene: [Scene1, Scene2],
    physics: {
        default: "arcade",
        arcade: {
            debug: false,
        },
    },
};

var game = new Phaser.Game(config);

const gameSettings = {
    playerSpeed: 500,
    projectileSpeed: 550,
    characterOffset: 60,
    startingHealth: 10,
};
