import React from 'react';
import Phaser from "phaser";
import GameScene from "./scenes/GameScene";

export const SCREEN_WIDTH = 480;
export const SCREEN_HEIGHT = 640;

function App() {
    return (
        <div>

        </div>
    );
}

export default App;

export const game = new Phaser.Game({
    type: Phaser.AUTO,
    width: 480,
    height: 640,
    scene: GameScene,
    physics: {
        default: "arcade",
        arcade: {
            debug: true,
            gravity: {
                y: 300,
            },
        },
    },
})