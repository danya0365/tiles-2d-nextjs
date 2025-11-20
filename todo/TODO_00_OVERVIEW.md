# 🎮 Stardew Valley Game - Project Overview

## 📋 Project Description

สร้างเกม Stardew Valley แบบ 2D Top-Down RPG Farming Simulator โดยใช้ Excalibur.js v0.31.0 เป็น Game Engine

## 🎯 Core Concept

เกมแนว farming simulation ที่ผู้เล่นจะได้รับฟาร์มเก่าๆ และต้องพัฒนามันให้เจริญรุ่งเรือง ผสมผสานระบบ:

- 🌾 **Farming**: ปลูกพืช เลี้ยงสัตว์
- ⛏️ **Mining**: ขุดแร่หาทรัพยากร
- 🎣 **Fishing**: ตกปลาหารายได้
- 🌳 **Foraging**: เก็บของในป่า
- 👥 **Social**: สร้างความสัมพันธ์กับชาวบ้าน
- 🏠 **Building**: ขยายและตกแต่งฟาร์ม
- ⚔️ **Combat**: ต่อสู้กับมอนสเตอร์ในเหมือง
- 🎪 **Events**: เข้าร่วมงานเทศกาลประจำปี

## 🛠️ Tech Stack

- **Game Engine**: Excalibur.js v0.31.0
- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Multiplayer**: Colyseus
- **WebRTC**: PeerJS
- **Assets**: Sprout Lands Asset Pack

## 📂 Asset Path

`/Users/marosdeeuma/tiles-2d-nextjs/public/SproutLands`

## 🎨 Art Style

- Top-Down 2D Pixel Art
- Sprout Lands Asset Pack Theme
- Cute & Colorful Aesthetic

## 📝 Development Rules

ทุกครั้งที่สร้าง page.tsx ต้องทำตาม pattern ที่:
`/Users/marosdeeuma/tiles-2d-nextjs/prompt/CREATE_PAGE_PATTERN.md`

## 🗂️ TODO Structure

แบ่ง TODO ออกเป็น 15+ ไฟล์ตาม Features:

1. ✅ **TODO_00_OVERVIEW.md** - ภาพรวมโปรเจค
2. ⚙️ **TODO_01_CORE_SYSTEMS.md** - ระบบหลักของเกม
3. 🌾 **TODO_02_FARMING.md** - ระบบการเกษตร
4. ⛏️ **TODO_03_MINING.md** - ระบบขุดแร่
5. 🎣 **TODO_04_FISHING.md** - ระบบตกปลา
6. 🌳 **TODO_05_FORAGING.md** - ระบบเก็บของป่า
7. 🐄 **TODO_06_ANIMALS.md** - ระบบเลี้ยงสัตว์
8. 🔨 **TODO_07_CRAFTING.md** - ระบบสร้างของ
9. 🍳 **TODO_08_COOKING.md** - ระบบทำอาหาร
10. 💕 **TODO_09_RELATIONSHIPS.md** - ระบบความสัมพันธ์
11. 🎪 **TODO_10_EVENTS.md** - ระบบเทศกาลและอีเวนต์
12. 💰 **TODO_11_COMMERCE.md** - ระบบการค้าขาย
13. 🏠 **TODO_12_BUILDINGS.md** - ระบบสิ่งปลูกสร้าง
14. 📈 **TODO_13_PROGRESSION.md** - ระบบเลเวล & ทักษะ
15. ⏰ **TODO_14_TIME_CALENDAR.md** - ระบบเวลาและปฏิทิน
16. 🎒 **TODO_15_INVENTORY.md** - ระบบกระเป๋า
17. 🎯 **TODO_16_QUESTS.md** - ระบบเควส
18. 🌐 **TODO_17_MULTIPLAYER.md** - ระบบมัลติเพลเยอร์

## 🚀 Phase Overview

### Phase 1: Foundation (Weeks 1-2)

- Core game loop
- Player movement & animation
- Tilemap & collision
- Camera system
- Time & calendar

### Phase 2: Farming Systems (Weeks 3-4)

- Crop planting & growing
- Tool usage
- Inventory system
- Energy system

### Phase 3: Content Expansion (Weeks 5-8)

- Mining, Fishing, Foraging
- Animals & animal products
- Crafting & cooking
- NPC interactions

### Phase 4: Social & Events (Weeks 9-10)

- Relationship system
- Festivals & events
- Gift system
- Marriage

### Phase 5: Economy & Progression (Weeks 11-12)

- Shop system
- Building upgrades
- Skill leveling
- Quest system

### Phase 6: Polish & Multiplayer (Weeks 13-16)

- UI/UX polish
- Sound & music
- Multiplayer implementation
- Bug fixes & optimization

## 🎮 Minimum Viable Product (MVP)

ฟีเจอร์ขั้นต่ำที่ต้องมีก่อน release:

- ✅ Player movement & animation
- ✅ Farming (plant, water, harvest)
- ✅ Basic tools (Hoe, Watering Can, Axe, Pickaxe)
- ✅ Time system (day/night cycle)
- ✅ Energy & health system
- ✅ Inventory system
- ✅ Basic NPCs
- ✅ Simple shop
- ✅ Save/Load game

## 📊 Success Metrics

- **Performance**: 60 FPS stable
- **Load Time**: < 3 seconds
- **Save/Load**: < 1 second
- **Responsive**: Support 1280x720 minimum
- **Accessibility**: Keyboard + Gamepad support

## 🔗 References

- [Stardew Valley Wiki](https://stardewvalleywiki.com/)
- [Excalibur.js Docs](https://excaliburjs.com/docs/)
- [Sprout Lands Asset Pack](https://cupnooble.itch.io/sprout-lands-asset-pack)
