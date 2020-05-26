class Egg extends Phaser.GameObjects.Sprite {
    constructor(scene, direction) {
        let x, y;

        if (direction == "down") {
            x = scene.chicken.x;
            y = scene.chicken.y + gameSettings.characterOffset;
        }
        if (direction == "right") {
            x = scene.chicken.x + gameSettings.characterOffset;
            y = scene.chicken.y;
        }
        if (direction == "up") {
            x = scene.chicken.x;
            y = scene.chicken.y - gameSettings.characterOffset;
        }
        if (direction == "left") {
            x = scene.chicken.x - gameSettings.characterOffset;
            y = scene.chicken.y;
        }
        // Add the egg to the scene

        super(scene, x, y, "egg");

        // Enable physics for collision detection
        scene.physics.world.enableBody(this);
        // Add the beam to the projectiles group in scene 2

        scene.add.existing(this);
        this.play("egg_anim");

        scene.projectiles.add(this);

        if (direction == "down") {
            this.body.velocity.y = gameSettings.projectileSpeed;
        }
        if (direction == "right") {
            this.body.velocity.x = gameSettings.projectileSpeed;
        }
        if (direction == "up") {
            this.body.velocity.y = -gameSettings.projectileSpeed;
        }
        if (direction == "left") {
            this.body.velocity.x = -gameSettings.projectileSpeed;
        }
    }

    update() {
        if (this.y > config.height - 60 || this.y < 60 || this.x > config.width - 60 || this.x < 60) {
            this.destroy();
        }
    }
}
