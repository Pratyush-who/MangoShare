"use client";

import React, { useEffect, useRef, useCallback } from "react";
import { useTheme } from "next-themes";

interface ParticleBackgroundProps {
  particleCount?: number;
  particleSize?: number;
  particleOpacity?: number;
  glowIntensity?: number;
  movementSpeed?: number;
  mouseInfluence?: number;
  mouseGravity?: "none" | "attract" | "repel";
  gravityStrength?: number;
  particleInteraction?: boolean;
  interactionType?: "bounce" | "merge";
}

export function ParticleBackground({
  particleCount = 50,
  particleSize = 1.5,
  particleOpacity = 0.5,
  glowIntensity = 10,
  movementSpeed = 0.4,
  mouseInfluence = 120,
  mouseGravity = "attract",
  gravityStrength = 50,
  particleInteraction = true,
  interactionType = "bounce",
}: ParticleBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>(0);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const particlesRef = useRef<any[]>([]);
  const { resolvedTheme } = useTheme();

  // Yellow for dark theme, darker gold/orange for light theme for visibility
  const particleColor = resolvedTheme === "dark" ? "#FACC15" : "#D97706";

  const initializeParticles = useCallback(
    (width: number, height: number) => {
      return Array.from({ length: particleCount }, (_, index) => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * movementSpeed,
        vy: (Math.random() - 0.5) * movementSpeed,
        size: Math.random() * particleSize + 0.5,
        opacity: particleOpacity,
        baseOpacity: particleOpacity,
        mass: Math.random() * 0.5 + 0.5,
        id: index,
        glowMultiplier: 1,
        glowVelocity: 0,
      }));
    },
    [particleCount, particleSize, particleOpacity, movementSpeed]
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
      const mouse = mouseRef.current;
      particlesRef.current.forEach((particle, index) => {
        // Calculate distance to mouse
        const dx = mouse.x - particle.x;
        const dy = mouse.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Mouse influence and gravity
        if (distance < mouseInfluence && distance > 0) {
          const force = (mouseInfluence - distance) / mouseInfluence;
          const normalizedDx = dx / distance;
          const normalizedDy = dy / distance;
          const gravityForce = force * (gravityStrength * 0.001);

          if (mouseGravity === "attract") {
            particle.vx += normalizedDx * gravityForce;
            particle.vy += normalizedDy * gravityForce;
          } else if (mouseGravity === "repel") {
            particle.vx -= normalizedDx * gravityForce;
            particle.vy -= normalizedDy * gravityForce;
          }
          particle.opacity = Math.min(1, particle.baseOpacity + force * 0.4);

          // Apply glow animation (ease)
          const targetGlow = 1 + force * 2;
          const currentGlow = particle.glowMultiplier || 1;
          const easeSpeed = 0.15;
          particle.glowMultiplier = currentGlow + (targetGlow - currentGlow) * easeSpeed;
        } else {
          particle.opacity = Math.max(particle.baseOpacity * 0.3, particle.opacity - 0.02);
          const targetGlow = 1;
          const currentGlow = particle.glowMultiplier || 1;
          const easeSpeed = 0.08;
          particle.glowMultiplier = Math.max(1, currentGlow + (targetGlow - currentGlow) * easeSpeed);
        }

        // Particle interaction
        if (particleInteraction) {
          for (let j = index + 1; j < particlesRef.current.length; j++) {
            const other = particlesRef.current[j];
            const dx = other.x - particle.x;
            const dy = other.y - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const minDistance = particle.size + other.size + 4;
            if (distance < minDistance && distance > 0) {
              if (interactionType === "bounce") {
                const normalX = dx / distance;
                const normalY = dy / distance;
                const relativeVx = particle.vx - other.vx;
                const relativeVy = particle.vy - other.vy;
                const speed = relativeVx * normalX + relativeVy * normalY;

                if (speed < 0) continue;

                const impulse = (2 * speed) / (particle.mass + other.mass);
                particle.vx -= impulse * other.mass * normalX;
                particle.vy -= impulse * other.mass * normalY;
                other.vx += impulse * particle.mass * normalX;
                other.vy += impulse * particle.mass * normalY;

                const overlap = minDistance - distance;
                const separationX = normalX * overlap * 0.5;
                const separationY = normalY * overlap * 0.5;
                particle.x -= separationX;
                particle.y -= separationY;
                other.x += separationX;
                other.y += separationY;
              } else if (interactionType === "merge") {
                const mergeForce = (minDistance - distance) / minDistance;
                particle.glowMultiplier = (particle.glowMultiplier || 1) + mergeForce * 0.5;
                other.glowMultiplier = (other.glowMultiplier || 1) + mergeForce * 0.5;
                const attractForce = mergeForce * 0.01;
                particle.vx += dx * attractForce;
                particle.vy += dy * attractForce;
                other.vx -= dx * attractForce;
                other.vy -= dy * attractForce;
              }
            }
          }
        }

        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Add subtle random movement
        particle.vx += (Math.random() - 0.5) * 0.001;
        particle.vy += (Math.random() - 0.5) * 0.001;

        // Damping
        particle.vx *= 0.999;
        particle.vy *= 0.999;

        // Boundary wrapping
        if (particle.x < 0) particle.x = rect.width;
        if (particle.x > rect.width) particle.x = 0;
        if (particle.y < 0) particle.y = rect.height;
        if (particle.y > rect.height) particle.y = 0;
      });
    },
    [mouseInfluence, mouseGravity, gravityStrength, particleInteraction, interactionType]
  );

  const drawParticles = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      particlesRef.current.forEach((particle) => {
        ctx.save();
        const currentGlowMultiplier = particle.glowMultiplier || 1;
        ctx.shadowColor = particleColor;
        ctx.shadowBlur = glowIntensity * currentGlowMultiplier * 2;
        ctx.globalAlpha = particle.opacity;
        ctx.fillStyle = particleColor;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });
    },
    [particleColor, glowIntensity]
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

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }, []);

  const handleMouseLeave = useCallback(() => {
    mouseRef.current = { x: -1000, y: -1000 };
  }, []);

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

  // Effect to reinitialize particles when particle count changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    particlesRef.current = initializeParticles(canvas.width || window.innerWidth, canvas.height || window.innerHeight);
  }, [particleCount, initializeParticles]);

  // Effect to handle resize and mouse events
  useEffect(() => {
    resizeCanvas();
    if (typeof window !== "undefined") {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseout", handleMouseLeave);
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
          window.removeEventListener("mousemove", handleMouseMove);
          window.removeEventListener("mouseout", handleMouseLeave);
          window.removeEventListener("resize", resizeCanvas);
        }
      };
    }
    
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseout", handleMouseLeave);
        window.removeEventListener("resize", resizeCanvas);
      }
    };
  }, [handleMouseMove, handleMouseLeave, resizeCanvas]);

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
