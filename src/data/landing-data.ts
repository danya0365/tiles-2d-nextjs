/**
 * Landing Page Master Data
 * Contains all static data for the landing page
 */

export interface Feature {
  id: string;
  title: string;
  description: string;
  icon: string; // Lucide icon name
}

export interface TechStack {
  id: string;
  name: string;
  description: string;
  category: "frontend" | "backend" | "database" | "multiplayer" | "assets";
}

export interface Screenshot {
  id: string;
  url: string;
  alt: string;
  caption: string;
}

export interface HowItWorksStep {
  step: number;
  title: string;
  description: string;
  icon: string; // Lucide icon name
}

// Features
export const features: Feature[] = [
  {
    id: "farming",
    title: "🌾 เกษตรกรรม",
    description:
      "ปลูกพืชผักหลากหลายชนิด รดน้ำ ใส่ปุ๋ย และเก็บเกี่ยวผลผลิตคุณภาพสูง เพื่อขายหารายได้",
    icon: "Sprout",
  },
  {
    id: "animals",
    title: "🐄 ปศุสัตว์",
    description:
      "เลี้ยงไก่ วัว แกะ หมู เก็บไข่ นม และขนสัตว์ ดูแลสัตว์ให้มีความสุขเพื่อผลผลิตคุณภาพดี",
    icon: "Bone",
  },
  {
    id: "mining",
    title: "⛏️ ขุดแร่",
    description:
      "สำรวจเหมืองลึก ขุดแร่หาแร่ธาตุมีค่า ต่อสู้กับมอนสเตอร์ และค้นหาสมบัติลับ",
    icon: "Pickaxe",
  },
  {
    id: "fishing",
    title: "🎣 ตกปลา",
    description:
      "ตกปลาในแม่น้ำ ทะเลสาบ และมหาสมุทร จับปลาหายากและตำนาน รวบรวมคอลเลกชันครบทุกชนิด",
    icon: "Fish",
  },
  {
    id: "social",
    title: "💕 ความสัมพันธ์",
    description:
      "สร้างมิตรภาพกับชาวบ้าน มอบของขวัญ ดูคัทซีน และแต่งงานกับคนที่คุณรัก",
    icon: "Heart",
  },
  {
    id: "multiplayer",
    title: "🌐 Multiplayer",
    description:
      "เชิญเพื่อนมาเล่นร่วมกัน สร้างฟาร์มแบบ Co-op ผ่านระบบ Colyseus และ WebRTC",
    icon: "Users",
  },
];

// Tech Stack
export const techStack: TechStack[] = [
  {
    id: "excalibur",
    name: "Excalibur.js v0.31",
    description: "2D HTML5 game engine สำหรับสร้างเกม Stardew Valley",
    category: "frontend",
  },
  {
    id: "nextjs",
    name: "Next.js 15",
    description: "React framework with App Router สำหรับ SEO และ performance",
    category: "frontend",
  },
  {
    id: "typescript",
    name: "TypeScript",
    description: "Type-safe development สำหรับ game logic และ UI",
    category: "frontend",
  },
  {
    id: "colyseus",
    name: "Colyseus",
    description: "Multiplayer game server สำหรับ real-time co-op",
    category: "multiplayer",
  },
  {
    id: "peerjs",
    name: "PeerJS",
    description: "WebRTC สำหรับ voice chat และ video call",
    category: "multiplayer",
  },
  {
    id: "tailwind",
    name: "Tailwind CSS v4",
    description: "Utility-first CSS framework สำหรับ UI components",
    category: "frontend",
  },
  {
    id: "zustand",
    name: "Zustand",
    description: "State management สำหรับ game state และ inventory",
    category: "frontend",
  },
  {
    id: "sproutlands",
    name: "Sprout Lands",
    description: "Pixel art asset pack สำหรับ tiles, sprites และ animations",
    category: "assets",
  },
];

// Screenshots (Mock - replace with actual screenshots later)
export const screenshots: Screenshot[] = [
  {
    id: "farm",
    url: "/screenshots/farm.png",
    alt: "ฟาร์มพร้อมไร่นา โรงเรือน และสัตว์เลี้ยง",
    caption: "ฟาร์มในฝันของคุณ",
  },
  {
    id: "mining",
    url: "/screenshots/mining.png",
    alt: "ขุดแร่ในเหมืองลึกพร้อมต่อสู้มอนสเตอร์",
    caption: "สำรวจเหมืองลึก",
  },
  {
    id: "fishing",
    url: "/screenshots/fishing.png",
    alt: "ตกปลาริมชายหาดตอนพระอาทิตย์ตก",
    caption: "ตกปลาผ่อนคลาย",
  },
  {
    id: "town",
    url: "/screenshots/town.png",
    alt: "เมืองกลางพร้อมชาวบ้านและร้านค้า",
    caption: "สร้างความสัมพันธ์",
  },
];

// How It Works
export const howItWorks: HowItWorksStep[] = [
  {
    step: 1,
    title: "เริ่มต้นฟาร์ม",
    description: "รับมรดกฟาร์มเก่าๆ และเริ่มต้นชีวิตใหม่ในหุบเขาแห่งนี้",
    icon: "Home",
  },
  {
    step: 2,
    title: "ปลูกพืชและเลี้ยงสัตว์",
    description: "ปลูกพืชตามฤดูกาล เลี้ยงสัตว์ และเก็บเกี่ยวผลผลิต",
    icon: "Sprout",
  },
  {
    step: 3,
    title: "สำรวจและเก็บของ",
    description: "ขุดแร่ในเหมือง ตกปลาริมทะเล และเก็บของป่าหาทรัพยากร",
    icon: "Search",
  },
  {
    step: 4,
    title: "สร้างความสัมพันธ์",
    description: "ทำความรู้จักกับชาวบ้าน มอบของขวัญ และสร้างครอบครัว",
    icon: "Heart",
  },
  {
    step: 5,
    title: "เล่นกับเพื่อน",
    description: "เชิญเพื่อนมาร่วมสร้างฟาร์มด้วยกันแบบ co-op multiplayer",
    icon: "Users",
  },
];
