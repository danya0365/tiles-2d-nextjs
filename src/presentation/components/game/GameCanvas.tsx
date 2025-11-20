"use client";

import { AssetManager } from "@/src/infrastructure/game/AssetManager";
import { CameraController } from "@/src/infrastructure/game/CameraController";
import { Player } from "@/src/infrastructure/game/entities/Player";
import { ExcaliburGame } from "@/src/infrastructure/game/ExcaliburGame";
import { TimeManager } from "@/src/infrastructure/game/TimeManager";
import { Engine, Scene } from "excalibur";
import { useEffect, useRef, useState } from "react";

/**
 * Game Canvas Component
 * Renders Excalibur game engine in React
 */
export function GameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null!);
  const [isLoading, setIsLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);
  const engineRef = useRef<Engine | null>(null);

  useEffect(() => {
    let mounted = true;

    const initializeGame = async () => {
      try {
        // Initialize Excalibur engine
        const engine = ExcaliburGame.initialize(canvasRef.current);
        engineRef.current = engine;

        // Initialize asset manager definitions
        AssetManager.initialize();

        // Preload all assets with manual progress tracking
        await AssetManager.preloadAll((progress) => {
          if (!mounted) return;
          setLoadProgress(Math.round(progress * 100));
        });

        // Start engine after assets are ready
        await engine.start();

        if (!mounted) return;

        // Setup game scene
        setupGameScene(engine);

        setIsLoading(false);
      } catch (error) {
        console.error("Failed to initialize game:", error);
      }
    };

    initializeGame();

    // Cleanup
    return () => {
      mounted = false;
      if (engineRef.current) {
        ExcaliburGame.stop();
      }
    };
  }, []);

  /**
   * Setup main game scene
   */
  const setupGameScene = (engine: Engine) => {
    // Go to game scene first
    ExcaliburGame.goToScene("game");

    // Get the actual scene instance (cast to Scene type)
    const gameScene = engine.currentScene as Scene;
    if (!gameScene) return;

    // Create player
    const player = new Player(640, 360); // Center of screen
    gameScene.add(player);

    // Setup camera
    const cameraController = new CameraController(engine);
    cameraController.setTarget(player);
    cameraController.snapTo(player.pos);
    cameraController.setZoom(3);

    // Setup time manager
    const timeManager = TimeManager.getInstance();

    // Update camera and time on each frame
    gameScene.on("preupdate", (evt) => {
      cameraController.update(evt.elapsed);
      timeManager.update(evt.elapsed);
    });

    console.log("Game scene initialized! Player position:", player.pos);
  };

  return (
    <div className="relative w-full h-screen bg-black flex items-center justify-center">
      {/* Loading Screen */}
      {isLoading && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-gray-900 text-white">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">🌾 Stardew Valley</h2>
            <p className="text-lg mb-6">Loading game assets...</p>

            {/* Progress Bar */}
            <div className="w-64 h-4 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 transition-all duration-300"
                style={{ width: `${loadProgress}%` }}
              />
            </div>
            <p className="mt-2 text-sm text-gray-400">{loadProgress}%</p>
          </div>
        </div>
      )}

      {/* Game Canvas */}
      <canvas ref={canvasRef} className="max-w-full max-h-full" />
    </div>
  );
}
