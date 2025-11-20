"use client";

const ExcaliburRPG = dynamic(
  () => import("@/src/presentation/components/excalibur/ExcaliburRPG"),
  { ssr: false }
);
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

export default function ClientExcaliburRPG() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return isMounted ? <ExcaliburRPG /> : null;
}
