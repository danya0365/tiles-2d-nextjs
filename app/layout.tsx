import { ThemeProvider } from "@/src/presentation/providers/ThemeProvider";
import type { Metadata } from "next";
import "../public/styles/index.css";

export const metadata: Metadata = {
  title: "Stardew Valley Clone – Farming RPG Simulator",
  description:
    "เกมจำลองชีวิตชาวไร่แนว Stardew Valley สร้างด้วย Excalibur.js ปลูกพืช เลี้ยงสัตว์ ขุดแร่ ตกปลา สร้างความสัมพันธ์กับชาวบ้าน พร้อมระบบ Multiplayer ผ่าน Colyseus และ WebRTC",
  keywords: [
    "stardew valley",
    "farming simulator",
    "rpg",
    "excalibur js",
    "2d pixel art",
    "top-down game",
    "colyseus multiplayer",
    "peerjs",
    "webrtc",
    "farming game",
    "sprout lands",
    "next.js game",
    "typescript game",
  ],
  authors: [{ name: "Stardew Valley Clone Team" }],
  creator: "Marosdee Uma",
  publisher: "Stardew Valley Clone",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  ),
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon.ico" },
    ],
    shortcut: ["/favicon.ico"],
    apple: ["/favicon/apple-touch-icon.png"],
  },
  manifest: "/favicon/site.webmanifest",
  openGraph: {
    title: "Stardew Valley Clone – Farming RPG Simulator",
    description:
      "จำลองชีวิตชาวไร่ ปลูกพืช เลี้ยงสัตว์ สร้างความสัมพันธ์ ขุดแร่ ตกปลา พร้อมระบบ Multiplayer แบบ Top-Down 2D Pixel Art",
    type: "website",
    siteName: "Stardew Valley Clone",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Stardew Valley Clone – Farming RPG Simulator",
      },
    ],
    locale: "th_TH",
  },
  twitter: {
    card: "summary_large_image",
    title: "Stardew Valley Clone – Farming RPG Simulator",
    description:
      "เกมจำลองชีวิตชาวไร่แนว Stardew Valley ปลูกพืช เลี้ยงสัตว์ ขุดแร่ ตกปลา พร้อม Multiplayer",
    images: ["/logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
