import {Scene} from "phaser";
import {SCREEN_HEIGHT, SCREEN_WIDTH} from "../App";

export default class GameScene extends Scene {
    constructor() {
        super("game")
    }

    preload() {
        this.load.image("background", "assets/images/Background/bg_layer1.png")
        this.load.image("platform", "assets/images/Environment/ground_grass.png")
        this.load.image("bunny_stand", "assets/images/Players/bunny1_stand.png")
    }

    create() {
        const tempPlatform = this.add.image(0, 0, "platform").setScale(0.5, 0.5)
        const platformWidth = tempPlatform.width
        const platformHeight = tempPlatform.height
        tempPlatform.destroy(true)

        this.add.image(SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2, "background")
        const platforms = this.physics.add.staticGroup()
        for (let i = 0; i < 5; i++) {
            const y = SCREEN_HEIGHT - platformHeight - (i * 2 * platformHeight)
            const x = Phaser.Math.Between(platformWidth, SCREEN_WIDTH - platformWidth)
            const platform = this.physics.add.staticImage(x, y, "platform").setScale(0.5, 0.5)
            platform.body.updateFromGameObject()
            platforms.add(platform)
        }

        const player = this.physics.add.sprite(SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2, "bunny_stand").setScale(0.5, 0.5)
        this.physics.add.collider(player, platforms)
    }
}
