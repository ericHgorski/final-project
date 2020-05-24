class Scene1 extends Phaser.Scene {
    constructor() {
        super("loadingScreen");
    }

    preload() {
        this.load.image("background", "../assets/sky.png");
        this.load.image("chicken", "../assets/funky-chicken.png");
        this.load.spritesheet("egg", "../assets/egg.png", {
            frameHeight: 40,
            frameWidth: 40,
        });
        this.load.spritesheet("clouds", "../assets/clouds.png", {
            frameHeight: 185,
            frameWidth: 350,
        });
        // Audio files
        this.load.audio("chicken_audio", "../assets/chicken-sound.mp3");
        // Font for score keeping.
        this.load.bitmapFont("myFont", "../assets/font/font.png", "../assets/font/font.xml");
    }
    create() {
        this.add.text(20, 20, "Loading game...");
        this.scene.start("playGame");
        // Get connection info when user connects or disconnects.
        this.socket = io();

        this.anims.create({
            key: "egg_anim",
            frames: this.anims.generateFrameNumbers("egg"),
            frameRate: 3,
            repeat: -1,
        });
    }
}
