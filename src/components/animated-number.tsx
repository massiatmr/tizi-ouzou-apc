import { useEffect, useRef, useState } from "react";

export function AnimatedNumber({ value, label, reducedMotion }: { value: number; label: string; reducedMotion: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(value);
  useEffect(() => {
    const element = ref.current;
    if (!element || reducedMotion || !("IntersectionObserver" in window)) { setDisplay(value); return; }
    let frame = 0;
    const observer = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      observer.disconnect();
      const start = performance.now();
      const tick = (now: number) => {
        const progress = Math.min((now - start) / 950, 1);
        setDisplay(Math.round(value * (1 - Math.pow(1 - progress, 3))));
        if (progress < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    }, { threshold: 0.5 });
    observer.observe(element);
    return () => { observer.disconnect(); cancelAnimationFrame(frame); };
  }, [value, reducedMotion]);
  const parts = label.split(String(value));
  return <span ref={ref} className="tabular-nums" aria-label={label}><span aria-hidden="true">{parts[0]}{display}{parts.slice(1).join(String(value))}</span></span>;
}