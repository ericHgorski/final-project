class Egg extends Phaser.GameObjects.Sprite {
    constructor(scene) {
        var x = scene.chicken.x;
        var y = scene.chicken.y + 85;

        super(scene, x, y, "egg");

        // Add the egg to the scene
        scene.add.existing(this);
        this.play("egg_anim");

        // enable physics
        scene.physics.world.enableBody(this);

        // this.body.velocity.y = -250;

        // Add the beam to the projectiles group in scene 2
        scene.projectiles.add(this);
    }

    update() {
        // 3.4 Frustum culling
        if (this.y > config.height - 60) {
            this.destroy();
        }
    }
}
