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
        this.chicken = this.physics.add.image(config.width / 2, config.height / 2, "chicken");
        this.chicken.setScale(0.3);
        this.chicken.setCollideWorldBounds(true);
        // this.chicken.setInteractive();

        // =============== SOUND ================ //
        this.chickenSound = this.sound.add("chicken_audio");

        // =============== EGGS ================ //
        this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
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
        this.physics.add.collider(this.projectiles, this.clouds);
        console.log("this.clouds :>> ", this.clouds);
    }

    update() {
        this.movePlayerHandler();
        this.moveClouds();
        this.background.tilePositionY -= 3;

        if (this.clouds.y > config.height) {
            this.resetCloud();
        }
        // Drop an egg on spacebar down if chicken is active and 3 or less eggs are on screen for given chicken
        if (Phaser.Input.Keyboard.JustDown(this.spacebar)) {
            if (this.chicken.active && this.projectiles.getChildren().length < 3) {
                this.shootEgg();
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
            // this.physics.velocityFromRotation(this.chicken.rotation + 1.5, 100, this.chicken.body.acceleration);
            this.chicken.setVelocityY(-gameSettings.playerSpeed / velocityMultiplier);
        }
    }
    moveClouds() {
        this.clouds.y += Phaser.Math.Between(1, 3);
    }

    hitChicken(chicken, projectile) {
        this.health -= 1;
        this.healthLevel.text = `HEALTH : ${this.health}`;
        projectile.destroy();
        if (this.health == 0) {
            this.chickenSound.play();
            chicken.disableBody(true, true);
            this.healthLevel = this.add.bitmapText(500, 500, "myFont", `GAME OVER`, 200);
        }
    }

    shootEgg() {
        var egg = new Egg(this);
    }

    resetCloud() {
        this.clouds.y = 0;
        this.clouds.x = Phaser.Math.Between(0, config.width);
    }
}
