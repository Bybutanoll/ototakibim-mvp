'use client';

import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

interface LogoLoadingSequenceProps {
  onComplete?: () => void;
  duration?: number;
  className?: string;
}

export default function LogoLoadingSequence({ 
  onComplete, 
  duration = 2500,
  className = '' 
}: LogoLoadingSequenceProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<SVGCircleElement>(null);
  const arrowRef = useRef<SVGPathElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const circle = circleRef.current;
    const arrow = arrowRef.current;
    const text = textRef.current;
    const glow = glowRef.current;
    const particles = particlesRef.current;

    // Master timeline for cinematic loading sequence
    const masterTimeline = gsap.timeline({
      onComplete: () => {
        setIsComplete(true);
        onComplete?.();
      }
    });

    // 1. Background particles fade in (0-0.5s)
    if (particles) {
      masterTimeline.to(particles, {
        opacity: 1,
        duration: 0.5,
        ease: "power2.out"
      });
    }

    // 2. Logo circle draws (0.5-1.5s)
    if (circle) {
      masterTimeline.to(circle, {
        strokeDashoffset: 0,
        duration: 1,
        ease: "power2.inOut"
      }, 0.5);
    }

    // 3. Arrow slides in (1.0-2.0s)
    if (arrow) {
      masterTimeline.fromTo(arrow, 
        { 
          x: -50, 
          opacity: 0,
          scale: 0.8
        },
        { 
          x: 0, 
          opacity: 1,
          scale: 1,
          duration: 1,
          ease: "back.out(1.7)"
        }, 1.0);
    }

    // 4. Text appears (1.5-2.5s)
    if (text) {
      masterTimeline.fromTo(text,
        {
          opacity: 0,
          y: 20,
          scale: 0.9
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          ease: "power2.out"
        }, 1.5);
    }

    // 5. Glow effect activates (2.0s)
    if (glow) {
      masterTimeline.to(glow, {
        opacity: 0.3,
        duration: 0.5,
        ease: "power2.out"
      }, 2.0);
    }

    // 6. Interactive ready (2.5s)
    masterTimeline.to(container, {
      scale: 1.05,
      duration: 0.3,
      yoyo: true,
      repeat: 1,
      ease: "power2.inOut"
    }, 2.5);

    return () => {
      masterTimeline.kill();
    };
  }, [onComplete, duration]);

  return (
    <div 
      ref={containerRef}
      className={`relative flex flex-col items-center justify-center ${className}`}
    >
      {/* Background Particles */}
      <div 
        ref={particlesRef}
        className="absolute inset-0 opacity-0"
      >
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full opacity-0"
            style={{
              left: `${50 + (Math.random() - 0.5) * 40}%`,
              top: `${50 + (Math.random() - 0.5) * 40}%`,
              backgroundColor: i % 3 === 0 ? '#3b82f6' : i % 3 === 1 ? '#ec4899' : '#06b6d4',
              animationDelay: `${i * 0.1}s`,
              animation: 'particleFloat 3s infinite ease-in-out'
            }}
          />
        ))}
      </div>

      {/* Logo SVG */}
      <svg
        width="200"
        height="200"
        viewBox="0 0 200 200"
        className="relative z-10"
      >
        <defs>
          <linearGradient id="circleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1a365d" />
            <stop offset="50%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#1a365d" />
          </linearGradient>
          <linearGradient id="arrowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Circle (O) - Animated drawing */}
        <circle
          ref={circleRef}
          cx="100"
          cy="100"
          r="80"
          fill="none"
          stroke="url(#circleGradient)"
          strokeWidth="8"
          strokeDasharray="500"
          strokeDashoffset="500"
          className="animate-pulse"
        />
        
        {/* Arrow (T) - Animated entrance */}
        <path
          ref={arrowRef}
          d="M 60 140 L 140 140 L 140 60 L 120 60 L 120 120 L 80 120 L 80 60 L 60 60 Z"
          fill="url(#arrowGradient)"
          filter="url(#glow)"
        />
        
        {/* Circuit Pattern */}
        <g opacity="0.6">
          <circle cx="70" cy="70" r="2" fill="#06b6d4" />
          <circle cx="130" cy="70" r="2" fill="#ec4899" />
          <circle cx="70" cy="130" r="2" fill="#3b82f6" />
          <circle cx="130" cy="130" r="2" fill="#06b6d4" />
          <line x1="70" y1="70" x2="130" y2="70" stroke="#06b6d4" strokeWidth="1" />
          <line x1="70" y1="130" x2="130" y2="130" stroke="#ec4899" strokeWidth="1" />
          <line x1="70" y1="70" x2="70" y2="130" stroke="#3b82f6" strokeWidth="1" />
          <line x1="130" y1="70" x2="130" y2="130" stroke="#06b6d4" strokeWidth="1" />
        </g>
      </svg>

      {/* Logo Text */}
      <div 
        ref={textRef}
        className="mt-6 text-center"
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
          OtoTakibim
        </h1>
        <p className="text-lg text-white/80 mt-2">
          Geleceğin Araç Yönetimi
        </p>
      </div>

      {/* Glow Effect */}
      <div 
        ref={glowRef}
        className="absolute inset-0 rounded-full opacity-0"
        style={{
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 70%)',
          filter: 'blur(20px)'
        }}
      />

      {/* Loading Progress Indicator */}
      {!isComplete && (
        <div className="mt-8 w-64 h-1 bg-white/20 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
            style={{
              animation: 'loadingProgress 2.5s ease-out forwards'
            }}
          />
        </div>
      )}

      <style jsx>{`
        @keyframes loadingProgress {
          0% { width: 0%; }
          20% { width: 20%; }
          40% { width: 40%; }
          60% { width: 60%; }
          80% { width: 80%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  );
}
