import { useLocation } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode } from "react";

type FlowerPos = { left: number; top: number; size: number; rotate: number };

const FLOWERS: FlowerPos[] = [
  { left: 4, top: 10, size: 30, rotate: 15 },
  { left: 12, top: 42, size: 46, rotate: -20 },
  { left: 20, top: 68, size: 28, rotate: 35 },
  { left: 28, top: 22, size: 38, rotate: -10 },
  { left: 34, top: 52, size: 34, rotate: 25 },
  { left: 42, top: 12, size: 42, rotate: -30 },
  { left: 48, top: 78, size: 30, rotate: 18 },
  { left: 54, top: 38, size: 36, rotate: -15 },
  { left: 60, top: 62, size: 28, rotate: 40 },
  { left: 66, top: 18, size: 40, rotate: -25 },
  { left: 72, top: 48, size: 32, rotate: 12 },
  { left: 78, top: 72, size: 36, rotate: -18 },
  { left: 84, top: 28, size: 30, rotate: 30 },
  { left: 90, top: 55, size: 44, rotate: -8 },
  { left: 96, top: 15, size: 26, rotate: 22 },
  { left: 8, top: 85, size: 34, rotate: -35 },
  { left: 38, top: 88, size: 28, rotate: 10 },
  { left: 62, top: 85, size: 32, rotate: -22 },
  { left: 86, top: 82, size: 30, rotate: 28 },
  { left: 50, top: 5, size: 24, rotate: -12 },
];

function GenetFlower({ size, rotate }: { size: number; rotate: number }) {
  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      style={{ transform: `rotate(${rotate}deg)` }}
      aria-hidden="true"
    >
      <g fill="currentColor">
        <ellipse cx="32" cy="15" rx="7" ry="12" opacity=".9" transform="rotate(0 32 32)" />
        <ellipse cx="32" cy="15" rx="7" ry="12" opacity=".9" transform="rotate(72 32 32)" />
        <ellipse cx="32" cy="15" rx="7" ry="12" opacity=".9" transform="rotate(144 32 32)" />
        <ellipse cx="32" cy="15" rx="7" ry="12" opacity=".9" transform="rotate(216 32 32)" />
        <ellipse cx="32" cy="15" rx="7" ry="12" opacity=".9" transform="rotate(288 32 32)" />
        <circle cx="32" cy="32" r="5" opacity=".55" />
      </g>
    </svg>
  );
}

export function PageTransition({ children }: { children: ReactNode }) {
  const location = useLocation();
  const [active, setActive] = useState(false);
  const isFirst = useRef(true);
  const prevPath = useRef(location.pathname);

  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
    if (prevPath.current !== location.pathname) {
      prevPath.current = location.pathname;
      setActive(true);
      const timer = setTimeout(() => setActive(false), 1100);
      return () => clearTimeout(timer);
    }
  }, [location.pathname]);

  return (
    <>
      {active && (
        <div className="genet-transition" aria-hidden="true">
          <div className="genet-transition-veil" />
          {FLOWERS.map((f, i) => (
            <div
              key={i}
              className="genet-transition-flower"
              style={{
                left: `${f.left}%`,
                top: `${f.top}%`,
                animationDelay: `${(f.left / 100) * 380}ms`,
              }}
            >
              <GenetFlower size={f.size} rotate={f.rotate} />
            </div>
          ))}
        </div>
      )}
      <div key={location.pathname} className={active ? "page-enter" : ""}>
        {children}
      </div>
    </>
  );
}
