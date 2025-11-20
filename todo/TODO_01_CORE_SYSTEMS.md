# ⚙️ TODO_01_CORE_SYSTEMS.md - Core Game Systems

ระบบหลักของเกมที่เป็นพื้นฐานสำหรับทุกฟีเจอร์

---

## 🎯 Game Engine Setup

### Excalibur Engine Configuration

- [ ] สร้าง `ExcaliburGame` class พร้อม config
  - [ ] กำหนด resolution (1280x720 default)
  - [ ] ตั้งค่า physics engine
  - [ ] กำหนด FPS target (60)
  - [ ] เปิดใช้งาน antialiasing
- [ ] สร้าง main game loop
- [ ] จัดการ Scene management
- [ ] สร้าง Scene transitions

### Asset Loading System

- [ ] สร้าง `AssetManager` class
  - [ ] โหลด sprite sheets จาก Sprout Lands
  - [ ] โหลด tilesets
  - [ ] โหลด sound effects
  - [ ] โหลด background music
  - [ ] สร้าง loading screen พร้อม progress bar
- [ ] จัดการ sprite animations
- [ ] Cache management

---

## 🎮 Player System

### Player Entity

- [ ] สร้าง `Player` class extends Excalibur Actor
  - [ ] กำหนด base stats (HP, Energy, Speed)
  - [ ] Player sprite & animations
  - [ ] Collision body
- [ ] Animation states:
  - [ ] Idle (4 directions: up, down, left, right)
  - [ ] Walk (4 directions)
  - [ ] Run (4 directions)
  - [ ] Use tool (4 directions)
  - [ ] Exhausted state

### Player Controller

- [ ] สร้าง input handling
  - [ ] WASD / Arrow keys movement
  - [ ] Shift to run
  - [ ] Mouse click interaction
  - [ ] Hotkey bar (1-9)
  - [ ] Tab for inventory
  - [ ] E for interact
  - [ ] ESC for menu
- [ ] Implement movement physics
  - [ ] Smooth acceleration/deceleration
  - [ ] Speed modifiers (walk/run)
  - [ ] Collision detection
- [ ] Gamepad support (optional)

### Player Stats

- [ ] สร้าง `PlayerStats` class
  - [ ] Health (max 100)
  - [ ] Energy (max 100)
  - [ ] Money (gold)
  - [ ] Current position
  - [ ] Facing direction
- [ ] Energy consumption system
  - [ ] Walking: -0.1/sec
  - [ ] Running: -0.3/sec
  - [ ] Tool usage: -2 to -4
  - [ ] Auto regeneration: +1/sec when idle
- [ ] Health system
  - [ ] Damage from enemies
  - [ ] Healing from food
  - [ ] Death/respawn logic

---

## 🗺️ Map & Tilemap System

### Tilemap Engine

- [ ] สร้าง `TilemapManager` class
  - [ ] โหลด tilemap จาก Tiled (\*.tmx)
  - [ ] Render multiple layers:
    - [ ] Ground layer
    - [ ] Objects layer
    - [ ] Decorations layer
    - [ ] Collision layer
    - [ ] Foreground layer
  - [ ] Optimize rendering (chunk-based)
- [ ] Implement tile animations (water, grass)

### Collision System

- [ ] สร้าง collision maps
  - [ ] Wall/building collisions
  - [ ] Water collisions
  - [ ] Cliff collisions
  - [ ] Tree/rock collisions
- [ ] Implement trigger zones
  - [ ] Door transitions
  - [ ] Map transitions
  - [ ] NPC interaction zones
- [ ] Z-index sorting (player behind/in front of objects)

### World Maps

- [ ] สร้างแผนที่หลัก:
  - [ ] **Farm** - ฟาร์มของผู้เล่น
  - [ ] **Town** - เมืองกลาง (shops, NPCs)
  - [ ] **Forest** - ป่าเก็บของ
  - [ ] **Mountain** - เหมือง
  - [ ] **Beach** - ชายหาด (ตกปลา)
  - [ ] **Desert** (unlockable)
- [ ] Map transitions & loading

---

## 📷 Camera System

### Camera Controller

- [ ] สร้าง `CameraController` class
  - [ ] Follow player smoothly
  - [ ] Zoom in/out (min: 1x, max: 4x)
  - [ ] Lock to map boundaries
  - [ ] Smooth interpolation (lerp)
- [ ] Implement camera shake effects
  - [ ] On tool use
  - [ ] On explosion
  - [ ] On damage
- [ ] Split-screen support (multiplayer)

---

## ⏰ Time & Calendar System

### Time Manager

- [ ] สร้าง `TimeManager` class
  - [ ] Real-time to game-time conversion
  - [ ] 1 real second = 1 game minute
  - [ ] Day length: 20 minutes (6:00 AM - 2:00 AM)
- [ ] Time progression
  - [ ] Current hour/minute
  - [ ] Day/Night cycle
  - [ ] Pause time (in menus)
- [ ] Auto-save at day end

### Calendar System

- [ ] สร้าง `CalendarManager` class
  - [ ] Season system (Spring, Summer, Fall, Winter)
  - [ ] 28 days per season
  - [ ] Current date tracking (Day X, Season Y, Year Z)
  - [ ] Week tracking (Mon-Sun)
- [ ] Season effects
  - [ ] Different crops per season
  - [ ] Weather changes
  - [ ] Festival dates

### Day/Night Cycle

- [ ] Visual lighting system
  - [ ] Morning (6 AM - 12 PM): Bright
  - [ ] Afternoon (12 PM - 6 PM): Normal
  - [ ] Evening (6 PM - 8 PM): Orange tint
  - [ ] Night (8 PM - 2 AM): Dark blue tint
  - [ ] Midnight (2 AM): Force sleep
- [ ] Lighting effects
  - [ ] Global lighting overlay
  - [ ] Light sources (lamps, torches)
  - [ ] Shadow casting (optional)

### Weather System

- [ ] สร้าง `WeatherManager` class
  - [ ] Weather types:
    - [ ] Sunny (80%)
    - [ ] Rainy (15%)
    - [ ] Stormy (3%)
    - [ ] Snowy (Winter only, 20%)
  - [ ] Weather effects on gameplay:
    - [ ] Rain: Auto-water crops
    - [ ] Storm: Damage crops/buildings
    - [ ] Snow: Slower movement
- [ ] Particle effects
  - [ ] Rain particles
  - [ ] Snow particles
  - [ ] Lightning flash

---

## 💾 Save/Load System

### Save Manager

- [ ] สร้าง `SaveManager` class
  - [ ] Save game state to LocalStorage
  - [ ] Multiple save slots (3 slots)
  - [ ] Auto-save every night
  - [ ] Manual save option
- [ ] Saved data structure:
  ```typescript
  {
    player: { stats, position, inventory, skills },
    farm: { crops, buildings, animals },
    world: { npcs, relationships, quests },
    time: { day, season, year, time },
    progress: { achievements, unlocks }
  }
  ```
- [ ] Load game from save
- [ ] Delete save option
- [ ] Export/Import save (JSON)

### Save Validation

- [ ] Version checking
- [ ] Data corruption handling
- [ ] Migration system (old saves → new version)

---

## 🎨 UI System

### HUD (Heads-Up Display)

- [ ] สร้าง HUD components:
  - [ ] Health bar (top-left)
  - [ ] Energy bar (top-left)
  - [ ] Money display (top-right)
  - [ ] Current time (top-center)
  - [ ] Current day/season (top-center)
  - [ ] Hotkey bar (bottom-center)
  - [ ] Tool/item icon (bottom-left)
- [ ] HUD animations
  - [ ] Flash on damage
  - [ ] Pulse on low energy
  - [ ] Coin animation on earn

### Menu System

- [ ] สร้าง menu screens:
  - [ ] Main Menu
    - [ ] New Game
    - [ ] Load Game
    - [ ] Options
    - [ ] Credits
    - [ ] Exit
  - [ ] Pause Menu (ESC)
    - [ ] Resume
    - [ ] Save Game
    - [ ] Options
    - [ ] Exit to Menu
  - [ ] Options Menu
    - [ ] Audio settings
    - [ ] Graphics settings
    - [ ] Controls settings
    - [ ] Language settings
- [ ] Modal dialogs
  - [ ] Confirmation dialogs
  - [ ] Alert messages
  - [ ] Tooltips

### Inventory UI

- [ ] สร้าง inventory screen (Tab)
  - [ ] Grid layout (36 slots)
  - [ ] Item icons & quantities
  - [ ] Drag & drop
  - [ ] Stack splitting (Shift+click)
  - [ ] Item tooltips (hover)
- [ ] Organize/sort buttons
- [ ] Trash can (delete items)

---

## 🔊 Audio System

### Audio Manager

- [ ] สร้าง `AudioManager` class
  - [ ] Background music player
  - [ ] SFX player with pooling
  - [ ] Volume controls (master, music, sfx)
  - [ ] Mute/unmute
- [ ] Music tracks:
  - [ ] Main Menu theme
  - [ ] Spring theme
  - [ ] Summer theme
  - [ ] Fall theme
  - [ ] Winter theme
  - [ ] Mine theme
  - [ ] Night theme
- [ ] Sound effects:
  - [ ] Footsteps
  - [ ] Tool sounds (hoe, axe, pickaxe, watering can)
  - [ ] UI sounds (click, hover)
  - [ ] Ambient sounds (birds, wind, rain)

---

## 🎯 Interaction System

### Interaction Manager

- [ ] สร้าง `InteractionManager` class
  - [ ] Raycast from player facing direction
  - [ ] Detect interactable objects
  - [ ] Show interaction prompt ("Press E to interact")
  - [ ] Trigger interaction on key press
- [ ] Interactable types:
  - [ ] NPCs → Dialogue
  - [ ] Chests → Open inventory
  - [ ] Doors → Transition map
  - [ ] Signs → Show text
  - [ ] Machines → Use/collect

---

## ⚡ Performance Optimization

### Optimization Techniques

- [ ] Object pooling
  - [ ] Particle effects
  - [ ] Projectiles
  - [ ] Sound effects
- [ ] Culling system
  - [ ] Only render on-screen entities
  - [ ] Distance-based LOD (optional)
- [ ] Chunk-based loading
  - [ ] Load nearby chunks only
  - [ ] Unload far chunks
- [ ] Sprite batching
- [ ] Lazy loading of assets

### Profiling

- [ ] FPS counter (debug mode)
- [ ] Entity count display
- [ ] Memory usage monitor
- [ ] Draw call counter

---

## 🐛 Debug Tools

### Debug Mode

- [ ] Toggle with F3
- [ ] Show debug info:
  - [ ] FPS
  - [ ] Player position
  - [ ] Current chunk
  - [ ] Entity count
  - [ ] Collision boxes
  - [ ] Tile grid
- [ ] Cheat commands:
  - [ ] Give item
  - [ ] Set time
  - [ ] Teleport
  - [ ] Toggle noclip
  - [ ] Add money
  - [ ] Set skill level

---

## ✅ Testing Checklist

- [ ] Player can move smoothly in all directions
- [ ] Collisions work correctly
- [ ] Camera follows player
- [ ] Time progresses correctly
- [ ] Day/Night cycle transitions smoothly
- [ ] UI displays correct information
- [ ] Save/Load works without errors
- [ ] Audio plays correctly
- [ ] Performance: stable 60 FPS
- [ ] No memory leaks
