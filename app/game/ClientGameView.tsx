"use client";

import { useEffect, useState } from "react";

export default function ClientGameView() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <div>Loading...</div>;
  }

  return <div>ClientGameView</div>;
}
