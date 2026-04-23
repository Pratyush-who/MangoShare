"use client";

import React, { useEffect, useRef, useCallback } from "react";
import { useTheme } from "next-themes";

interface ParticleBackgroundProps {
  particleCount?: number;
  particleSize?: number;
  speed?: number;
  opacity?: number;
  blur?: boolean;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  opacity: number;
  baseOpacity: number;
  pulsePhase: number;
  pulseSpeed: number;
}

export function ParticleBackground({
  particleCount = 30,
  particleSize = 4,
  speed = 1,
  opacity = 0.8,
  blur = true,
}: ParticleBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const { resolvedTheme } = useTheme();

  // 3 distinct colors for a rich, vibrant look, customized by theme
  const colorsDark = ["#FACC15", "#FBBF24", "#F59E0B"]; // Bright yellows & ambers
  const colorsLight = ["#D97706", "#B45309", "#92400E"]; // Darker oranges & browns

  const activeColors = resolvedTheme === "dark" ? colorsDark : colorsLight;

  const initializeParticles = useCallback(
    (width: number, height: number) => {
      return Array.from({ length: particleCount }, (_, index) => {
        const color = activeColors[Math.floor(Math.random() * activeColors.length)];
        return {
          id: index,
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * speed * 2,
          vy: (Math.random() - 0.5) * speed * 2,
          size: particleSize + Math.random() * particleSize * 0.5,
          color: color,
          opacity: opacity * (0.5 + Math.random() * 0.5),
          baseOpacity: opacity,
          pulsePhase: Math.random() * Math.PI * 2,
          pulseSpeed: Math.random() * 0.05 + 0.02,
        };
      });
    },
    [particleCount, particleSize, speed, opacity, activeColors]
  );

  const redistributeParticles = useCallback((width: number, height: number) => {
    particlesRef.current.forEach((particle) => {
      particle.x = Math.random() * width;
      particle.y = Math.random() * height;
    });
  }, []);

  const updateParticles = useCallback(
    (canvas: HTMLCanvasElement) => {
      const rect = canvas.getBoundingClientRect();
      const dims = { width: rect.width, height: rect.height };
      
      particlesRef.current.forEach((particle) => {
        let newX = particle.x + particle.vx * speed;
        let newY = particle.y + particle.vy * speed;
        let newVx = particle.vx;
        let newVy = particle.vy;

        // Bounce off edges with some randomness
        if (newX <= 0 || newX >= dims.width) {
          newVx = -newVx + (Math.random() - 0.5) * 0.5;
          newX = Math.max(0, Math.min(dims.width, newX));
        }
        if (newY <= 0 || newY >= dims.height) {
          newVy = -newVy + (Math.random() - 0.5) * 0.5;
          newY = Math.max(0, Math.min(dims.height, newY));
        }

        // Add slight random movement for floating effect
        newVx += (Math.random() - 0.5) * 0.05;
        newVy += (Math.random() - 0.5) * 0.05;

        // Limit velocity
        const maxVel = speed * 1.5;
        newVx = Math.max(-maxVel, Math.min(maxVel, newVx));
        newVy = Math.max(-maxVel, Math.min(maxVel, newVy));

        particle.x = newX;
        particle.y = newY;
        particle.vx = newVx;
        particle.vy = newVy;
        particle.pulsePhase += particle.pulseSpeed;
      });
    },
    [speed]
  );

  const drawParticles = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      if (blur) {
        ctx.filter = "blur(1px)";
      } else {
        ctx.filter = "none";
      }

      particlesRef.current.forEach((particle) => {
        ctx.save();
        
        // Pulse effect for scale and opacity
        const pulse = Math.sin(particle.pulsePhase);
        const currentScale = 1 + pulse * 0.2;
        const currentOpacity = particle.opacity * (0.8 + pulse * 0.2);
        
        ctx.globalAlpha = Math.max(0, Math.min(1, currentOpacity));
        ctx.fillStyle = particle.color;
        
        // Soft glow matched to the particle's own color
        ctx.shadowColor = particle.color;
        ctx.shadowBlur = 15;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * currentScale, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });
    },
    [blur]
  );

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    updateParticles(canvas);
    drawParticles(ctx);
    animationRef.current = requestAnimationFrame(animate);
  }, [updateParticles, drawParticles]);

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const rect = container.getBoundingClientRect();
    const newWidth = rect.width;
    const newHeight = rect.height;
    if (canvas.width !== newWidth || canvas.height !== newHeight) {
      canvas.width = newWidth;
      canvas.height = newHeight;
      if (particlesRef.current.length > 0) {
        redistributeParticles(newWidth, newHeight);
      }
    }
  }, [redistributeParticles]);

  // Effect to reinitialize particles when params change
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    particlesRef.current = initializeParticles(canvas.width || window.innerWidth, canvas.height || window.innerHeight);
  }, [initializeParticles]);

  // Effect to handle resize events
  useEffect(() => {
    resizeCanvas();
    if (typeof window !== "undefined") {
      window.addEventListener("resize", resizeCanvas);
    }
    
    // Set up ResizeObserver for container
    if (containerRef.current && typeof ResizeObserver !== "undefined") {
      const resizeObserver = new ResizeObserver(() => {
        resizeCanvas();
      });
      resizeObserver.observe(containerRef.current);
      return () => {
        resizeObserver.disconnect();
        if (typeof window !== "undefined") {
          window.removeEventListener("resize", resizeCanvas);
        }
      };
    }
    
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("resize", resizeCanvas);
      }
    };
  }, [resizeCanvas]);

  useEffect(() => {
    animate();
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animate]);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "100%",
        position: "absolute",
        top: 0,
        left: 0,
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 0,
      }}
    >
      <canvas ref={canvasRef} style={{ width: "100%", height: "100%", display: "block" }} />
    </div>
  );
}
