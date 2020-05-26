class Scene1 extends Phaser.Scene {
    constructor() {
        super("loadImages");
    }

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
        // Audio files
        this.load.audio("chicken_audio", "../assets/chicken-sound.mp3");
        // Font for score keeping.
        this.load.bitmapFont("myFont", "../assets/font/font.png", "../assets/font/font.xml");
    }
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
