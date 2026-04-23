import React from "react"
import Link from "next/link"
import { AlertTriangle, Home } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground cyber-grid px-6 overflow-hidden relative">
      
      {/* Glitch/Neon container */}
      <div className="relative z-10 flex flex-col items-center text-center animate-slide-in">
        
        {/* Warning Icon */}
        <div className="mb-6 relative">
          <AlertTriangle className="size-24 text-yellow-neon animate-pulse-yellow" />
          <div className="absolute inset-0 blur-md opacity-50">
            <AlertTriangle className="size-24 text-yellow-neon" />
          </div>
        </div>

        {/* 404 Number */}
        <h1 className="text-8xl md:text-9xl font-black mb-4 terminal-text tracking-tighter">
          <span className="text-destructive animate-neon-flicker">4</span>
          <span className="text-yellow-neon">0</span>
          <span className="text-destructive animate-neon-flicker">4</span>
        </h1>

        {/* Error Message */}
        <div className="border border-destructive/50 bg-destructive/10 p-4 md:p-6 rounded-lg mb-8 backdrop-blur-sm">
          <h2 className="text-2xl font-bold terminal-text text-destructive mb-2 flex items-center justify-center gap-2">
            <span>[</span> ERROR: COMPONENT_NOT_FOUND <span>]</span>
          </h2>
          <p className="text-muted-foreground terminal-text max-w-md mx-auto">
            The requested route could not be located in the system registry. 
            The connection may have been terminated or the destination is invalid.
          </p>
        </div>

        {/* Terminal logs effect */}
        <div className="w-full max-w-md bg-black/60 border border-border p-4 rounded text-left font-mono text-sm mb-10 overflow-hidden">
          <div className="text-terminal-green flex gap-2">
            <span>$</span>
            <span>ping target_url</span>
          </div>
          <div className="text-muted-foreground ml-4 mb-2">
            Destination host unreachable.
          </div>
          <div className="text-terminal-cyan flex gap-2">
            <span>$</span>
            <span className="typing-animation">Initiating emergency fallback...</span>
          </div>
        </div>

        {/* Return Home Button */}
        <Link href="/">
          <Button size="lg" className="border-yellow-neon text-yellow-neon hover:bg-yellow-glow bg-transparent btn-neon terminal-text h-12 px-8 shadow-[0_0_15px_rgba(250,204,21,0.2)]">
            <Home className="mr-2 size-5" />
            RETURN TO SAFE ZONE
          </Button>
        </Link>
      </div>

      {/* Background accents */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-3xl pointer-events-none opacity-20">
        <div className="absolute top-0 left-0 w-64 h-64 bg-destructive rounded-full blur-[100px]"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-yellow-neon rounded-full blur-[100px]"></div>
      </div>
    </div>
  )
}
