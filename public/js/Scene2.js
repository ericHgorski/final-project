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

        // =============== SOUND ================ //
        this.chickenSound = this.sound.add("chicken_audio");
        this.newChickenEntered = this.sound.add("new_chicken");
        this.splat = this.sound.add("splat");

        // ============ PLAYER 1 ============= //
        this.chicken = this.physics.add
            .image(config.width / 2, config.height / 2, "chicken")
            .setScale(0.2)
            .setCollideWorldBounds(true);

        // ========== PLAYER 2 FUNCTIONALITY ============= //
        this.socket = io();

        let enemyChickenCreated = false;
        this.socket.on("otherChickenPosition", (position) => {
            if (!enemyChickenCreated) {
                this.enemyChicken = this.physics.add.image(this.chicken.x, this.chicken.y, "enemyChicken").setScale(0.2).setCollideWorldBounds(true);
                this.physics.add.overlap(this.projectiles, this.enemyChicken, this.hitEnemyChicken, null, this);
                enemyChickenCreated = true;
            } else {
                this.enemyChicken.setX(position.x).setY(position.y).setAngle(position.angle);
            }
        });

        this.socket.on("playerDisconnected", () => {
            console.log("player disconnected");
            // this.enemyChicken.disableBody(true, true);
        });

        // =============== EGGS ================ //
        // Keyboard input settings for egg shooting.
        this.wKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.dKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.sKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.aKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        // Group to hold all egg projectiles.
        this.projectiles = this.physics.add.group({
            classType: "egg",
            maxSize: 20,
            runChildUpdate: true,
        });

        // When one player shoots egg, send information to server.
        this.socket.on("eggWasDropped", (coordinates) => {
            let egg = new Egg(this);
            if (coordinates.direction == "down") {
                egg.setX(coordinates.x).setY(coordinates.y + gameSettings.characterOffset);
                egg.body.velocity.y = gameSettings.projectileSpeed;
            }
            if (coordinates.direction == "right") {
                egg.setX(coordinates.x + gameSettings.characterOffset).setY(coordinates.y);
                egg.body.velocity.x = gameSettings.projectileSpeed;
            }
            if (coordinates.direction == "up") {
                egg.setX(coordinates.x).setY(coordinates.y - gameSettings.characterOffset);
                egg.body.velocity.y = -gameSettings.projectileSpeed;
            }
            if (coordinates.direction == "left") {
                egg.setX(coordinates.x - gameSettings.characterOffset).setY(coordinates.y);
                egg.body.velocity.x = -gameSettings.projectileSpeed;
            }
        });

        // Add checker for chicken/egg collisions.
        this.physics.add.overlap(this.projectiles, this.chicken, this.hitChicken, null, this);

        // =============== CHICKEN AND ENEMY CHICKEN HEALTH ================ //
        this.health = gameSettings.startingHealth;
        this.healthLevel = this.add.bitmapText(15, 10, "myFont", `MY HEALTH: ${this.health}`, 30);
        this.healthLevel.tint = 0x993244;
        this.healthLevel.setDepth(10);

        this.enemyHealth = gameSettings.startingHealth;
        this.enemyHealthLevel = this.add.bitmapText(config.width - 220, 10, "myFont", `ENEMY HEALTH: ${this.enemyHealth}`, 30);
        this.enemyHealthLevel.tint = 0x223344;
        this.enemyHealthLevel.setDepth(10);

        // ===================== CLOUDS ====================== //

        let numOfClouds = Phaser.Math.Between(2, 8);
        for (let i = 0; i < numOfClouds; i++) {
            let cloudY = Phaser.Math.Between(0, config.height);
            let cloudX = Phaser.Math.Between(0, config.width);
            this.clouds = this.add.sprite(cloudX, cloudY, "clouds");
            this.clouds.setScale(0.5);
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
        // Drop an egg on in given direction with maximum of 5 eggs in projectile group
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
        let playerVelocity = gameSettings.playerSpeed / velocityMultiplier;

        // Left arrow key.
        if (this.cursorKeys.left.isDown) {
            this.chicken.setVelocityX(-playerVelocity);
            this.chicken.setAngularVelocity(-10);
            this.chicken.flipX = false;
            // Right arrow key.
        } else if (this.cursorKeys.right.isDown) {
            this.chicken.setVelocityX(playerVelocity);
            this.chicken.setAngularVelocity(10);
            this.chicken.flipX = true;
        }
        // Down arrow key.
        if (this.cursorKeys.down.isDown) {
            this.chicken.setVelocityY(playerVelocity * velocityMultiplier);
            // Up arrow key.
        } else if (this.cursorKeys.up.isDown) {
            this.chicken.setVelocityY(-playerVelocity);
        }
        this.socket.emit("chickenPosition", { x: this.chicken.x, y: this.chicken.y, angle: this.chicken.angle });
    }
    moveClouds() {
        this.clouds.y += Phaser.Math.Between(1, 4);
    }

    // Handling egg collision with chickens.
    hitEnemyChicken(enemyChicken, projectile) {
        this.enemyHealth -= 1;
        this.socket.emit("enemyHealthChange", this.enemyHealth);
        this.enemyHealthLevel.text = `ENEMY HEALTH : ${this.enemyHealth}`;
        projectile.destroy();
        this.splat.play();
        if (this.enemyHealth == 0) {
            this.chickenSound.play();
            enemyChicken.disableBody(true, true);
            this.add.bitmapText(config.width / 2 - 150, config.height / 2, "myFont", `YOU WIN`, 100);
        }
    }

    hitChicken(chicken, projectile) {
        this.health -= 1;
        this.socket.emit("healthChange", this.health);
        this.healthLevel.text = `MY HEALTH : ${this.health}`;
        projectile.destroy();
        if (this.health == 0) {
            this.chickenSound.play();
            chicken.disableBody(true, true);
            this.add.bitmapText(config.width / 2 - 150, config.height / 2, "myFont", `YOU LOSE`, 100);
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
