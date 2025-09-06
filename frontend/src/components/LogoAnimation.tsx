'use client';

import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// GSAP ScrollTrigger'ı register et
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface LogoAnimationProps {
  size?: 'small' | 'medium' | 'large';
  showParticles?: boolean;
  className?: string;
}

export default function LogoAnimation({ 
  size = 'medium', 
  showParticles = true, 
  className = '' 
}: LogoAnimationProps) {
  const logoRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Size mapping
  const sizeMap = {
    small: { width: 120, height: 120 },
    medium: { width: 200, height: 200 },
    large: { width: 300, height: 300 }
  };

  const currentSize = sizeMap[size];

  useEffect(() => {
    if (!logoRef.current) return;

    const logo = logoRef.current;
    const particles = particlesRef.current;

    // Logo fade-in animation
    const tl = gsap.timeline();
    
    tl.fromTo(logo, 
      { 
        opacity: 0, 
        scale: 0.8, 
        y: 50,
        rotation: -10
      },
      { 
        opacity: 1, 
        scale: 1, 
        y: 0,
        rotation: 0,
        duration: 2,
        ease: "back.out(1.7)"
      }
    );

    // Particle animation
    if (showParticles && particles) {
      const particleElements = particles.children;
      
      gsap.fromTo(particleElements,
        { 
          opacity: 0, 
          scale: 0,
          x: 0,
          y: 0
        },
        { 
          opacity: 1, 
          scale: 1,
          x: (i) => (Math.random() - 0.5) * 100,
          y: (i) => (Math.random() - 0.5) * 100,
          duration: 1.5,
          delay: 0.5,
          stagger: 0.1,
          ease: "power2.out"
        }
      );
    }

    // Scroll-triggered animations
    ScrollTrigger.create({
      trigger: logo,
      start: "top 80%",
      end: "bottom 20%",
      onEnter: () => setIsVisible(true),
      onLeave: () => setIsVisible(false),
      onEnterBack: () => setIsVisible(true),
      onLeaveBack: () => setIsVisible(false)
    });

    // Hover animation
    const handleMouseEnter = () => {
      gsap.to(logo, {
        scale: 1.1,
        duration: 0.3,
        ease: "power2.out"
      });
    };

    const handleMouseLeave = () => {
      gsap.to(logo, {
        scale: 1,
        duration: 0.3,
        ease: "power2.out"
      });
    };

    logo.addEventListener('mouseenter', handleMouseEnter);
    logo.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      logo.removeEventListener('mouseenter', handleMouseEnter);
      logo.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [showParticles]);

  return (
    <div className={`relative ${className}`}>
      {/* Logo Container */}
      <div 
        ref={logoRef}
        className="relative z-10 cursor-pointer"
        style={{ width: currentSize.width, height: currentSize.height }}
      >
        {/* Logo SVG - OtoTakibim Logo */}
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 200 200"
          className="drop-shadow-lg"
        >
          {/* Background Circle (O) */}
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
          
          {/* Circle (O) */}
          <circle
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
          
          {/* Arrow (T) */}
          <path
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
      </div>

      {/* Particles */}
      {showParticles && (
        <div 
          ref={particlesRef}
          className="absolute inset-0 pointer-events-none"
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
      )}

      {/* Glow Effect */}
      <div 
        className="absolute inset-0 rounded-full opacity-0 transition-opacity duration-300"
        style={{
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 70%)',
          filter: 'blur(20px)'
        }}
      />
    </div>
  );
}
