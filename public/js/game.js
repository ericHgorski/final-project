const config = {
    // Choose between Canvas or WebGL renderer depending on user browser,
    // where WebGL is preferred
    type: Phaser.AUTO,
    // Render our game in canvas element of this id if exists, if not create a canvas element
    parent: "funky-chicken-destroyer",
    width: 1762,
    height: 1164,
    physics: {
        default: "arcade",
        arcade: {
            debug: false,
            gravity: { y: 150 },
        },
    },
    scene: {
        preload: preload,
        create: create,
        update: update,
    },
};

var game = new Phaser.Game(config);

var gameSettings = {
    playerSpeed: 500,
};

function preload() {
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

function create() {
    let self = this;

    // =========== ANIMATIONS ========//
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

    // ============ BACKGROUND AND SETUP ============= //
    this.background = this.add.tileSprite(0, 0, config.width, config.height, "background").setOrigin(0, 0).setScrollFactor(0);

    // ============ CHICKEN FIGURE ============= //
    this.chicken = this.physics.add
        .image(config.width / 2, config.height / 2, "chicken")
        .setScale(0.3)
        .setCollideWorldBounds(true);
    function addPlayer(self, playerInfo) {
        let chicken = new Chicken(self);
        chicken.setScale(0.5);
        chicken.body.setCollideWorldBounds(true);
        // self.chicken2 = self.physics.add.image(200, 200, "chicken").setScale(0.3).setCollideWorldBounds(true);
        // self.chicken.setScale(0.3);
        // self.chicken.setCollideWorldBounds(true);
        // console.log("self.chicken :>> ", self.chicken);
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
    this.chickens = this.physics.add.group({
        classType: "chicken",
        maxSize: 10,
        runChildUpdate: true,
    });

    // =============== SOUND ================ //
    this.chickenSound = this.sound.add("chicken_audio");

    // =============== EGGS ================ //
    // Group to hold all projectiles
    this.projectiles = this.physics.add.group({
        classType: "egg",
        maxSize: 10,
        runChildUpdate: true,
    });

    this.physics.add.overlap(this.projectiles, this.chicken, this.hitChicken, null, this);

    // =============== CHICKEN HEALTH ================ //
    this.health = 5;
    this.healthLevel = this.add.bitmapText(15, 10, "myFont", `HEALTH: ${this.health}`, 40);
    this.healthLevel.tint = 0x223344;

    // =============== CLOUDS ================ //

    let numOfClouds = Phaser.Math.Between(2, 8);
    for (let i = 0; i < numOfClouds; i++) {
        let cloudY = Phaser.Math.Between(0, config.height);
        let cloudX = Phaser.Math.Between(0, config.width);
        this.clouds = this.add.sprite(cloudX, cloudY, "clouds");
        this.clouds.play("clouds");
    }
}

function update() {
    let self = this;

    moveClouds();
    this.background.tilePositionY -= 3;

    if (this.clouds.y > config.height) {
        resetCloud();
    }

    function moveClouds() {
        self.clouds.y += Phaser.Math.Between(1, 3);
    }

    function hitChicken(chicken, projectile) {
        this.health -= 1;
        this.healthLevel.text = `HEALTH : ${this.health}`;
        projectile.destroy();
        if (this.health == 0) {
            this.chickenSound.play();
            chicken.disableBody(true, true);
            this.healthLevel = this.add.bitmapText(500, 500, "myFont", `GAME OVER`, 200);
        }
    }

    function resetCloud() {
        self.clouds.y = 0;
        self.clouds.x = Phaser.Math.Between(0, config.width);
    }
}
