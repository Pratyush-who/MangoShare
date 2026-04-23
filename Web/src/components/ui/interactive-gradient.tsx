"use client";

import React, { useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

interface InteractiveGradientProps {
  className?: string;
  intensity?: number;
}

export function InteractiveGradient({ className, intensity = 60 }: InteractiveGradientProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();

  // Colors customized to blend elegantly with the chosen theme
  // In dark mode we want bright, neon-like splashes.
  // In light mode we want soft, pleasant pastel flares.
  const color1 = resolvedTheme === "dark" ? "rgba(250, 204, 21, 0.4)" : "rgba(217, 119, 6, 0.3)"; // Primary amber
  const color2 = resolvedTheme === "dark" ? "rgba(46, 230, 166, 0.3)" : "rgba(97, 230, 255, 0.4)"; // Mint / Aqua
  const color3 = resolvedTheme === "dark" ? "rgba(123, 97, 255, 0.3)" : "rgba(255, 94, 219, 0.3)"; // Purple / Pink

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let pointerX = 50;
    let pointerY = 50;
    let currentX = 50;
    let currentY = 50;
    let phase = 0;
    const loopDuration = 16;
    const orbitRadius = 25;
    const followStrength = 0.35;

    let animationFrameId: number;

    const onPointerMove = (e: PointerEvent) => {
      // Normalize pointer coordinates relative to window
      const nx = (e.clientX / window.innerWidth) * 100;
      const ny = (e.clientY / window.innerHeight) * 100;
      pointerX = Math.max(0, Math.min(100, nx));
      pointerY = Math.max(0, Math.min(100, ny));
    };

    window.addEventListener("pointermove", onPointerMove);

    const animate = () => {
      // Smooth follow for cursor (spring-ish easing)
      currentX += (pointerX - currentX) * 0.05;
      currentY += (pointerY - currentY) * 0.05;

      // Phase calculation for orbits
      phase += (Math.PI * 2) / (loopDuration * 60);

      // Positions
      const x1 = 50 + (currentX - 50) * followStrength;
      const y1 = 50 + (currentY - 50) * followStrength;

      const x2 = 50 + Math.cos(phase) * orbitRadius;
      const y2 = 50 + Math.sin(phase) * orbitRadius;

      const x3 = 50 + Math.cos(phase + (2 * Math.PI) / 3) * orbitRadius;
      const y3 = 50 + Math.sin(phase + (2 * Math.PI) / 3) * orbitRadius;

      // Apply to CSS vars
      el.style.setProperty("--x1", `${x1}%`);
      el.style.setProperty("--y1", `${y1}%`);
      el.style.setProperty("--x2", `${x2}%`);
      el.style.setProperty("--y2", `${y2}%`);
      el.style.setProperty("--x3", `${x3}%`);
      el.style.setProperty("--y3", `${y3}%`);

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn(
        "absolute inset-0 w-full h-full overflow-hidden block pointer-events-none opacity-100",
        className
      )}
      style={{
        filter: `blur(${intensity}px)`,
        background: `
          radial-gradient(circle at var(--x1, 50%) var(--y1, 50%), ${color1} 0%, ${color1} 22%, transparent 60%),
          radial-gradient(circle at var(--x2, 50%) var(--y2, 50%), ${color2} 0%, ${color2} 22%, transparent 60%),
          radial-gradient(circle at var(--x3, 50%) var(--y3, 50%), ${color3} 0%, ${color3} 22%, transparent 60%)
        `,
        willChange: "background",
      } as React.CSSProperties}
    />
  );
}
