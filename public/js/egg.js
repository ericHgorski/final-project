class Egg extends Phaser.GameObjects.Sprite {
    constructor(scene) {
        var x = scene.body.x;
        var y = scene.body.y + 200;

        super(scene, x, y, "egg");

        // Add the egg to the scene
        scene.add.existing(this);
        this.play("egg_anim");

        // enable physics
        scene.physics.world.enableBody(this, 0);

        // Add the beam to the projectiles group in scene 2
        scene.projectiles.add(this);

        this.body.velocity.y = 200;
    }

    update() {
        if (this.y > config.height - 60) {
            this.destroy();
        }
    }
}
