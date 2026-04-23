"use client"

import React, { useEffect } from "react"
import Link from "next/link"
import { Shield, Zap, UserX, Server, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export default function LandingPage() {
  // Smooth scroll logic for internal links
  useEffect(() => {
    const handleSmoothScroll = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName.toLowerCase() === 'a' && target.getAttribute('href')?.startsWith('#')) {
        e.preventDefault();
        const id = target.getAttribute('href')?.slice(1);
        if (id) {
          const element = document.getElementById(id);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }
      }
    };

    document.addEventListener('click', handleSmoothScroll);
    return () => document.removeEventListener('click', handleSmoothScroll);
  }, []);

  return (
    <div className="min-h-screen text-foreground cyber-grid overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-yellow-neon/20 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Server className="text-yellow-neon size-6 animate-pulse-yellow" />
            <span className="font-bold text-xl terminal-text">MangoShare</span>
          </Link>
          <div className="hidden md:flex gap-6 terminal-text text-sm">
            <a href="#features" className="hover:text-yellow-neon transition-colors">Features</a>
            <a href="#about" className="hover:text-yellow-neon transition-colors">About</a>
          </div>
          <Link href="/">
            <Button variant="outline" className="border-yellow-neon text-yellow-neon hover:bg-yellow-glow btn-neon terminal-text">
              Launch App
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 md:pt-48 md:pb-32 px-6 flex flex-col items-center text-center">
        <div className="animate-slide-in flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-yellow-neon/30 bg-yellow-glow text-xs terminal-text mb-6">
            <Zap className="size-3 text-yellow-neon" />
            <span className="text-yellow-neon">v0.1.0-beta online</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 terminal-text">
            SECURE <span className="text-yellow-neon animate-neon-flicker">P2P</span> TRANSFER
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mb-10 terminal-text">
            Share files instantly and securely between devices using WebRTC. 
            No registration required, end-to-end encrypted peer-to-peer file transfer.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link href="/" className="w-full sm:w-auto">
              <Button size="lg" className="w-full bg-[#FACC15] text-black hover:bg-[#EAB308] font-bold terminal-text btn-neon h-12 px-8 text-lg">
                Start Sharing <ChevronRight className="ml-2 size-5" />
              </Button>
            </Link>
            <Link href="#features" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full border-[#FACC15]/50 hover:text-black btn-neon h-12 px-8 text-lg terminal-text transition-all">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-black/40 border-y border-border/50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 terminal-text">
              SYSTEM <span className="text-terminal-cyan">SPECS</span>
            </h2>
            <div className="h-1 w-20 bg-yellow-neon mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-card/50 border-yellow-neon/20 hover:border-yellow-neon/60 transition-all duration-300 hover:shadow-[0_0_15px_rgba(250,204,21,0.15)] group">
              <CardHeader>
                <Shield className="size-10 text-terminal-green mb-4 group-hover:scale-110 transition-transform" />
                <CardTitle className="terminal-text text-xl">End-to-End Encrypted</CardTitle>
                <CardDescription className="text-base mt-2">
                  Files are transferred directly between devices using WebRTC data channels. Your data never touches our servers.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-card/50 border-terminal-cyan/20 hover:border-terminal-cyan/60 transition-all duration-300 hover:shadow-[0_0_15px_rgba(0,255,255,0.15)] group">
              <CardHeader>
                <UserX className="size-10 text-terminal-cyan mb-4 group-hover:scale-110 transition-transform" />
                <CardTitle className="terminal-text text-xl">Zero Registration</CardTitle>
                <CardDescription className="text-base mt-2">
                  No accounts, no passwords, no personal data collected. Just open the app, connect, and start transferring immediately.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-card/50 border-yellow-neon/20 hover:border-yellow-neon/60 transition-all duration-300 hover:shadow-[0_0_15px_rgba(250,204,21,0.15)] group">
              <CardHeader>
                <Zap className="size-10 text-yellow-neon mb-4 group-hover:scale-110 transition-transform" />
                <CardTitle className="terminal-text text-xl">Lightning Fast</CardTitle>
                <CardDescription className="text-base mt-2">
                  Experience maximum transfer speeds without server bottlenecks. The only limit is your network connection.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 px-6 relative">
        <div className="container mx-auto max-w-4xl">
          <div className="border-glow rounded-xl p-8 md:p-12 bg-background/80 backdrop-blur-sm border border-yellow-neon/30">
            <h2 className="text-3xl font-bold mb-6 terminal-text flex items-center gap-3">
              <span className="text-terminal-green">&gt;</span> ABOUT_MANGOSHARE
            </h2>
            <div className="space-y-4 text-muted-foreground terminal-text leading-relaxed">
              <p>
                MangoShare was built with a simple philosophy: sharing files should be frictionless and private.
              </p>
              <p>
                In a world where file sharing services require accounts, limit file sizes, or store your data on their servers, MangoShare leverages modern WebRTC technology to connect devices directly.
              </p>
              <p className="text-yellow-neon/80 mt-6 font-semibold">
                [SYSTEM STATUS: ONLINE]
              </p>
            </div>
            
            <div className="mt-10 p-4 bg-black/60 rounded border border-border font-mono text-sm">
              <div className="flex gap-2 text-terminal-green">
                <span>$</span>
                <span className="typing-animation">Initialize peer connection...</span>
              </div>
              <div className="flex gap-2 text-terminal-cyan mt-2">
                <span>$</span>
                <span>Connection established. Ready to transfer.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-border bg-black/80">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-muted-foreground terminal-text text-sm">
            <Server className="size-4" />
            <span>© {new Date().getFullYear()} MangoShare. All rights reserved.</span>
          </div>
          <div className="flex gap-6 text-sm text-muted-foreground terminal-text">
            <span className="hover:text-yellow-neon cursor-pointer transition-colors">Privacy</span>
            <span className="hover:text-yellow-neon cursor-pointer transition-colors">Terms</span>
            <span className="hover:text-yellow-neon cursor-pointer transition-colors">GitHub</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
