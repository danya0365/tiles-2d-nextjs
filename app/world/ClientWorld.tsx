"use client";

const WorldBuilderGame = dynamic(
  () => import("@/src/presentation/components/world/WorldBuilderGame"),
  { ssr: false }
);
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

export default function ClientWorld() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return isMounted ? <WorldBuilderGame /> : null;
}
