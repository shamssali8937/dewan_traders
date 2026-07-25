'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';

// Custom hook to detect media query
function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const media = window.matchMedia(query);
    setMatches(media.matches);
    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [query]);
  return matches;
}

// ─── Noise Texture ────────────────────────────────────────────
// Lightweight static SVG noise — zero animation cost
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

// ─── Floating Gradient Blobs ──────────────────────────────────
// Desktop: 3 blobs | Tablet: 2 blobs | Mobile: 0 blobs
function FloatingBlobs({ tier }: { tier: 'mobile' | 'tablet' | 'desktop' }) {
  const allBlobs = useMemo(() => [
    { color: 'bg-primary/8',   size: 'w-[45vw] h-[45vw]', x: [-60, 60],  y: [-40, 40],  scale: [0.95, 1.05], duration: 48, top: '5%',  left: '5%'  },
    { color: 'bg-secondary/8', size: 'w-[40vw] h-[40vw]', x: [60, -30],  y: [50, -30],  scale: [1, 0.92],    duration: 54, top: '50%', left: '60%' },
    { color: 'bg-accent/4',    size: 'w-[42vw] h-[42vw]', x: [-30, 30],  y: [60, -40],  scale: [0.92, 1.08], duration: 60, top: '70%', left: '20%' },
  ], []);

  const count = tier === 'mobile' ? 0 : tier === 'tablet' ? 2 : 3;
  if (count === 0) return null;

  return (
    <div className="absolute inset-0 pointer-events-none select-none overflow-hidden blur-[100px] mix-blend-multiply opacity-60">
      {allBlobs.slice(0, count).map((blob, idx) => (
        <motion.div
          key={idx}
          className={`absolute rounded-full ${blob.color} ${blob.size} will-change-transform`}
          style={{ top: blob.top, left: blob.left }}
          animate={{ x: blob.x, y: blob.y, scale: blob.scale }}
          transition={{ duration: blob.duration, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}

// ─── Gradient Aurora (cursor tracking) ───────────────────────
// Desktop only — skipped on mobile/tablet to avoid unnecessary listeners
function GradientAurora({ mouseX, mouseY }: { mouseX: any; mouseY: any }) {
  const x = useSpring(mouseX, { stiffness: 45, damping: 25 });
  const y = useSpring(mouseY, { stiffness: 45, damping: 25 });

  return (
    <motion.div
      className="absolute inset-0 pointer-events-none select-none opacity-[0.2] will-change-transform"
      style={{
        background: useTransform(
          [x, y],
          ([currX, currY]) =>
            `radial-gradient(circle 450px at ${currX}px ${currY}px, var(--color-primary-dark) 8%, transparent 70%)`
        ),
      }}
    />
  );
}

// ─── Tiny Floating Particles ──────────────────────────────────
// Desktop: 30 | Tablet: 0 | Mobile: 0
function ParticleField({ tier }: { tier: 'mobile' | 'tablet' | 'desktop' }) {
  const count = tier === 'desktop' ? 30 : 0;
  const particles = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      duration: Math.random() * 20 + 15,
      delay: Math.random() * -15,
    }))
  , [count]);

  if (count === 0) return null;

  return (
    <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-secondary/25"
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: `${p.size}px`, height: `${p.size}px` }}
          animate={{ y: [-100, 100], opacity: [0, 0.6, 0.6, 0] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'linear' }}
        />
      ))}
    </div>
  );
}

// ─── Animated Grid (parallax on scroll) ──────────────────────
// All tiers — static on mobile (no scroll listener overhead)
function AnimatedGrid({ scrollY, isMobile }: { scrollY: any; isMobile: boolean }) {
  const gridY = useTransform(scrollY, [0, 3000], [0, -60]);
  return (
    <motion.div
      className="absolute inset-0 pointer-events-none select-none opacity-[0.015]"
      style={{
        y: isMobile ? 0 : gridY,
        backgroundImage: `
          linear-gradient(rgba(15, 23, 42, 0.05) 1px, transparent 1px),
          linear-gradient(90deg, rgba(15, 23, 42, 0.05) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
      }}
    />
  );
}

// ─── MAIN WRAPPER COMPONENT ────────────────────────────────────
export default function AnimatedBackground() {
  const [mounted, setMounted] = useState(false);
  const isMobile  = useMediaQuery('(max-width: 640px)');
  const isTablet  = useMediaQuery('(max-width: 1024px)');
  const isReduced = useMediaQuery('(prefers-reduced-motion: reduce)');

  const tier: 'mobile' | 'tablet' | 'desktop' =
    isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop';

  const mouseX = useMotionValue(typeof window !== 'undefined' ? window.innerWidth / 2 : 0);
  const mouseY = useMotionValue(typeof window !== 'undefined' ? window.innerHeight / 2 : 0);

  const { scrollY } = useScroll();

  useEffect(() => {
    setMounted(true);
    // Mouse tracking only on desktop
    if (tier !== 'desktop' || isReduced) return;
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [tier, isReduced, mouseX, mouseY]);

  if (!mounted) return null;
  if (isReduced) {
    // Minimal static background — respects user preference
    return (
      <div className="fixed inset-0 w-full h-full pointer-events-none select-none z-[-10] bg-white" />
    );
  }

  return (
    <div
      className="fixed inset-0 w-full h-full pointer-events-none select-none z-[-10] bg-white overflow-hidden"
      style={{ contentVisibility: 'auto' }}
    >
      {/* Static grid — all tiers */}
      <AnimatedGrid scrollY={scrollY} isMobile={isMobile} />

      {/* Static noise — all tiers, zero animation cost */}
      <NoiseTexture />

      {/* Cursor aurora — desktop only */}
      {tier === 'desktop' && <GradientAurora mouseX={mouseX} mouseY={mouseY} />}

      {/* Blobs — desktop: 3, tablet: 2, mobile: 0 */}
      <FloatingBlobs tier={tier} />

      {/* Particles — desktop: 30, others: 0 */}
      <ParticleField tier={tier} />
    </div>
  );
}
