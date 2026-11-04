import { useEffect, useRef, useState } from "react";

/** One frame-coalesced scroll/pointer loop; no React renders while scrolling. */
export function usePageMotion() {
  const pageRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const root = pageRef.current;
    if (!root) return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const pointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const desktop = window.matchMedia("(min-width: 768px)");
    let scrollFrame = 0;
    let pointerFrame = 0;
    let activeCard: HTMLElement | null = null;
    let observer: IntersectionObserver | undefined;
    const reveals = root.querySelectorAll<HTMLElement>(".reveal");
    const configure = () => {
      setReducedMotion(media.matches);
      observer?.disconnect();
      if (media.matches || !("IntersectionObserver" in window)) {
        root.classList.remove("motion-ready");
        reveals.forEach((el) => el.classList.add("in"));
        return;
      }
      root.classList.add("motion-ready");
      observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("in");
          observer?.unobserve(entry.target);
        });
      }, { threshold: 0.08 });
      reveals.forEach((el) => observer?.observe(el));
    };
    const updateScroll = () => {
      scrollFrame = 0;
      const y = window.scrollY;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      root.style.setProperty("--read-progress", `${total > 0 ? Math.min(y / total, 1) : 0}`);
      root.style.setProperty("--hero-parallax", `${!media.matches && desktop.matches ? Math.min(y * 0.18, 130) : 0}px`);
      setScrolled((previous) => previous === (y > 40) ? previous : y > 40);
    };
    const onScroll = () => {
      if (!scrollFrame) scrollFrame = requestAnimationFrame(updateScroll);
    };
    const resetCard = () => {
      if (!activeCard) return;
      activeCard.style.removeProperty("--tilt-x");
      activeCard.style.removeProperty("--tilt-y");
      activeCard.classList.remove("pointer-active");
      activeCard = null;
    };
    const onPointer = (event: PointerEvent) => {
      if (media.matches || !pointer.matches || event.pointerType === "touch") return;
      const target = event.target instanceof Element ? event.target.closest<HTMLElement>(".motion-card") : null;
      if (target !== activeCard) { resetCard(); activeCard = target; }
      cancelAnimationFrame(pointerFrame);
      if (!target) return;
      const { clientX, clientY } = event;
      pointerFrame = requestAnimationFrame(() => {
        const rect = target.getBoundingClientRect();
        const x = (clientX - rect.left) / rect.width;
        const y = (clientY - rect.top) / rect.height;
        target.style.setProperty("--tilt-x", `${(0.5 - y) * 4}deg`);
        target.style.setProperty("--tilt-y", `${(x - 0.5) * 4}deg`);
        target.style.setProperty("--pointer-x", `${x * 100}%`);
        target.style.setProperty("--pointer-y", `${y * 100}%`);
        target.classList.add("pointer-active");
      });
    };
    const onPreference = () => { resetCard(); configure(); updateScroll(); };
    configure();
    updateScroll();
    media.addEventListener("change", onPreference);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    root.addEventListener("pointermove", onPointer, { passive: true });
    root.addEventListener("pointerleave", resetCard);
    return () => {
      observer?.disconnect();
      cancelAnimationFrame(scrollFrame);
      cancelAnimationFrame(pointerFrame);
      media.removeEventListener("change", onPreference);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      root.removeEventListener("pointermove", onPointer);
      root.removeEventListener("pointerleave", resetCard);
      root.classList.remove("motion-ready");
    };
  }, []);

  return { pageRef, scrolled, reducedMotion };
}