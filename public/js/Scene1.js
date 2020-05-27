class Scene1 extends Phaser.Scene {
    constructor() {
        super("loadImages");
    }
    // ======= LOAD IN ALL GAME ASSETS ======== //
    preload() {
        this.load.image("background", "../assets/sky.png");
        this.load.image("chicken", "../assets/funky-chicken.png");
        this.load.image("enemyChicken", "../assets/funky-chicken-enemy.png");
        this.load.spritesheet("egg", "../assets/egg.png", {
            frameHeight: 20,
            frameWidth: 20,
        });

        this.load.spritesheet("clouds", "../assets/clouds.png", {
            frameHeight: 195,
            frameWidth: 350,
        });
        this.load.audio("chicken_audio", "../assets/chicken-sound.mp3");
        this.load.audio("splat", "../assets/splat.mp3");
        this.load.audio("new_chicken", "../assets/new-chicken-connected.mp3");
        this.load.bitmapFont("myFont", "../assets/font/font.png", "../assets/font/font.xml");
    }

    // ========= CREATE ANIMATIONS AND LAUNCH GAME ======= //
    create() {
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
