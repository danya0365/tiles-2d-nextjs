"use client";

import { TimeManager, TimeState } from "@/src/infrastructure/game/TimeManager";
import {
  Cloud,
  CloudRain,
  CloudSnow,
  Coins,
  Heart,
  Moon,
  Sun,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";

interface GameHUDProps {
  health: number;
  maxHealth: number;
  energy: number;
  maxEnergy: number;
  money: number;
}

/**
 * Game HUD Component
 * Displays player stats, time, and game info
 */
export function GameHUD({
  health,
  maxHealth,
  energy,
  maxEnergy,
  money,
}: GameHUDProps) {
  const [time, setTime] = useState<TimeState | null>(null);

  useEffect(() => {
    const timeManager = TimeManager.getInstance();

    // Subscribe to time changes
    timeManager.onTimeChange((newTime) => {
      setTime(newTime);
    });

    // Get initial time
    setTime(timeManager.getTime());
  }, []);

  const getWeatherIcon = () => {
    if (!time) return <Sun className="w-5 h-5" />;

    switch (time.weather) {
      case "sunny":
        return <Sun className="w-5 h-5 text-yellow-400" />;
      case "rainy":
        return <CloudRain className="w-5 h-5 text-blue-400" />;
      case "stormy":
        return <CloudRain className="w-5 h-5 text-purple-400" />;
      case "snowy":
        return <CloudSnow className="w-5 h-5 text-cyan-200" />;
      default:
        return <Cloud className="w-5 h-5" />;
    }
  };

  const getTimeIcon = () => {
    if (!time) return <Sun className="w-5 h-5" />;
    return time.hour >= 6 && time.hour < 18 ? (
      <Sun className="w-5 h-5 text-yellow-400" />
    ) : (
      <Moon className="w-5 h-5 text-blue-300" />
    );
  };

  return (
    <div className="absolute top-0 left-0 right-0 p-4 pointer-events-none">
      <div className="flex justify-between items-start">
        {/* Left Side: Player Stats */}
        <div className="bg-black/60 backdrop-blur-sm rounded-lg p-3 space-y-2 pointer-events-auto">
          {/* Health */}
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-500 fill-red-500" />
            <div className="flex-1">
              <div className="w-32 h-4 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-red-500 transition-all duration-300"
                  style={{ width: `${(health / maxHealth) * 100}%` }}
                />
              </div>
            </div>
            <span className="text-white text-sm font-bold min-w-12 text-right">
              {health}/{maxHealth}
            </span>
          </div>

          {/* Energy */}
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-500 fill-yellow-500" />
            <div className="flex-1">
              <div className="w-32 h-4 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-500 transition-all duration-300"
                  style={{ width: `${(energy / maxEnergy) * 100}%` }}
                />
              </div>
            </div>
            <span className="text-white text-sm font-bold min-w-12 text-right">
              {Math.round(energy)}/{maxEnergy}
            </span>
          </div>

          {/* Money */}
          <div className="flex items-center gap-2">
            <Coins className="w-5 h-5 text-yellow-400 fill-yellow-400" />
            <span className="text-white text-sm font-bold">
              {money.toLocaleString()}g
            </span>
          </div>
        </div>

        {/* Right Side: Time & Weather */}
        {time && (
          <div className="bg-black/60 backdrop-blur-sm rounded-lg p-3 space-y-2 text-white pointer-events-auto">
            {/* Time */}
            <div className="flex items-center gap-2">
              {getTimeIcon()}
              <span className="text-sm font-bold">
                {String(time.hour % 12 || 12).padStart(2, "0")}:
                {String(time.minute).padStart(2, "0")}
                {time.hour < 12 ? " AM" : " PM"}
              </span>
            </div>

            {/* Date */}
            <div className="text-sm">
              <div className="font-semibold capitalize">
                {time.season} {time.day}
              </div>
              <div className="text-xs text-gray-300">Year {time.year}</div>
            </div>

            {/* Weather */}
            <div className="flex items-center gap-2">
              {getWeatherIcon()}
              <span className="text-xs capitalize">{time.weather}</span>
            </div>
          </div>
        )}
      </div>

      {/* Controls Info (Bottom) */}
      <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm rounded-lg p-3 text-white text-xs pointer-events-auto">
        <div className="space-y-1">
          <div>
            <span className="font-bold">WASD / Arrows:</span> Move
          </div>
          <div>
            <span className="font-bold">Shift:</span> Run
          </div>
          <div>
            <span className="font-bold">ESC:</span> Menu
          </div>
        </div>
      </div>
    </div>
  );
}
