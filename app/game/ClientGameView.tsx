"use client";

const StardewGameView = dynamic(() => import("@/app/game/StardewGameView"), {
  ssr: false,
});
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

export default function ClientGameView() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <div>Loading...</div>;
  }

  return <StardewGameView />;
}
