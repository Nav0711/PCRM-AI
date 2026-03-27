import React, { useState, useRef } from "react";
import { cn } from "@/lib/utils";
import {
  motion, 
  useMotionValue, 
  useTransform, 
  useMotionTemplate, 
  useAnimationFrame 
} from "framer-motion";
import { FileText, ArrowRight } from "lucide-react";

interface InfiniteGridHeroProps {
  onFileComplaint?: () => void;
}

export const InfiniteGridHero = ({ onFileComplaint }: InfiniteGridHeroProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top } = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - left);
    mouseY.set(e.clientY - top);
  };

  const gridOffsetX = useMotionValue(0);
  const gridOffsetY = useMotionValue(0);

  const speedX = 0.5; 
  const speedY = 0.5;

  useAnimationFrame(() => {
    const currentX = gridOffsetX.get();
    const currentY = gridOffsetY.get();
    gridOffsetX.set((currentX + speedX) % 40);
    gridOffsetY.set((currentY + speedY) % 40);
  });

  const maskImage = useMotionTemplate`radial-gradient(300px circle at ${mouseX}px ${mouseY}px, black, transparent)`;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className={cn(
        "relative w-full h-screen flex flex-col items-center justify-center overflow-hidden bg-background"
      )}
    >
      {/* Static grid background layer */}
      <div className="absolute inset-0 z-0 opacity-[0.05] dark:opacity-[0.08]">
        <GridPattern offsetX={gridOffsetX} offsetY={gridOffsetY} />
      </div>

      {/* Smooth fade-out at bottom for seamless transition */}
      <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-b from-transparent to-background/50 dark:to-background/70 z-5" />

      {/* Interactive grid with mouse mask */}
      <motion.div 
        className="absolute inset-0 z-0 opacity-40 dark:opacity-30"
        style={{ maskImage, WebkitMaskImage: maskImage }}
      >
        <GridPattern offsetX={gridOffsetX} offsetY={gridOffsetY} />
      </motion.div>

      {/* Decorative gradient orbs with tricolour hint */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {/* Saffron glow (top-right) — tricolour hint */}
        <div className="absolute right-[-10%] top-[-10%] w-[30%] h-[30%] rounded-full bg-orange-500/30 dark:bg-orange-600/15 blur-[120px]" />
        
        {/* Blue glow (primary) */}
        <div className="absolute right-[15%] top-[5%] w-[25%] h-[25%] rounded-full bg-blue-500/30 dark:bg-blue-600/15 blur-[100px]" />
        
        {/* Green glow (bottom-left) — tricolour hint */}
        <div className="absolute left-[-5%] bottom-[-15%] w-[30%] h-[30%] rounded-full bg-green-500/25 dark:bg-green-600/10 blur-[120px]" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-4xl mx-auto space-y-8 pointer-events-none">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 dark:bg-white/5 border border-white/10 dark:border-white/5 text-xs font-semibold tracking-wide animate-fade-in backdrop-blur-sm">
          <span className="inline-block w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span>PSRM-AI — Public Smart Relation Management System</span>
        </div>

        {/* Main heading */}
        <div className="space-y-4">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight text-foreground drop-shadow-md leading-[1.1]" style={{ animationDelay: '0s' }}>
            Your Voice,{' '}
            <span className="bg-gradient-to-r from-blue-500 via-primary to-blue-600 dark:from-blue-400 dark:via-blue-500 dark:to-blue-600 bg-clip-text text-transparent">
              Amplified.
            </span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto" style={{ animationDelay: '0.1s' }}>
            Directly connect with your local representative. Report issues, track progress, and build a better community together. Powered by AI for faster resolutions.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pointer-events-auto" style={{ animationDelay: '0.2s' }}>
          <button 
            onClick={onFileComplaint}
            className="px-8 py-3.5 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/30 active:scale-95 flex items-center gap-2"
          >
            <FileText className="h-5 w-5" />
            File a Complaint
          </button>
          <a 
            href="#projects"
            className="px-8 py-3.5 bg-secondary text-secondary-foreground font-semibold rounded-lg hover:bg-secondary/80 dark:hover:bg-secondary/70 transition-all active:scale-95 border border-border/50 flex items-center gap-2 cursor-pointer"
          >
            View Projects
          </a>
        </div>

        {/* Stats or secondary info */}
        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12 text-sm pointer-events-auto" style={{ animationDelay: '0.3s' }}>
          <div className="text-center">
            <p className="text-xl md:text-2xl font-bold text-primary">10K+</p>
            <p className="text-xs text-muted-foreground">Complaints Resolved</p>
          </div>
          <div className="w-px h-8 bg-border hidden sm:block" />
          <div className="text-center">
            <p className="text-xl md:text-2xl font-bold text-primary">95%</p>
            <p className="text-xs text-muted-foreground">Resolution Rate</p>
          </div>
          <div className="w-px h-8 bg-border hidden sm:block" />
          <div className="text-center">
            <p className="text-xl md:text-2xl font-bold text-primary">24/7</p>
            <p className="text-xs text-muted-foreground">AI Support</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const GridPattern = ({ offsetX, offsetY }: { offsetX: any; offsetY: any }) => {
  return (
    <svg className="w-full h-full">
      <defs>
        <motion.pattern
          id="grid-pattern"
          width="40"
          height="40"
          patternUnits="userSpaceOnUse"
          x={offsetX}
          y={offsetY}
        >
          <path
            d="M 40 0 L 0 0 0 40"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            className="text-muted-foreground dark:text-muted-foreground/40" 
          />
        </motion.pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid-pattern)" />
    </svg>
  );
};
