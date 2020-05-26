class Scene2 extends Phaser.Scene {
    constructor() {
        super("playGame");
    }

    create() {
        // ============ BACKGROUND AND SETUP ============= //
        this.background = this.add.tileSprite(0, 0, config.width, config.height, "background");
        this.background.setOrigin(0, 0);
        this.background.setScrollFactor(0);
        this.cursorKeys = this.input.keyboard.createCursorKeys();

        // ============ CHICKEN FIGURE ============= //
        this.chicken = this.physics.add
            .image(config.width / 2, config.height / 2, "chicken")
            .setScale(0.35)
            .setCollideWorldBounds(true);

        // Get connection info when user connects or disconnects.
        this.socket = io();

        let enemyChickenCreated = false;
        this.socket.on("otherChickenPosition", (position) => {
            if (!enemyChickenCreated) {
                this.enemyChicken = this.physics.add.image(position.x, position.y, "chicken").setScale(0.35).setCollideWorldBounds(true);
                this.physics.add.overlap(this.projectiles, this.enemyChicken, this.hitEnemyChicken, null, this);
                enemyChickenCreated = true;
            } else {
                this.enemyChicken.setX(position.x).setY(position.y).setAngle(position.angle);
            }
        });

        // =============== SOUND ================ //
        this.chickenSound = this.sound.add("chicken_audio");

        // =============== EGGS ================ //
        this.wKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.dKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.sKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.aKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        // Group to hold all projectiles
        this.projectiles = this.physics.add.group({
            classType: "egg",
            maxSize: 10,
            runChildUpdate: true,
        });

        this.socket.on("eggWasDropped", (coordinates) => {
            let egg = new Egg(this);
            if (coordinates.direction == "down") {
                egg.setX(coordinates.x).setY(coordinates.y + 100);
                egg.body.velocity.y = gameSettings.projectileSpeed;
            }
            if (coordinates.direction == "right") {
                egg.setX(coordinates.x + 100).setY(coordinates.y);
                egg.body.velocity.x = gameSettings.projectileSpeed;
            }
            if (coordinates.direction == "up") {
                egg.setX(coordinates.x).setY(coordinates.y - 100);
                egg.body.velocity.y = -gameSettings.projectileSpeed;
            }
            if (coordinates.direction == "left") {
                egg.setX(coordinates.x - 100).setY(coordinates.y);
                egg.body.velocity.x = -gameSettings.projectileSpeed;
            }
        });

        this.physics.add.overlap(this.projectiles, this.chicken, this.hitChicken, null, this);

        // =============== CHICKEN AND ENEMY CHICKEN HEALTH ================ //
        this.health = 5;
        this.healthLevel = this.add.bitmapText(15, 10, "myFont", `MY HEALTH: ${this.health}`, 40);
        this.healthLevel.setDepth(10);
        this.healthLevel.tint = 0x993244;
        this.enemyHealth = 5;
        this.enemyHealthLevel = this.add.bitmapText(config.width - 300, 10, "myFont", `ENEMY HEALTH: ${this.enemyHealth}`, 40);
        this.enemyHealthLevel.tint = 0x223344;
        // Bring health level to foreground of all images
        this.enemyHealthLevel.setDepth(10);

        // =============== CLOUDS ================ //

        let numOfClouds = Phaser.Math.Between(2, 8);
        for (let i = 0; i < numOfClouds; i++) {
            let cloudY = Phaser.Math.Between(0, config.height);
            let cloudX = Phaser.Math.Between(0, config.width);
            this.clouds = this.add.sprite(cloudX, cloudY, "clouds");
            this.clouds.play("clouds");
        }
    }

    update() {
        this.movePlayerHandler();
        this.moveClouds();
        this.background.tilePositionY -= 3;

        if (this.clouds.y > config.height) {
            this.resetCloud();
        }
        // Drop an egg on spacebar down if chicken is active and 3 or less eggs are on screen for given chicken
        if (Phaser.Input.Keyboard.JustDown(this.wKey)) {
            if (this.chicken.active && this.projectiles.getChildren().length < 5) {
                this.shootEgg("up");
            }
        }
        if (Phaser.Input.Keyboard.JustDown(this.aKey)) {
            if (this.chicken.active && this.projectiles.getChildren().length < 5) {
                this.shootEgg("left");
            }
        }
        if (Phaser.Input.Keyboard.JustDown(this.sKey)) {
            if (this.chicken.active && this.projectiles.getChildren().length < 5) {
                this.shootEgg("down");
            }
        }
        if (Phaser.Input.Keyboard.JustDown(this.dKey)) {
            if (this.chicken.active && this.projectiles.getChildren().length < 5) {
                this.shootEgg("right");
            }
        }
    }
    movePlayerHandler() {
        this.chicken.setVelocity(0);
        // When chicken is closer to top of the game screen, make it move slower.
        let velocityMultiplier = config.height / this.chicken.y;

        if (this.cursorKeys.left.isDown) {
            this.chicken.setVelocityX(-gameSettings.playerSpeed / velocityMultiplier);
            this.chicken.setAngularVelocity(-10);
            this.chicken.flipX = false;
        } else if (this.cursorKeys.right.isDown) {
            this.chicken.setVelocityX(gameSettings.playerSpeed / velocityMultiplier);
            this.chicken.setAngularVelocity(10);
            this.chicken.flipX = true;
        }
        if (this.cursorKeys.down.isDown) {
            this.chicken.setVelocityY(gameSettings.playerSpeed);
        } else if (this.cursorKeys.up.isDown) {
            this.chicken.setVelocityY(-gameSettings.playerSpeed / velocityMultiplier);
        }
        this.socket.emit("chickenPosition", { x: this.chicken.x, y: this.chicken.y, angle: this.chicken.angle });
    }
    moveClouds() {
        this.clouds.y += Phaser.Math.Between(1, 3);
    }
    hitEnemyChicken(enemyChicken, projectile) {
        this.enemyHealth -= 1;
        this.socket.emit("enemyHealthChange", this.enemyHealth);
        this.enemyHealthLevel.text = `ENEMY HEALTH : ${this.enemyHealth}`;
        projectile.destroy();
        if (this.enemyHealth == 0) {
            this.chickenSound.play();
            enemyChicken.disableBody(true, true);
            this.add.bitmapText(500, 500, "myFont", `YOU WIN`, 200);
        }
    }

    hitChicken(chicken, projectile) {
        console.log("hitChicken runs");
        this.health -= 1;
        this.socket.emit("healthChange", this.health);
        this.healthLevel.text = `MY HEALTH : ${this.health}`;
        projectile.destroy();
        if (this.health == 0) {
            this.chickenSound.play();
            chicken.disableBody(true, true);
            this.add.bitmapText(500, 500, "myFont", `YOU LOSE`, 200);
        }
    }

    shootEgg(direction) {
        var egg = new Egg(this, direction);
        this.socket.emit("eggDropCoordinates", { x: egg.x, y: egg.y, direction: direction });
    }

    resetCloud() {
        this.clouds.y = 0;
        this.clouds.x = Phaser.Math.Between(0, config.width);
    }
}

// On current players event
// this.socket.on("currentPlayers", function (players) {
//     console.log("players : >> ", players);
//     Object.keys(players).forEach(function (id) {
//         console.log("players[id] :>> ", players[id]);
//         console.log("self.socket.id :>> ", self.socket.id);
//         if (players[id].playerId == self.socket.id) {
//             console.log("player is added with player id: ", players[id]);
//             console.log("player is added with socket id: ", self.socket.id);
//             addPlayer(self, players[id]);
//         }
//     });
// });

// function addPlayer(self, playerInfo) {
//     console.log("add player function is running");
//     self.chicken2 = self.physics.add.image(200, 200, "chicken").setScale(0.3).setCollideWorldBounds(true);
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
