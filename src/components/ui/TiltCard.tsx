"use client";

import React, { useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface TiltCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
  featured?: boolean;
}

export default function TiltCard({
  children,
  className,
  maxTilt = 10,
  featured = false,
  ...props
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const tiltX = ((y - centerY) / centerY) * -maxTilt;
    const tiltY = ((x - centerX) / centerX) * maxTilt;

    setRotateX(tiltX);
    setRotateY(tiltY);
    setMousePos({ x, y });

    cardRef.current.style.setProperty("--mouse-x", `${x}px`);
    cardRef.current.style.setProperty("--mouse-y", `${y}px`);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: isHovered
          ? `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.015, 1.015, 1.015) ${featured ? "translateZ(20px)" : ""}`
          : `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1) ${featured ? "translateZ(20px)" : ""}`,
        transition: isHovered
          ? "transform 0.1s cubic-bezier(0.2, 0, 0, 1)"
          : "transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)",
        ...props.style,
      }}
      className={cn(
        "group relative overflow-hidden rounded-3xl transition-all duration-300 transform-3d will-change-transform",
        featured
          ? "border border-red-500/40 shadow-[0_0_35px_rgba(220,38,38,0.2)] bg-gradient-to-b from-red-950/20 via-white/[0.05] to-transparent backdrop-blur-2xl"
          : "bg-white/[0.05] hover:bg-white/[0.08] backdrop-blur-2xl border border-white/15 hover:border-white/30 shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.15)] shadow-2xl shadow-black/40",
        className
      )}
      {...props}
    >
      {/* Dynamic Cursor Spotlight Radial Glow */}
      <div
        className="pointer-events-none absolute -inset-px rounded-3xl transition-opacity duration-300 z-0"
        style={{
          opacity: isHovered ? 1 : 0,
          background: featured
            ? `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(239, 68, 68, 0.18), transparent 45%)`
            : `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255, 255, 255, 0.08), transparent 40%)`,
        }}
      />
      <div className="relative z-10 h-full w-full">{children}</div>
    </div>
  );
}
