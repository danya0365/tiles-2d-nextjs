"use client";

import { Player } from "@/src/infrastructure/game/entities/Player";
import { GameCanvas } from "@/src/presentation/components/game/GameCanvas";
import { GameHUD } from "@/src/presentation/components/game/GameHUD";
import { useEffect, useRef, useState } from "react";

/**
 * Stardew Game View - Main game view component
 * Combines GameCanvas and GameHUD
 */
const StardewGameView = () => {
  const [playerStats, setPlayerStats] = useState({
    health: 100,
    maxHealth: 100,
    energy: 100,
    maxEnergy: 100,
    money: 500,
  });

  const playerRef = useRef<Player | null>(null);

  useEffect(() => {
    // Update player stats every 100ms
    const interval = setInterval(() => {
      if (playerRef.current) {
        const stats = playerRef.current.getStats();
        setPlayerStats({
          health: Math.round(stats.health),
          maxHealth: stats.maxHealth,
          energy: Math.round(stats.energy),
          maxEnergy: stats.maxEnergy,
          money: stats.money,
        });
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Game Canvas (Excalibur) */}
      <GameCanvas />

      {/* HUD Overlay */}
      <GameHUD
        health={playerStats.health}
        maxHealth={playerStats.maxHealth}
        energy={playerStats.energy}
        maxEnergy={playerStats.maxEnergy}
        money={playerStats.money}
      />
    </div>
  );
};

export default StardewGameView;
