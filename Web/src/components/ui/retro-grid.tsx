import { cn } from "@/lib/utils";
import React from "react";

export function RetroGrid({
  className,
  angle = 65,
}: {
  className?: string;
  angle?: number;
}) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute h-full w-full overflow-hidden opacity-100 [perspective:200px]",
        className,
      )}
      style={{ "--grid-angle": `${angle}deg` } as React.CSSProperties}
    >
      {/* Grid */}
      <div className="absolute inset-0 [transform:rotateX(var(--grid-angle))]">
        <div
          className={cn(
            "animate-grid bg-retro-grid",
            "[background-repeat:repeat] [height:300vh] [inset:0%_0px] [margin-left:-50%] [transform-origin:100%_0_0] [width:600vw]"
          )}
        />
      </div>

      {/* Background Gradient (Fades into darkness at the horizon, bright at bottom) */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-transparent" />
    </div>
  );
}
