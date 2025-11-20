"use client";

import * as ex from "excalibur";
import { useEffect, useRef, useState } from "react";

type GameStats = {
  hp: number;
  maxHp: number;
  gold: number;
  level: number;
};

const INITIAL_GAME_STATS: GameStats = {
  hp: 100,
  maxHp: 100,
  gold: 0,
  level: 1,
};

const useGameStats = () => {
  const [gameStats, setGameStats] = useState<GameStats>(INITIAL_GAME_STATS);

  // ฟื้นฟู HP
  useEffect(() => {
    const healInterval = setInterval(() => {
      setGameStats((prev) => {
        if (prev.hp < prev.maxHp) {
          return { ...prev, hp: Math.min(prev.maxHp, prev.hp + 1) };
        }
        return prev;
      });
    }, 2000);

    return () => clearInterval(healInterval);
  }, [setGameStats]);

  return { gameStats, setGameStats } as const;
};

const ExcaliburRPG = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null!);
  const engineRef = useRef<ex.Engine>(null!);
  const { gameStats, setGameStats } = useGameStats();

  useEffect(() => {
    // สร้าง Engine
    const engine = new ex.Engine({
      // logical resolution ของเกม
      width: 900,
      height: 900,
      canvasElement: canvasRef.current,
      // ให้ canvas ปรับขนาดตาม container ของมัน แทนทั้งหน้าจอ
      displayMode: ex.DisplayMode.FitContainer,
      pixelArt: true,
      backgroundColor: ex.Color.fromHex("#2d5016"),
    });
    engineRef.current = engine;

    // ===== สร้างตัวละคร Player =====
    const player = new ex.Actor({
      pos: new ex.Vector(400, 300),
      width: 32,
      height: 32,
      color: ex.Color.Blue,
      z: 10,
    });

    // เพิ่ม collision box
    player.body.collisionType = ex.CollisionType.Active;

    // ระบบการเคลื่อนที่
    let velocity = ex.Vector.Zero;
    const speed = 150;

    player.on("preupdate", (evt) => {
      velocity = ex.Vector.Zero;

      if (
        engine.input.keyboard.isHeld(ex.Keys.W) ||
        engine.input.keyboard.isHeld(ex.Keys.Up)
      ) {
        velocity.y = -1;
      }
      if (
        engine.input.keyboard.isHeld(ex.Keys.S) ||
        engine.input.keyboard.isHeld(ex.Keys.Down)
      ) {
        velocity.y = 1;
      }
      if (
        engine.input.keyboard.isHeld(ex.Keys.A) ||
        engine.input.keyboard.isHeld(ex.Keys.Left)
      ) {
        velocity.x = -1;
      }
      if (
        engine.input.keyboard.isHeld(ex.Keys.D) ||
        engine.input.keyboard.isHeld(ex.Keys.Right)
      ) {
        velocity.x = 1;
      }

      if (velocity.x !== 0 || velocity.y !== 0) {
        velocity = velocity.normalize().scale(speed);
      }

      player.vel = velocity;
    });

    // ===== สร้าง Tilemap (พื้นโลก) =====
    const createTilemap = () => {
      const tileSize = 64;
      const mapWidth = 25;
      const mapHeight = 20;

      // สร้างพื้นหญ้า
      for (let x = 0; x < mapWidth; x++) {
        for (let y = 0; y < mapHeight; y++) {
          const grassTile = new ex.Actor({
            pos: new ex.Vector(
              x * tileSize + tileSize / 2,
              y * tileSize + tileSize / 2
            ),
            width: tileSize,
            height: tileSize,
            color:
              Math.random() > 0.5
                ? ex.Color.fromHex("#3d6b1f")
                : ex.Color.fromHex("#4a7c2a"),
            z: 0,
          });
          engine.add(grassTile);
        }
      }

      // สร้างกำแพงขอบแผนที่
      const wallColor = ex.Color.fromHex("#654321");

      // กำแพงบน-ล่าง
      for (let x = 0; x < mapWidth; x++) {
        const topWall = new ex.Actor({
          pos: new ex.Vector(x * tileSize + tileSize / 2, tileSize / 2),
          width: tileSize,
          height: tileSize,
          color: wallColor,
          z: 5,
        });
        topWall.body.collisionType = ex.CollisionType.Fixed;
        engine.add(topWall);

        const bottomWall = new ex.Actor({
          pos: new ex.Vector(
            x * tileSize + tileSize / 2,
            (mapHeight - 1) * tileSize + tileSize / 2
          ),
          width: tileSize,
          height: tileSize,
          color: wallColor,
          z: 5,
        });
        bottomWall.body.collisionType = ex.CollisionType.Fixed;
        engine.add(bottomWall);
      }

      // กำแพงซ้าย-ขวา
      for (let y = 1; y < mapHeight - 1; y++) {
        const leftWall = new ex.Actor({
          pos: new ex.Vector(tileSize / 2, y * tileSize + tileSize / 2),
          width: tileSize,
          height: tileSize,
          color: wallColor,
          z: 5,
        });
        leftWall.body.collisionType = ex.CollisionType.Fixed;
        engine.add(leftWall);

        const rightWall = new ex.Actor({
          pos: new ex.Vector(
            (mapWidth - 1) * tileSize + tileSize / 2,
            y * tileSize + tileSize / 2
          ),
          width: tileSize,
          height: tileSize,
          color: wallColor,
          z: 5,
        });
        rightWall.body.collisionType = ex.CollisionType.Fixed;
        engine.add(rightWall);
      }
    };

    // ===== สร้างต้นไม้และสิ่งกีดขวาง =====
    const createObstacles = () => {
      const treePositions = [
        [200, 200],
        [600, 200],
        [400, 400],
        [150, 450],
        [700, 300],
        [300, 500],
        [500, 150],
        [650, 450],
        [250, 350],
      ];

      treePositions.forEach(([x, y]) => {
        const tree = new ex.Actor({
          pos: new ex.Vector(x, y),
          width: 40,
          height: 60,
          color: ex.Color.fromHex("#2d5016"),
          z: 8,
        });
        tree.body.collisionType = ex.CollisionType.Fixed;

        // ใบไม้
        const leaves = new ex.Actor({
          pos: new ex.Vector(x, y - 20),
          width: 60,
          height: 50,
          color: ex.Color.fromHex("#228b22"),
          z: 9,
        });
        leaves.body.collisionType = ex.CollisionType.Fixed;

        engine.add(tree);
        engine.add(leaves);
      });
    };

    // ===== สร้าง NPCs =====
    const createNPCs = () => {
      const npcData = [
        { x: 300, y: 250, color: "#ff6b6b", name: "Merchant" },
        { x: 500, y: 350, color: "#4ecdc4", name: "Villager" },
        { x: 600, y: 500, color: "#ffe66d", name: "Guard" },
      ];

      npcData.forEach((data) => {
        const npc = new ex.Actor({
          pos: new ex.Vector(data.x, data.y),
          width: 32,
          height: 32,
          color: ex.Color.fromHex(data.color),
          z: 10,
        });
        npc.body.collisionType = ex.CollisionType.Fixed;

        // เมื่อ player ชนกับ NPC
        npc.on("collisionstart", (evt) => {
          if (evt.other.owner === player) {
            console.log(`Talking to ${data.name}!`);

            if (data.name === "Merchant") {
              setGameStats((prev) => ({ ...prev, gold: prev.gold + 10 }));
            }
          }
        });

        // NPC เดินสุ่ม
        const moveRandomly = () => {
          const randomX = Math.random() * 40 - 20;
          const randomY = Math.random() * 40 - 20;
          npc.vel = new ex.Vector(randomX, randomY);

          setTimeout(() => {
            npc.vel = ex.Vector.Zero;
            setTimeout(moveRandomly, Math.random() * 2000 + 1000);
          }, 1000);
        };
        moveRandomly();

        engine.add(npc);
      });
    };

    // ===== สร้างเหรียญทองที่เก็บได้ =====
    const createCollectibles = () => {
      for (let i = 0; i < 10; i++) {
        const coin = new ex.Actor({
          pos: new ex.Vector(
            Math.random() * 700 + 100,
            Math.random() * 500 + 100
          ),
          width: 20,
          height: 20,
          color: ex.Color.Yellow,
          z: 5,
        });
        coin.body.collisionType = ex.CollisionType.Passive;

        coin.on("collisionstart", (evt) => {
          if (evt.other.owner === player) {
            coin.kill();
            setGameStats((prev) => ({
              ...prev,
              gold: prev.gold + 5,
            }));
          }
        });

        engine.add(coin);
      }
    };

    // ===== สร้างศัตรู =====
    const createEnemies = () => {
      for (let i = 0; i < 5; i++) {
        const enemy = new ex.Actor({
          pos: new ex.Vector(
            Math.random() * 600 + 150,
            Math.random() * 400 + 150
          ),
          width: 28,
          height: 28,
          color: ex.Color.Red,
          z: 10,
        });
        enemy.body.collisionType = ex.CollisionType.Active;

        // AI ติดตาม player
        enemy.on("preupdate", () => {
          const direction = player.pos.sub(enemy.pos);
          const distance = direction.size;

          if (distance < 200 && distance > 35) {
            enemy.vel = direction.normalize().scale(80);
          } else if (distance <= 35) {
            enemy.vel = ex.Vector.Zero;
            // โจมตี player
            setGameStats((prev) => {
              const newHp = Math.max(0, prev.hp - 0.1);
              return { ...prev, hp: newHp };
            });
          } else {
            enemy.vel = ex.Vector.Zero;
          }
        });

        // เมื่อโจมตีศัตรู (กด Spacebar)
        engine.input.keyboard.on("press", (evt) => {
          if (evt.key === ex.Keys.Space) {
            const distance = player.pos.sub(enemy.pos).size;
            if (distance < 50 && enemy.isKilled() === false) {
              enemy.kill();
              setGameStats((prev) => ({
                ...prev,
                gold: prev.gold + 20,
                level: Math.floor((prev.gold + 20) / 100) + 1,
              }));
            }
          }
        });

        engine.add(enemy);
      }
    };

    // ===== กล้องติดตาม Player =====
    engine.currentScene.camera.strategy.lockToActor(player);
    engine.currentScene.camera.zoom = 1.5;

    // ===== เริ่มเกม =====
    createTilemap();
    createObstacles();
    createNPCs();
    createCollectibles();
    createEnemies();
    engine.add(player);

    engine.start();

    // Cleanup
    return () => {
      engine.stop();
    };
  }, []);

  return (
    <section className="flex h-dvh w-full items-center justify-center bg-slate-950 px-4 py-6 text-white">
      <div className="flex h-full w-full max-w-5xl flex-col overflow-hidden rounded-[32px] border border-white/10 bg-slate-900/90 p-4 shadow-2xl backdrop-blur-md sm:p-8">
        <header className="flex flex-col items-center gap-2 pb-4 text-center">
          <h1 className="text-3xl font-bold text-green-400">
            🎮 Open World RPG
          </h1>
          <p className="text-sm text-slate-300">
            Explore, collect, level up, and survive in a cozy top-down world.
          </p>
        </header>

        <div className="flex flex-1 flex-col gap-4">
          {/* Stats Bar */}
          <section className="grid grid-cols-1 gap-4 rounded-2xl bg-slate-800/70 p-4 sm:grid-cols-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-slate-300">
                HP
              </p>
              <div className="mt-2 h-5 rounded-full bg-slate-700">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-rose-500 to-orange-400 transition-all duration-300"
                  style={{
                    width: `${(gameStats.hp / gameStats.maxHp) * 100}%`,
                  }}
                />
              </div>
              <p className="mt-1 text-xs text-slate-300">
                {Math.floor(gameStats.hp)}/{gameStats.maxHp}
              </p>
            </div>

            <div className="text-center">
              <p className="text-xs font-medium uppercase tracking-wider text-slate-300">
                Gold
              </p>
              <p className="mt-2 text-3xl font-semibold text-yellow-400">
                💰 {gameStats.gold}
              </p>
            </div>

            <div className="text-center">
              <p className="text-xs font-medium uppercase tracking-wider text-slate-300">
                Level
              </p>
              <p className="mt-2 text-3xl font-semibold text-blue-400">
                ⭐ {gameStats.level}
              </p>
            </div>
          </section>

          <div className="flex flex-1 flex-col gap-4 md:flex-row">
            {/* Game Canvas */}
            <section className="flex flex-1 items-stretch rounded-2xl border border-white/5 bg-gradient-to-b from-slate-900 to-slate-950 p-3 shadow-inner">
              <div className="h-full w-full rounded-xl bg-black/80 flex items-center justify-center">
                <canvas ref={canvasRef} className="h-full w-full" />
              </div>
            </section>

            {/* Controls */}
            <aside className="flex w-full flex-none flex-col gap-3 rounded-2xl bg-slate-800/80 p-4 text-sm leading-relaxed text-slate-200 md:w-72">
              <h3 className="text-lg font-semibold text-green-400">
                🎮 Controls
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm">
                <li>⌨️ WASD / Arrow Keys — Move around the world</li>
                <li>⚔️ SPACE — Attack nearby enemies</li>
                <li>💰 Walk over coins to collect them</li>
                <li>💬 Touch NPCs to start a conversation</li>
              </ul>
              <div className="rounded-xl border border-white/5 bg-slate-900/70 p-3 text-xs text-slate-300">
                <p>
                  🎯 Goal: Explore the world, collect gold, defeat enemies, and
                  talk to NPCs!
                </p>
                <p className="mt-1">
                  ⚠️ Red enemies will chase and attack you. Stay away or fight
                  them!
                </p>
              </div>
            </aside>
          </div>

          {gameStats.hp <= 0 && (
            <div className="rounded-2xl border border-red-500/40 bg-red-900/70 p-4 text-center shadow-lg">
              <h2 className="text-2xl font-bold text-red-100">💀 Game Over!</h2>
              <p className="text-sm text-red-200">
                Refresh the page to restart
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
export default ExcaliburRPG;
