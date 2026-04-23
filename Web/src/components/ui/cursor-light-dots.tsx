"use client";

import React, { useEffect } from "react";
import { motion, MotionValue, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

type DotSpec = {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  drift: number;
  duration: number;
};

const DOTS: DotSpec[] = [
  { id: 1, x: 8, y: 14, size: 5, opacity: 0.8, drift: 26, duration: 8.5 },
  { id: 2, x: 18, y: 30, size: 3, opacity: 0.55, drift: 18, duration: 7.2 },
  { id: 3, x: 26, y: 62, size: 4, opacity: 0.7, drift: 30, duration: 9.8 },
  { id: 4, x: 36, y: 24, size: 2, opacity: 0.45, drift: 15, duration: 6.8 },
  { id: 5, x: 44, y: 12, size: 4, opacity: 0.65, drift: 28, duration: 8.2 },
  { id: 6, x: 52, y: 46, size: 6, opacity: 0.9, drift: 36, duration: 10.5 },
  { id: 7, x: 62, y: 72, size: 3, opacity: 0.58, drift: 19, duration: 7.6 },
  { id: 8, x: 71, y: 18, size: 4, opacity: 0.7, drift: 24, duration: 8.1 },
  { id: 9, x: 79, y: 36, size: 2, opacity: 0.42, drift: 13, duration: 6.2 },
  { id: 10, x: 88, y: 58, size: 5, opacity: 0.82, drift: 32, duration: 9.1 },
  { id: 11, x: 14, y: 82, size: 2, opacity: 0.4, drift: 12, duration: 6.4 },
  { id: 12, x: 32, y: 88, size: 4, opacity: 0.62, drift: 22, duration: 7.7 },
  { id: 13, x: 48, y: 78, size: 3, opacity: 0.5, drift: 17, duration: 7 },
  { id: 14, x: 58, y: 92, size: 5, opacity: 0.78, drift: 31, duration: 9.6 },
  { id: 15, x: 74, y: 86, size: 3, opacity: 0.6, drift: 20, duration: 7.4 },
  { id: 16, x: 92, y: 76, size: 2, opacity: 0.4, drift: 11, duration: 6.1 },
];

function FloatingDot({ dot, cursorX, cursorY }: { dot: DotSpec; cursorX: MotionValue<number>; cursorY: MotionValue<number> }) {
  const xParallax = useTransform(cursorX, (v) => v * dot.drift * 0.12);
  const yParallax = useTransform(cursorY, (v) => v * dot.drift * 0.12);

  return (
    <motion.span
      className="absolute rounded-full"
      style={{
        left: `${dot.x}%`,
        top: `${dot.y}%`,
        width: `${dot.size}px`,
        height: `${dot.size}px`,
        opacity: dot.opacity,
        x: xParallax,
        y: yParallax,
        background: "rgba(250, 204, 21, 0.95)",
        boxShadow: "0 0 10px rgba(250, 204, 21, 0.35), 0 0 24px rgba(250, 204, 21, 0.18)",
      }}
      animate={{
        y: [0, -dot.drift, 0],
        opacity: [dot.opacity * 0.75, dot.opacity, dot.opacity * 0.75],
      }}
      transition={{
        duration: dot.duration,
        repeat: Infinity,
        ease: "easeInOut",
        delay: dot.id * 0.12,
      }}
    />
  );
}

export function CursorLightDots({ className }: { className?: string }) {
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  const cursorX = useSpring(rawX, { stiffness: 70, damping: 20, mass: 0.3 });
  const cursorY = useSpring(rawY, { stiffness: 70, damping: 20, mass: 0.3 });

  useEffect(() => {
    const onPointerMove = (event: PointerEvent) => {
      const nx = (event.clientX / window.innerWidth) * 2 - 1;
      const ny = (event.clientY / window.innerHeight) * 2 - 1;
      rawX.set(nx);
      rawY.set(ny);
    };

    window.addEventListener("pointermove", onPointerMove);
    return () => window.removeEventListener("pointermove", onPointerMove);
  }, [rawX, rawY]);

  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(250,204,21,0.08),transparent_35%),radial-gradient(circle_at_80%_10%,rgba(250,204,21,0.06),transparent_30%)]" />
      {DOTS.map((dot) => (
        <FloatingDot key={dot.id} dot={dot} cursorX={cursorX} cursorY={cursorY} />
      ))}
    </div>
  );
}
