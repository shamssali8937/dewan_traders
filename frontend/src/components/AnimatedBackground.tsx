'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';

// Custom hook to detect if screen is mobile/tablet to adjust performance
function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [matches, query]);

  return matches;
}

// ─── Noise Texture (Layer 5) ──────────────────────────────────
function NoiseTexture() {
  return (
    <div
      className="absolute inset-0 pointer-events-none select-none opacity-[0.012]"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat',
      }}
    />
  );
}

// ─── Floating Gradient Blobs (Layer 1) ─────────────────────────
function FloatingBlobs({ isReduced }: { isReduced: boolean }) {
  const blobConfigs = useMemo(() => {
    const allBlobs = [
      { color: 'bg-primary/10', size: 'w-[45vw] h-[45vw]', x: [-60, 60], y: [-40, 40], scale: [0.95, 1.05], duration: 42 },
      { color: 'bg-secondary/10', size: 'w-[40vw] h-[40vw]', x: [80, -40], y: [60, -30], scale: [1, 0.9], duration: 48 },
      { color: 'bg-accent/5', size: 'w-[50vw] h-[50vw]', x: [-30, 40], y: [80, -60], scale: [0.9, 1.1], duration: 55 },
      { color: 'bg-secondary/5', size: 'w-[35vw] h-[35vw]', x: [50, -50], y: [-60, 40], scale: [1.05, 0.95], duration: 36 },
      { color: 'bg-primary/5', size: 'w-[48vw] h-[48vw]', x: [-80, 20], y: [-20, 80], scale: [0.95, 1.05], duration: 60 },
    ];
    return isReduced ? allBlobs.slice(0, 2) : allBlobs;
  }, [isReduced]);

  return (
    <div className="absolute inset-0 pointer-events-none select-none overflow-hidden blur-[120px] mix-blend-multiply opacity-75">
      {blobConfigs.map((blob, idx) => (
        <motion.div
          key={idx}
          className={`absolute rounded-full ${blob.color} ${blob.size} will-change-transform`}
          style={{
            top: `${20 + idx * 12}%`,
            left: `${15 + idx * 15}%`,
          }}
          animate={{
            x: blob.x,
            y: blob.y,
            scale: blob.scale,
            rotate: [0, 360],
          }}
          transition={{
            duration: blob.duration,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

// ─── Gradient Aurora (Layer 2) + Parallax & Cursor Tracking ─────
function GradientAurora({ mouseX, mouseY }: { mouseX: any; mouseY: any }) {
  const x = useSpring(mouseX, { stiffness: 45, damping: 25 });
  const y = useSpring(mouseY, { stiffness: 45, damping: 25 });

  return (
    <motion.div
      className="absolute inset-0 pointer-events-none select-none opacity-[0.25] will-change-transform"
      style={{
        background: useTransform(
          [x, y],
          ([currX, currY]) =>
            `radial-gradient(circle 500px at ${currX}px ${currY}px, var(--color-primary-dark) 8%, transparent 70%)`
        ),
      }}
    />
  );
}

// ─── Tiny Floating Particles (Layer 3) ─────────────────────────
function ParticleField({ isMobile, isReduced }: { isMobile: boolean; isReduced: boolean }) {
  const count = isReduced ? 0 : isMobile ? 25 : 60;
  const particles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      duration: Math.random() * 25 + 15,
      delay: Math.random() * -20,
    }));
  }, [count]);

  if (isReduced || count === 0) return null;

  return (
    <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-secondary/30"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
          }}
          animate={{
            y: [-120, 120],
            x: [0, Math.random() * 30 - 15],
            opacity: [0, 0.7, 0.7, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  );
}

// ─── Animated Grid (Layer 4) ──────────────────────────────────
function AnimatedGrid({ scrollY }: { scrollY: any }) {
  const gridY = useTransform(scrollY, [0, 3000], [0, -100]);

  return (
    <motion.div
      className="absolute inset-0 pointer-events-none select-none opacity-[0.015]"
      style={{
        y: gridY,
        backgroundImage: `
          linear-gradient(rgba(15, 23, 42, 0.05) 1px, transparent 1px),
          linear-gradient(90deg, rgba(15, 23, 42, 0.05) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
      }}
    />
  );
}

// ─── Light Rays (Layer 6) ──────────────────────────────────────
function LightRays() {
  return (
    <div className="absolute inset-0 pointer-events-none select-none overflow-hidden opacity-[0.015]">
      <motion.div
        className="absolute w-[200%] h-[30%] -left-[50%] -top-[10%] bg-gradient-to-b from-primary/20 via-transparent to-transparent blur-[60px]"
        style={{ rotate: -25 }}
        animate={{
          y: [-20, 60, -20],
        }}
        transition={{
          duration: 35,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </div>
  );
}

// ─── Floating Connection & Network Lines (Layer 7 & 8) ─────────
function NetworkLines({ isMobile, isReduced }: { isMobile: boolean; isReduced: boolean }) {
  const count = isReduced ? 0 : isMobile ? 3 : 8;
  const nodes = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x1: Math.random() * 85 + 5,
      y1: Math.random() * 85 + 5,
      x2: Math.random() * 85 + 5,
      y2: Math.random() * 85 + 5,
      duration: Math.random() * 8 + 8,
      delay: Math.random() * 5,
    }));
  }, [count]);

  if (count === 0) return null;

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none select-none opacity-[0.03]">
      {nodes.map((node) => (
        <g key={node.id}>
          <motion.line
            x1={`${node.x1}%`}
            y1={`${node.y1}%`}
            x2={`${node.x2}%`}
            y2={`${node.y2}%`}
            stroke="var(--color-primary)"
            strokeWidth="0.8"
            strokeDasharray="4 6"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{
              pathLength: [0, 1, 1, 0],
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: node.duration,
              delay: node.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          <motion.circle
            cx={`${node.x1}%`}
            cy={`${node.y1}%`}
            r="2"
            fill="var(--color-primary)"
            animate={{
              r: [2, 4, 2],
              opacity: [0.3, 0.9, 0.3],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </g>
      ))}
    </svg>
  );
}

// ─── MAIN WRAPPER COMPONENT ────────────────────────────────────
export default function AnimatedBackground() {
  const [mounted, setMounted] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isReduced = useMediaQuery('(prefers-reduced-motion: reduce)');

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const { scrollY } = useScroll();

  useEffect(() => {
    setMounted(true);
    if (isMobile || isReduced) return;
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isMobile, isReduced, mouseX, mouseY]);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none select-none z-[-10] bg-white overflow-hidden">
      <AnimatedGrid scrollY={scrollY} />
      <LightRays />
      <NoiseTexture />
      <GradientAurora mouseX={mouseX} mouseY={mouseY} />
      <FloatingBlobs isReduced={isReduced} />
      <NetworkLines isMobile={isMobile} isReduced={isReduced} />
      <ParticleField isMobile={isMobile} isReduced={isReduced} />
    </div>
  );
}
