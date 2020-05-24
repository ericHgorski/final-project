class Scene1 extends Phaser.Scene {
    constructor() {
        super("loadingScreen");
    }

    preload() {
        this.load.image("background", "../assets/sky.png");
        this.load.image("chicken", "../assets/funky-chicken.png");
        this.load.spritesheet("egg", "../assets/egg.png", {
            frameHeight: 40,
            frameWidth: 40,
        });
        this.load.spritesheet("clouds", "../assets/clouds.png", {
            frameHeight: 195,
            frameWidth: 350,
        });
        // Audio files
        this.load.audio("chicken_audio", "../assets/chicken-sound.mp3");
        // Font for score keeping.
        this.load.bitmapFont("myFont", "../assets/font/font.png", "../assets/font/font.xml");
    }
    create() {
        this.add.text(20, 20, "Loading game...");
        // The add player helper function
        var self = this;
        function addPlayer(self, playerInfo) {
            self.chicken = self.physics.add.image(playerInfo.x, playerInfo.y, "chicken");
            console.log("self.chicken :>> ", self.chicken);
            // console.log("playerInfo.team :>> ", playerInfo.team);
            // if (playerInfo.team === "white") {
            //     console.log("self.chicken :>> ", self.chicken);
            //     self.chicken.setTint(0x0000ff, { tintFill: true });
            // } else {
            //     self.chicken.setTint(0xff0000, { tintFill: true });
            // }
        }

        // Get connection info when user connects or disconnects.
        this.socket = io();
        // On current players event
        this.socket.on("currentPlayers", function (players) {
            console.log("players :>> ", players);
            Object.keys(players).forEach(function (id) {
                console.log("players[id] :>> ", players[id]);
                console.log("self.socket.id :>> ", self.socket.id);
                if (players[id].playerId == self.socket.id) {
                    console.log("player is added with player id: ", players[id]);
                    console.log("player is added with socket id: ", self.socket.id);
                    addPlayer(self, players[id]);
                }
            });
        });

        this.anims.create({
            key: "egg_anim",
            frames: this.anims.generateFrameNumbers("egg"),
            frameRate: 3,
            repeat: -1,
        });
        this.anims.create({
            key: "clouds",
            frames: this.anims.generateFrameNumbers("clouds"),
            frameRate: 1,
            repeat: -1,
        });

        this.scene.start("playGame");
    }
}
