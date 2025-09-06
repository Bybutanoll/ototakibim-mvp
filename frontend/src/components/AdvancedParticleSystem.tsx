'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  opacity: number;
  life: number;
  maxLife: number;
  gravity: number;
  friction: number;
}

interface AdvancedParticleSystemProps {
  particleCount?: number;
  colors?: string[];
  speed?: number;
  size?: number;
  className?: string;
  enablePhysics?: boolean;
  enableMagnetism?: boolean;
  enableWind?: boolean;
}

// Device capability detection
const getParticleCount = (): number => {
  if (typeof window === 'undefined') return 50;
  
  const gpu = !!(navigator as any).gpu || !!(navigator as any).webkitGetGamepads;
  const memory = (navigator as any).deviceMemory || 4;
  const connection = (navigator as any).connection?.effectiveType;
  
  if (gpu && memory >= 8 && connection === '4g') return 100;
  if (memory >= 4) return 50;
  return 20; // Low-end fallback
};

// Feature detection
const supportsWebGL = (): boolean => {
  if (typeof window === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
  } catch {
    return false;
  }
};

export default function AdvancedParticleSystem({
  particleCount = getParticleCount(),
  colors = ['#3b82f6', '#ec4899', '#06b6d4'],
  speed = 1,
  size = 2,
  className = '',
  enablePhysics = true,
  enableMagnetism = true,
  enableWind = true
}: AdvancedParticleSystemProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const scrollVelocityRef = useRef(0);
  const lastScrollYRef = useRef(0);
  const [isVisible, setIsVisible] = useState(false);
  const [useWebGL, setUseWebGL] = useState(false);

  // Memory monitoring
  const checkMemoryUsage = useCallback(() => {
    if (typeof window !== 'undefined' && (performance as any).memory) {
      const memoryInfo = (performance as any).memory;
      if (memoryInfo.usedJSHeapSize > memoryInfo.totalJSHeapSize * 0.8) {
        // Reduce particle count for low memory
        return Math.floor(particleCount * 0.5);
      }
    }
    return particleCount;
  }, [particleCount]);

  // Initialize particles with physics
  const initParticles = useCallback((canvas: HTMLCanvasElement) => {
    const actualParticleCount = checkMemoryUsage();
    particlesRef.current = [];
    
    for (let i = 0; i < actualParticleCount; i++) {
      particlesRef.current.push({
        id: i,
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * speed,
        vy: (Math.random() - 0.5) * speed,
        size: Math.random() * size + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: Math.random() * 0.8 + 0.2,
        life: 0,
        maxLife: Math.random() * 200 + 100,
        gravity: enablePhysics ? 0.01 : 0,
        friction: enablePhysics ? 0.99 : 1
      });
    }
  }, [colors, speed, size, enablePhysics, checkMemoryUsage]);

  // Mouse tracking for wind effect
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!enableWind) return;
    
    mouseRef.current = {
      x: e.clientX,
      y: e.clientY
    };
  }, [enableWind]);

  // Scroll velocity calculation
  const handleScroll = useCallback(() => {
    const currentScrollY = window.pageYOffset;
    scrollVelocityRef.current = currentScrollY - lastScrollYRef.current;
    lastScrollYRef.current = currentScrollY;
  }, []);

  // WebGL particle rendering
  const renderWebGL = useCallback((canvas: HTMLCanvasElement, ctx: WebGLRenderingContext) => {
    // WebGL implementation would go here
    // For now, fallback to 2D canvas
    render2D(canvas, ctx as any);
  }, []);

  // 2D Canvas particle rendering with advanced physics
  const render2D = useCallback((canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particlesRef.current.forEach((particle, i) => {
      // Physics simulation
      if (enablePhysics) {
        particle.vy += particle.gravity;
        particle.vx *= particle.friction;
        particle.vy *= particle.friction;
      }

      // Wind effect
      if (enableWind) {
        const dx = mouseRef.current.x - particle.x;
        const dy = mouseRef.current.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 200) {
          const force = (200 - distance) / 200 * 0.02;
          particle.vx += (dx / distance) * force;
          particle.vy += (dy / distance) * force;
        }
      }

      // Scroll velocity effect
      particle.vy += scrollVelocityRef.current * 0.1;

      // Update position
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.life++;

      // Wrap around screen
      if (particle.x < 0) particle.x = canvas.width;
      if (particle.x > canvas.width) particle.x = 0;
      if (particle.y < 0) particle.y = canvas.height;
      if (particle.y > canvas.height) particle.y = 0;

      // Fade out over time
      const lifeRatio = particle.life / particle.maxLife;
      particle.opacity = (1 - lifeRatio) * 0.8 + 0.2;

      // Draw particle with glow effect
      ctx.save();
      ctx.globalAlpha = particle.opacity;
      
      // Glow effect
      ctx.shadowColor = particle.color;
      ctx.shadowBlur = 10;
      ctx.fillStyle = particle.color;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Reset particle if life is over
      if (particle.life >= particle.maxLife) {
        particle.x = Math.random() * canvas.width;
        particle.y = Math.random() * canvas.height;
        particle.life = 0;
        particle.opacity = Math.random() * 0.8 + 0.2;
        particle.vx = (Math.random() - 0.5) * speed;
        particle.vy = (Math.random() - 0.5) * speed;
      }
    });

    // Draw connections between nearby particles
    particlesRef.current.forEach((particle, i) => {
      particlesRef.current.slice(i + 1).forEach((otherParticle) => {
        const dx = particle.x - otherParticle.x;
        const dy = particle.y - otherParticle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 100) {
          ctx.save();
          ctx.globalAlpha = (100 - distance) / 100 * 0.1;
          ctx.strokeStyle = particle.color;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(otherParticle.x, otherParticle.y);
          ctx.stroke();
          ctx.restore();
        }
      });
    });
  }, [enablePhysics, enableWind, speed]);

  // Animation loop
  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (useWebGL) {
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (gl) {
        renderWebGL(canvas, gl);
      } else {
        render2D(canvas, ctx);
      }
    } else {
      render2D(canvas, ctx);
    }

    animationRef.current = requestAnimationFrame(animate);
  }, [useWebGL, renderWebGL, render2D]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Check WebGL support
    setUseWebGL(supportsWebGL());

    // Canvas setup
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize particles
    initParticles(canvas);

    // Event listeners
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Intersection Observer for performance
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { 
        threshold: [0, 0.25, 0.5, 0.75, 1],
        rootMargin: '50px'
      }
    );

    observer.observe(canvas);

    // Start animation
    if (isVisible) {
      animate();
    }

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      
      observer.disconnect();
    };
  }, [initParticles, handleMouseMove, handleScroll, animate, isVisible]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed top-0 left-0 pointer-events-none z-0 ${className}`}
      style={{
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.5s ease'
      }}
      aria-hidden="true"
    />
  );
}

// Progressive enhancement wrapper
export function ProgressiveParticleSystem(props: AdvancedParticleSystemProps) {
  const [level, setLevel] = useState(1);

  useEffect(() => {
    // Determine enhancement level based on device capabilities
    const supportsWebGL = !!document.createElement('canvas').getContext('webgl');
    const supportsCSS3D = 'transform-style' in document.body.style;
    const supportsIntersectionObserver = 'IntersectionObserver' in window;
    const memory = (navigator as any).deviceMemory || 4;

    if (supportsWebGL && memory >= 8) {
      setLevel(4); // WebGL advanced effects
    } else if (supportsCSS3D && memory >= 4) {
      setLevel(3); // Canvas particles
    } else if (supportsIntersectionObserver) {
      setLevel(2); // Basic CSS animations
    } else {
      setLevel(1); // Static logo only
    }
  }, []);

  if (level === 1) {
    return null; // Static logo only
  }

  if (level === 2) {
    return <div className="fixed inset-0 pointer-events-none z-0 bg-gradient-to-br from-blue-500/5 to-pink-500/5" />;
  }

  return <AdvancedParticleSystem {...props} />;
}
