'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, animate } from 'framer-motion';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  useMapContext,
} from 'react-simple-maps';
import { Plane, Ship, Package, Globe } from 'lucide-react';

// ─── Natural Earth 110m TopoJSON (official CDN) ───────────────
const GEO_URL =
  'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

// ─── Real geographic coordinates (longitude, latitude) ────────
// Pakistan (Karachi)
const PK_COORDS: [number, number] = [67.01, 24.86];

// Shipping destinations [lng, lat]
const DESTINATIONS: {
  id: string;
  coords: [number, number];
  label: string;
  delay: number;
}[] = [
  { id: 'europe',   coords: [10,  51],   label: 'EUROPE',      delay: 0   },
  { id: 'uk',       coords: [-2,  52],   label: 'UK',          delay: 0.9 },
  { id: 'me',       coords: [44,  26],   label: 'MIDDLE EAST', delay: 0.3 },
  { id: 'africa',   coords: [20,   2],   label: 'AFRICA',      delay: 1.2 },
  { id: 'china',    coords: [104, 36],   label: 'CHINA',       delay: 0.7 },
  { id: 'japan',    coords: [139, 36],   label: 'JAPAN',       delay: 1.5 },
  { id: 'skorea',   coords: [128, 37],   label: 'S. KOREA',    delay: 1.8 },
  { id: 'sg',       coords: [104,  1],   label: 'SINGAPORE',   delay: 2.1 },
  { id: 'aus',      coords: [133,-27],   label: 'AUSTRALIA',   delay: 2.3 },
  { id: 'usa',      coords: [-98, 40],   label: 'USA',         delay: 1.6 },
  { id: 'canada',   coords: [-96, 56],   label: 'CANADA',      delay: 2.5 },
  { id: 'sam',      coords: [-58,-15],   label: 'S. AMERICA',  delay: 2.9 },
];

const STATS = [
  { Icon: Globe,   value: 85,   suffix: '+',   label: 'Countries'  },
  { Icon: Ship,    value: 1200, suffix: '+',   label: 'Shipments'  },
  { Icon: Package, value: 25,   suffix: '+',   label: 'Categories' },
  { Icon: Plane,   value: 0,    suffix: '24/7',label: 'Logistics'  },
];

// ─── Animated counter ─────────────────────────────────────────
function Counter({ target, suffix }: { target: number; suffix: string }) {
  const [val, setVal] = useState(0);
  const mv = useMotionValue(0);
  useEffect(() => {
    if (target === 0) { setVal(0); return; }
    const ctrl = animate(mv, target, {
      duration: 2,
      ease: 'easeOut',
      onUpdate: v => setVal(Math.round(v)),
    });
    return ctrl.stop;
  }, [target, mv]);
  if (target === 0) return <span className="text-xs font-black text-slate-900 leading-none">24/7</span>;
  return <span className="text-xs font-black text-slate-900 leading-none">{val.toLocaleString()}{suffix}</span>;
}

// ─── SVG bezier arc between two projected points ──────────────
function CurvedRoute({
  fromSvg,
  toSvg,
  dur,
  delay,
}: {
  fromSvg: [number, number];
  toSvg: [number, number];
  dur: number;
  delay: number;
}) {
  const pathRef = useRef<SVGPathElement>(null);
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const rafRef = useRef<number>(0);

  // Mid-point arc (lift the midpoint upward for a nice arc)
  const mx = (fromSvg[0] + toSvg[0]) / 2;
  const my = (fromSvg[1] + toSvg[1]) / 2 - Math.abs(fromSvg[0] - toSvg[0]) * 0.25;
  const d = `M${fromSvg[0]},${fromSvg[1]} Q${mx},${my} ${toSvg[0]},${toSvg[1]}`;

  useEffect(() => {
    let startTs: number | null = null;
    const delayMs = delay * 1000;
    const durMs = dur * 1000;

    const t = setTimeout(() => {
      const tick = (ts: number) => {
        if (!startTs) startTs = ts;
        const progress = ((ts - startTs) % durMs) / durMs;
        const el = pathRef.current;
        if (el) {
          const len = el.getTotalLength();
          const pt = el.getPointAtLength(progress * len);
          setPos({ x: pt.x, y: pt.y });
        }
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    }, delayMs);

    return () => { clearTimeout(t); cancelAnimationFrame(rafRef.current); };
  }, [fromSvg, toSvg, dur, delay, d]);

  return (
    <g>
      {/* Static dashed arc in Royal Blue */}
      <path
        ref={pathRef}
        d={d}
        fill="none"
        stroke="#1e40af"
        strokeWidth="0.6"
        strokeDasharray="3,5"
        opacity="0.25"
        strokeLinecap="round"
      />
      {/* Moving glowing particle in Fresh Orange */}
      {pos && (
        <g>
          <circle cx={pos.x} cy={pos.y} r="2.5" fill="#f97316" opacity="0.95"
            style={{ filter: 'drop-shadow(0 0 4px #f97316)' }}
          />
          <circle cx={pos.x} cy={pos.y} r="5" fill="#f97316" opacity="0.15" />
        </g>
      )}
    </g>
  );
}

// ─── Destination ripple node ──────────────────────────────────
function DestinationNode({
  label,
  delay,
}: {
  label: string;
  delay: number;
}) {
  const [hov, setHov] = useState(false);
  return (
    <g
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      {/* Expanding ripple in Royal Blue */}
      <motion.circle
        r="8"
        fill="none"
        stroke="#1e40af"
        strokeWidth="0.6"
        initial={{ opacity: 0.5, scale: 0.5 }}
        animate={{ opacity: 0, scale: 2.5 }}
        transition={{ duration: 2.2, delay, repeat: Infinity, repeatDelay: 2.5, ease: 'easeOut' }}
      />
      {/* Dot in Royal Blue */}
      <circle
        r={hov ? 4 : 3}
        fill="#1e40af"
        opacity={0.9}
        style={{ filter: 'drop-shadow(0 0 3px #1e40af)', transition: 'r 0.2s ease' }}
      />
      <circle r="1.2" fill="white" />
      {/* Label */}
      <text
        x={6} y={-5}
        fontSize="4.5"
        fontWeight="700"
        fill="#4b5563"
        letterSpacing="0.08em"
        fontFamily="Outfit, Inter, system-ui, sans-serif"
      >
        {label}
      </text>
    </g>
  );
}

// ─── Main Pakistan hub marker ─────────────────────────────────
function PakistanMarker() {
  return (
    <g>
      {/* Pulsing rings in Emerald Green */}
      {[14, 22, 32].map((r, i) => (
        <motion.circle
          key={r}
          r={r}
          fill="none"
          stroke="#0b5e3a"
          strokeWidth="0.7"
          initial={{ opacity: 0.6, scale: 0.7 }}
          animate={{ opacity: 0, scale: 1.6 }}
          transition={{ duration: 2.8, delay: i * 0.65, repeat: Infinity, ease: 'easeOut' }}
        />
      ))}
      {/* Glow */}
      <circle r="9" fill="#0b5e3a" opacity="0.15" style={{ filter: 'blur(2px)' }} />
      {/* Main dot */}
      <circle r="6" fill="#0b5e3a" opacity="0.9" style={{ filter: 'drop-shadow(0 0 8px #0b5e3a)' }} />
      <circle r="3" fill="white" />
      {/* Label */}
      <text
        x={10} y={3}
        fontSize="7"
        fontWeight="800"
        fill="#111827"
        letterSpacing="0.14em"
        fontFamily="Outfit, Inter, system-ui, sans-serif"
      >
        PAKISTAN
      </text>
      <text
        x={10} y={12}
        fontSize="4.5"
        fontWeight="600"
        fill="#4b5563"
        letterSpacing="0.1em"
        fontFamily="Outfit, Inter, system-ui, sans-serif"
      >
        EXPORT HUB · KARACHI
      </text>
    </g>
  );
}

// ─── Shipping Routes Component using Map Context ───────────────
function ShippingRoutes() {
  const { projection } = useMapContext();
  const pkSvg = projection(PK_COORDS);
  
  if (!pkSvg) return null;

  const ROUTE_DURS = [5.5, 6.2, 3.2, 5.1, 4.3, 5.1, 5.5, 4.6, 6.1, 7.1, 7.6, 7.9];

  return (
    <g>
      {DESTINATIONS.map((dest, i) => {
        const destSvg = projection(dest.coords);
        if (!destSvg) return null;
        return (
          <CurvedRoute
            key={dest.id}
            fromSvg={pkSvg as [number, number]}
            toSvg={destSvg as [number, number]}
            dur={ROUTE_DURS[i] || 5}
            delay={dest.delay}
          />
        );
      })}
    </g>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────
export default function WorldShippingMap() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="w-full rounded-3xl border border-slate-200/50 relative overflow-hidden"
      style={{
        background: 'rgba(255,255,255,0.85)',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 8px 40px -8px rgba(11,94,58,0.04), 0 2px 12px -2px rgba(11,94,58,0.02)',
      }}
    >
      {/* Live indicator */}
      <div className="absolute top-4 left-5 z-20 flex items-center gap-2 text-[9px] text-slate-600 uppercase tracking-[0.15em] font-bold">
        <motion.span
          className="w-1.5 h-1.5 rounded-full bg-emerald-600 inline-block"
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 1.6, repeat: Infinity }}
        />
        Live Shipping Corridors
      </div>

      {/* Stat cards */}
      <div className="absolute top-4 right-4 z-20 grid grid-cols-2 gap-1.5">
        {STATS.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 + i * 0.12 }}
            className="flex items-center gap-2 rounded-xl px-2.5 py-2 border border-slate-100 bg-white/95 shadow-sm backdrop-blur-sm"
          >
            <div className="w-6 h-6 rounded-lg bg-emerald-50 border border-emerald-100/50 flex items-center justify-center text-emerald-700 shrink-0">
              <s.Icon size={12} />
            </div>
            <div>
              <Counter target={s.value} suffix={s.suffix} />
              <div className="text-[8px] text-slate-500 font-semibold uppercase tracking-wider">{s.label}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Map */}
      <ComposableMap
        projection="geoNaturalEarth1"
        projectionConfig={{ scale: 140, center: [30, 15] }}
        style={{ width: '100%', height: 'auto', display: 'block' }}
      >
        <defs>
          <radialGradient id="pkGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#0b5e3a" stopOpacity="0.20" />
            <stop offset="100%" stopColor="#0b5e3a" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Geographically accurate world map */}
        <Geographies geography={GEO_URL}>
          {({ geographies }) =>
            geographies.map(geo => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill="#f3f4f6"
                stroke="#e5e7eb"
                strokeWidth={0.4}
                style={{
                  default: { outline: 'none' },
                  hover: { fill: '#e6f4ea', outline: 'none' },
                  pressed: { outline: 'none' },
                }}
              />
            ))
          }
        </Geographies>

        {/* Animated shipping routes from context */}
        <ShippingRoutes />

        {/* Destination nodes */}
        {DESTINATIONS.map(dest => (
          <Marker key={`dest-${dest.id}`} coordinates={dest.coords}>
            <DestinationNode
              label={dest.label}
              delay={dest.delay}
            />
          </Marker>
        ))}

        {/* Pakistan hub */}
        <Marker coordinates={PK_COORDS}>
          <PakistanMarker />
        </Marker>
      </ComposableMap>

      {/* Bottom watermark */}
      <div className="absolute bottom-3.5 left-5 text-[7.5px] text-slate-400 uppercase tracking-[0.15em] font-semibold">
        Dewan Traders · Sargodha, Pakistan · Est. 1998
      </div>
    </motion.div>
  );
}
