// class Clouds extends Phaser.GameObjects.Sprite {
//     constructor(scene) {
// let numOfClouds = Phaser.Math.Between(2, 8);
// for (let i = 0; i < numOfClouds; i++) {
//     let cloudY = ;
//     let cloudX = ;
//     this.clouds = this.add.sprite(cloudX, cloudY, "clouds");
//     // this.anims.create({
//     //     key: "clouds",
//     //     frames: this.anims.generateFrameNumbers("clouds"),
//     //     frameRate: 1,
//     //     repeat: -1,
//     // });
//     this.clouds.play("clouds");
// }

//         var x = Phaser.Math.Between(0, config.width);
//         var y = Phaser.Math.Between(0, config.height);

//         super(scene, x, y, "clouds");

//         // Add the egg to the scene
//         scene.add.existing(this);
//         this.play("egg_anim");

//         // enable physics
//         scene.physics.world.enableBody(this);
//         // Add the beam to the projectiles group in scene 2

//         scene.projectiles.add(this);

//         this.body.velocity.y = 250;
//     }

//     update() {
//         // 3.4 Frustum culling
//         if (this.y > config.height - 60) {
//             this.destroy();
//         }
//     }
// }
