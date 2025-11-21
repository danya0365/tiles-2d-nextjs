/* eslint-disable react-hooks/exhaustive-deps */
import { Eye, EyeOff, Redo, Save, Trash2, Undo, Upload } from "lucide-react";
import type React from "react";
import { useEffect, useRef, useState } from "react";

const TILE_SIZE = 32;
const GRID_WIDTH = 30;
const GRID_HEIGHT = 20;

// Tile definitions
const TILES = {
  grass: { name: "Grass", color: "#7cb342", icon: "🌱", walkable: true },
  dirt: { name: "Dirt", color: "#8d6e63", icon: "🟫", walkable: true },
  water: { name: "Water", color: "#42a5f5", icon: "💧", walkable: false },
  stone: { name: "Stone", color: "#757575", icon: "🪨", walkable: false },
  sand: { name: "Sand", color: "#ffd54f", icon: "🏖️", walkable: true },
  wood: { name: "Wood", color: "#5d4037", icon: "🪵", walkable: false },
};

// Objects that can be placed on tiles
const OBJECTS = {
  tree: { name: "Tree", icon: "🌲", walkable: false },
  house: { name: "House", icon: "🏠", walkable: false },
  rock: { name: "Rock", icon: "🪨", walkable: false },
  flower: { name: "Flower", icon: "🌸", walkable: true },
  bush: { name: "Bush", icon: "🌿", walkable: false },
};

type TileKey = keyof typeof TILES;
type ObjectKey = keyof typeof OBJECTS;

type Cell = {
  tile: TileKey;
  object: ObjectKey | null;
};

type Grid = Cell[][];

const WorldBuilderGame = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [grid, setGrid] = useState<Grid>(() => initializeGrid());
  const [selectedTile, setSelectedTile] = useState<TileKey>("grass");
  const [selectedObject, setSelectedObject] = useState<ObjectKey | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState("tile"); // 'tile', 'object', 'erase'
  const [history, setHistory] = useState<Grid[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [showGrid, setShowGrid] = useState(true);
  const [player, setPlayer] = useState({ x: 5, y: 5 });
  const [mode, setMode] = useState("build"); // 'build' or 'play'
  const [cameraOffset, setCameraOffset] = useState({ x: 0, y: 0 });
  const [playerPosition, setPlayerPosition] = useState({
    x: 5 * TILE_SIZE,
    y: 5 * TILE_SIZE,
  });
  const [isMoving, setIsMoving] = useState(false);

  function initializeGrid(): Grid {
    const newGrid: Grid = [];
    for (let y = 0; y < GRID_HEIGHT; y++) {
      newGrid[y] = [];
      for (let x = 0; x < GRID_WIDTH; x++) {
        newGrid[y][x] = { tile: "grass", object: null };
      }
    }
    return newGrid;
  }

  // Save to history for undo/redo
  const saveToHistory = (newGrid: Grid) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(JSON.parse(JSON.stringify(newGrid)));
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  // Undo
  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setGrid(JSON.parse(JSON.stringify(history[historyIndex - 1])));
    }
  };

  // Redo
  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setGrid(JSON.parse(JSON.stringify(history[historyIndex + 1])));
    }
  };

  // Save world
  const saveWorld = () => {
    const saveData = {
      grid,
      player,
      timestamp: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(saveData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `world_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Load world
  const loadWorld = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const result = e.target?.result;
          if (!result) return;
          const saveData = JSON.parse(result as string);
          setGrid(saveData.grid);
          setPlayer(saveData.player);
          saveToHistory(saveData.grid);
        } catch (error) {
          alert("Failed to load world file");
        }
      };
      reader.readAsText(file);
    }
  };

  // Handle canvas click/draw
  const handleCanvasInteraction = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (mode === "play") return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / TILE_SIZE);
    const y = Math.floor((e.clientY - rect.top) / TILE_SIZE);

    if (x >= 0 && x < GRID_WIDTH && y >= 0 && y < GRID_HEIGHT) {
      const newGrid = JSON.parse(JSON.stringify(grid));

      if (tool === "tile") {
        newGrid[y][x].tile = selectedTile;
      } else if (tool === "object") {
        newGrid[y][x].object = selectedObject;
      } else if (tool === "erase") {
        newGrid[y][x].object = null;
      }

      setGrid(newGrid);
      if (!isDrawing) {
        saveToHistory(newGrid);
      }
    }
  };

  // Handle player movement
  const movePlayer = (dx: number, dy: number) => {
    if (isMoving) return;

    const newX = player.x + dx;
    const newY = player.y + dy;

    if (newX >= 0 && newX < GRID_WIDTH && newY >= 0 && newY < GRID_HEIGHT) {
      const targetCell = grid[newY][newX];
      const tileWalkable = TILES[targetCell.tile].walkable;
      const objectWalkable =
        !targetCell.object || OBJECTS[targetCell.object].walkable;

      if (tileWalkable && objectWalkable) {
        const startX = playerPosition.x;
        const startY = playerPosition.y;
        const targetX = newX * TILE_SIZE;
        const targetY = newY * TILE_SIZE;
        const duration = 150; // ms
        const startTime = performance.now();

        setIsMoving(true);

        const animate = (time: number) => {
          const elapsed = time - startTime;
          const t = Math.min(elapsed / duration, 1);

          const currentX = startX + (targetX - startX) * t;
          const currentY = startY + (targetY - startY) * t;
          setPlayerPosition({ x: currentX, y: currentY });

          if (t < 1) {
            requestAnimationFrame(animate);
          } else {
            setPlayer({ x: newX, y: newY });
            setIsMoving(false);
          }
        };

        requestAnimationFrame(animate);
      }
    }
  };

  // Keyboard controls for player
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (mode !== "play") return;
      if (isMoving) return;

      switch (e.key) {
        case "ArrowUp":
        case "w":
        case "W":
          e.preventDefault();
          movePlayer(0, -1);
          break;
        case "ArrowDown":
        case "s":
        case "S":
          e.preventDefault();
          movePlayer(0, 1);
          break;
        case "ArrowLeft":
        case "a":
        case "A":
          e.preventDefault();
          movePlayer(-1, 0);
          break;
        case "ArrowRight":
        case "d":
        case "D":
          e.preventDefault();
          movePlayer(1, 0);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [mode, player, grid, isMoving]);

  // Draw on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw tiles
    for (let y = 0; y < GRID_HEIGHT; y++) {
      for (let x = 0; x < GRID_WIDTH; x++) {
        const cell = grid[y][x];
        const tile = TILES[cell.tile];

        // Draw tile
        ctx.fillStyle = tile.color;
        ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);

        // Draw grid
        if (showGrid && mode === "build") {
          ctx.strokeStyle = "rgba(0, 0, 0, 0.1)";
          ctx.strokeRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
        }

        // Draw object
        if (cell.object) {
          ctx.font = "20px Arial";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(
            OBJECTS[cell.object].icon,
            x * TILE_SIZE + TILE_SIZE / 2,
            y * TILE_SIZE + TILE_SIZE / 2
          );
        }
      }
    }

    // Draw player
    if (mode === "play") {
      ctx.font = "24px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(
        "🧑",
        playerPosition.x + TILE_SIZE / 2,
        playerPosition.y + TILE_SIZE / 2
      );
    }
  }, [grid, showGrid, mode, playerPosition]);

  return (
    <div className="w-full h-screen bg-gray-900 text-white flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 p-4 border-b border-gray-700">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold">🌍 World Builder</h1>

          <div className="flex gap-2">
            {/* Mode Toggle */}
            <button
              onClick={() => setMode(mode === "build" ? "play" : "build")}
              className={`px-4 py-2 rounded font-semibold ${
                mode === "play"
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {mode === "build" ? "▶️ Play Mode" : "🔨 Build Mode"}
            </button>

            {mode === "build" && (
              <>
                <button
                  onClick={undo}
                  disabled={historyIndex <= 0}
                  className="p-2 bg-gray-700 hover:bg-gray-600 rounded disabled:opacity-50"
                  title="Undo"
                >
                  <Undo size={20} />
                </button>
                <button
                  onClick={redo}
                  disabled={historyIndex >= history.length - 1}
                  className="p-2 bg-gray-700 hover:bg-gray-600 rounded disabled:opacity-50"
                  title="Redo"
                >
                  <Redo size={20} />
                </button>
                <button
                  onClick={() => setShowGrid(!showGrid)}
                  className="p-2 bg-gray-700 hover:bg-gray-600 rounded"
                  title="Toggle Grid"
                >
                  {showGrid ? <Eye size={20} /> : <EyeOff size={20} />}
                </button>
                <button
                  onClick={saveWorld}
                  className="p-2 bg-gray-700 hover:bg-gray-600 rounded"
                  title="Save World"
                >
                  <Save size={20} />
                </button>
                <label
                  className="p-2 bg-gray-700 hover:bg-gray-600 rounded cursor-pointer"
                  title="Load World"
                >
                  <Upload size={20} />
                  <input
                    type="file"
                    accept=".json"
                    onChange={loadWorld}
                    className="hidden"
                  />
                </label>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Tools */}
        {mode === "build" && (
          <div className="w-64 bg-gray-800 p-4 overflow-y-auto border-r border-gray-700">
            {/* Tool Selection */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">🔧 Tools</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setTool("tile")}
                  className={`flex-1 p-3 rounded ${
                    tool === "tile"
                      ? "bg-blue-600"
                      : "bg-gray-700 hover:bg-gray-600"
                  }`}
                >
                  Tile
                </button>
                <button
                  onClick={() => setTool("object")}
                  className={`flex-1 p-3 rounded ${
                    tool === "object"
                      ? "bg-blue-600"
                      : "bg-gray-700 hover:bg-gray-600"
                  }`}
                >
                  Object
                </button>
                <button
                  onClick={() => setTool("erase")}
                  className={`flex-1 p-3 rounded ${
                    tool === "erase"
                      ? "bg-red-600"
                      : "bg-gray-700 hover:bg-gray-600"
                  }`}
                >
                  <Trash2 size={20} className="mx-auto" />
                </button>
              </div>
            </div>

            {/* Tile Palette */}
            {tool === "tile" && (
              <div>
                <h3 className="text-lg font-semibold mb-3">🎨 Tiles</h3>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(TILES).map(([key, tile]) => (
                    <button
                      key={key}
                      onClick={() => setSelectedTile(key as TileKey)}
                      className={`p-3 rounded flex flex-col items-center gap-2 ${
                        selectedTile === key
                          ? "bg-blue-600"
                          : "bg-gray-700 hover:bg-gray-600"
                      }`}
                    >
                      <span className="text-2xl">{tile.icon}</span>
                      <span className="text-xs">{tile.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Object Palette */}
            {tool === "object" && (
              <div>
                <h3 className="text-lg font-semibold mb-3">🏗️ Objects</h3>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(OBJECTS).map(([key, obj]) => (
                    <button
                      key={key}
                      onClick={() => setSelectedObject(key as ObjectKey)}
                      className={`p-3 rounded flex flex-col items-center gap-2 ${
                        selectedObject === key
                          ? "bg-blue-600"
                          : "bg-gray-700 hover:bg-gray-600"
                      }`}
                    >
                      <span className="text-2xl">{obj.icon}</span>
                      <span className="text-xs">{obj.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Main Canvas Area */}
        <div className="flex-1 flex flex-col items-center justify-center bg-gray-900 p-8">
          {mode === "play" && (
            <div className="mb-4 text-center bg-gray-800 px-6 py-3 rounded">
              <p className="text-sm">🎮 Use Arrow Keys or WASD to move</p>
            </div>
          )}

          <canvas
            ref={canvasRef}
            width={GRID_WIDTH * TILE_SIZE}
            height={GRID_HEIGHT * TILE_SIZE}
            className="border-4 border-gray-700 cursor-pointer"
            onMouseDown={(e) => {
              setIsDrawing(true);
              handleCanvasInteraction(e);
            }}
            onMouseMove={(e) => {
              if (isDrawing) handleCanvasInteraction(e);
            }}
            onMouseUp={() => setIsDrawing(false)}
            onMouseLeave={() => setIsDrawing(false)}
            onClick={handleCanvasInteraction}
          />

          {mode === "build" && (
            <div className="mt-4 text-center text-sm text-gray-400">
              Click or drag to paint • Selected:{" "}
              {tool === "tile"
                ? TILES[selectedTile].name
                : tool === "object"
                ? selectedObject
                  ? OBJECTS[selectedObject].name
                  : "None"
                : "Eraser"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorldBuilderGame;
