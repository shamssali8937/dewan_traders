"use client";

import React, { useCallback, useRef } from "react";
import Image from "next/image";
import { motion, useAnimate } from "framer-motion";

// ---------------------------------------------------------------------------
// DewanTradersLogo
//
// Lightweight replacement for the old 190-path inline SVG eagle.
// Uses next/image (automatic WebP optimisation) + framer-motion for the
// intro animation (fade + slide up) and a gentle continuous idle float.
//
// Props are API-compatible with the previous SVG component so every call-site
// continues to work without modification.
// ---------------------------------------------------------------------------

export default function DewanTradersLogo({
  className = "",
  width = 200,
  autoplay = true,
  iconOnly = false,
}: {
  className?: string;
  width?: number;
  autoplay?: boolean;
  iconOnly?: boolean;
}) {
  const [scope, animate] = useAnimate();
  const hasAnimated = useRef(false);

  // Entry animation: fade + slide up, then idle float loop
  // Only used on click-to-replay — logo shows immediately on mount
  const runAnimation = useCallback(async () => {
    if (!scope.current) return;

    // Reset to invisible
    await animate(scope.current, { opacity: 0, y: 12, scale: 0.94 }, { duration: 0 });

    // Entry: fade in + rise
    await animate(
      scope.current,
      { opacity: 1, y: 0, scale: 1 },
      { duration: 0.55, ease: [0.16, 1, 0.3, 1] }
    );

    // Idle: gentle float loop
    animate(
      scope.current,
      { y: [0, -5, 0] },
      { duration: 4.2, ease: "easeInOut", repeat: Infinity }
    );
  }, [animate, scope]);

  // On mount: logo is already visible — just start the idle float
  const handleMountRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (node && !hasAnimated.current) {
        hasAnimated.current = true;
        // Small delay so framer-motion scope is ready, then float
        const t = setTimeout(() => {
          if (scope.current) {
            animate(
              scope.current,
              { y: [0, -5, 0] },
              { duration: 4.2, ease: "easeInOut", repeat: Infinity }
            );
          }
        }, 100);
        return () => clearTimeout(t);
      }
    },
    [animate, scope]
  );

  // Effective display width — iconOnly uses a smaller square crop
  const displayWidth = iconOnly ? Math.min(width, 48) : width;

  return (
    <div
      ref={handleMountRef}
      className={className}
      style={{
        width: displayWidth,
        maxWidth: "100%",
        flexShrink: 0,
        // mix-blend-mode must be on the outer non-animated wrapper —
        // framer-motion's transform creates an isolated compositing group
        // that prevents blend modes from reaching the page background.
        mixBlendMode: iconOnly ? "normal" : "multiply",
      }}
    >
      <motion.div
        ref={scope}
        initial={{ opacity: 1, y: 0, scale: 1 }}
        style={{ width: "100%", cursor: "pointer" }}
        onClick={runAnimation}
        title="Dewan Traders"
      >
        <Image
          src="/images/dewan_new_logo.png"
          alt="Dewan Traders Logo"
          width={displayWidth * 2}
          height={displayWidth * 2}
          style={{
            width: "100%",
            height: "auto",
            objectFit: "contain",
            display: "block",
          }}
          priority={displayWidth >= 100}
          draggable={false}
        />
      </motion.div>
    </div>
  );
}