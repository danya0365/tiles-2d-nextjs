import type { Metadata } from "next";
import ClientGameView from "./ClientGameView";

export const metadata: Metadata = {
  title: "เล่นเกม | Stardew Valley Clone",
  description:
    "เกมจำลองชีวิตชาวไร่ ปลูกพืช เลี้ยงสัตว์ ขุดแร่ ตกปลา และสร้างความสัมพันธ์",
};

/**
 * Game page - Server Component for SEO optimization
 * Stardew Valley farming RPG game
 */
export default function GamePage() {
  return <ClientGameView />;
}
