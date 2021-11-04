import {Scene} from "phaser";
import {SCREEN_HEIGHT, SCREEN_WIDTH} from "../App";

const NUMBER_OF_PLATFORMS = 5

enum BunnyStance {
    STANDING,
    JUMPING
}

export default class GameScene extends Scene {
    private platforms: Phaser.Physics.Arcade.StaticGroup | null = null
    private platformsRecycleCount = 0
    private player: Phaser.Physics.Arcade.Sprite | null = null
    private _playerStance: BunnyStance = BunnyStance.STANDING

    private get playerStance() {
        return this._playerStance
    }

    private set playerStance(value: BunnyStance) {
        this._playerStance = value
        switch (value) {
            case BunnyStance.STANDING:
                this.player?.setTexture("bunny_stand")
                break
            case BunnyStance.JUMPING:
                this.player?.setTexture("bunny_jump")
                break
            default:
                throw new Error(`Unknown stance ${value}`)
        }
    }

    constructor() {
        super("game")
    }

    preload() {
        this.load.image("background", "assets/images/Background/bg_layer1.png")
        this.load.image("platform", "assets/images/Environment/ground_grass.png")
        this.load.image("bunny_stand", "assets/images/Players/bunny1_stand.png")
        this.load.image("bunny_jump", "assets/images/Players/bunny1_jump.png")
    }

    create() {
        // Background
        this.add.image(SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2, "background")
            .setScrollFactor(1, 0)

        // Platforms
        const tempPlatform = this.add.image(0, 0, "platform").setScale(0.5, 0.5)
        const platformWidth = tempPlatform.width
        const platformHeight = tempPlatform.height
        tempPlatform.destroy(true)
        this.platforms = this.physics.add.staticGroup()
        for (let i = 0; i < NUMBER_OF_PLATFORMS; i++) {
            const y = SCREEN_HEIGHT - platformHeight - (i * 2 * platformHeight)
            const x = Phaser.Math.Between(platformWidth, SCREEN_WIDTH - platformWidth)
            const platform = this.physics.add.staticImage(x, y, "platform").setScale(0.5, 0.5)
            platform.body.updateFromGameObject()
            this.platforms.add(platform)
        }

        // Player
        this.player = this.physics.add.sprite(SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2, "bunny_stand")
            .setScale(0.5, 0.5)
        this.player.body.checkCollision.up = false
        this.player.body.checkCollision.left = false
        this.player.body.checkCollision.right = false
        this.physics.add.collider(this.player, this.platforms)
        this.cameras.main.startFollow(this.player)
    }

    update(time: number, delta: number) {
        // Jump
        if (this.player?.body.touching.down) {
            this.player.setVelocityY(-500)
            this.playerStance = BunnyStance.JUMPING
        }
        const velocity = this.player?.body.velocity ?? Phaser.Math.Vector2.ZERO;
        if (this.playerStance === BunnyStance.JUMPING && velocity.y > 0) {
            this.playerStance = BunnyStance.STANDING
        }

        // Recycle platforms
        const platforms = (this.platforms?.getChildren() ?? []) as Array<Phaser.Physics.Arcade.Image>
        const minPlatform: Phaser.Physics.Arcade.Image = platforms[this.platformsRecycleCount % NUMBER_OF_PLATFORMS]
        const maxPlatform: Phaser.Physics.Arcade.Image = platforms[(NUMBER_OF_PLATFORMS + this.platformsRecycleCount - 1) % NUMBER_OF_PLATFORMS]
        const bottomOfViewport = this.cameras.main.scrollY + this.game.canvas.height
        const lowerCutoff = bottomOfViewport + 2 * minPlatform.height
        const respawnPosition = maxPlatform.y - 2 * maxPlatform.height
        if (minPlatform.y > lowerCutoff) {
            minPlatform.y = respawnPosition
            minPlatform.body.updateFromGameObject()
            this.platformsRecycleCount += 1
        }
    }
}
