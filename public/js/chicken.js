class Chicken extends Phaser.GameObjects.Image {
    constructor(scene) {
        var x = 400;
        var y = 400;

        super(scene, x, y, "chicken");
        this.scene = scene;

        // Add the egg to the scene
        scene.add.existing(this);

        // enable physics
        scene.physics.world.enableBody(this);
        // Add the beam to the projectiles group in scene 2

        scene.chickens.add(this);

        this.body.velocity.y = 200;

        this.cursorKeys = scene.input.keyboard.createCursorKeys();

        this.spacebar = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    update() {
        this.body.setVelocity(0);
        // When chicken is closer to top of the game screen, make it move slower.
        let velocityMultiplier = config.height / this.body.y;

        if (this.cursorKeys.left.isDown) {
            this.body.setVelocityX(-gameSettings.playerSpeed / velocityMultiplier);
            this.body.setAngularVelocity(-10);
            console.log("this.body :>> ", this.body);
            this.body.flipX = false;
        } else if (this.cursorKeys.right.isDown) {
            this.body.setVelocityX(gameSettings.playerSpeed / velocityMultiplier);
            this.body.setAngularVelocity(10);
            this.body.flipX = false;
        }
        if (this.cursorKeys.down.isDown) {
            this.body.setVelocityY(gameSettings.playerSpeed);
        } else if (this.cursorKeys.up.isDown) {
            // this.physics.velocityFromRotation(this.chicken.rotation + 1.5, 100, this.chicken.body.acceleration);
            this.body.setVelocityY(-gameSettings.playerSpeed / velocityMultiplier);
        }

        if (Phaser.Input.Keyboard.JustDown(this.spacebar)) {
            console.log("spacebar is pressed");

            // if (this.body.active && scene.projectiles.getChildren().length < 3) {
            this.shootEgg();
            // }
        }
    }
    shootEgg() {
        console.log("shootEgg is called");
        console.log("this shootEgg :>> ", this);
        var egg = new Egg(this);
    }
}
