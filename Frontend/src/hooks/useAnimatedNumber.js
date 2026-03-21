import { useState, useEffect, useRef } from 'react';

/**
 * Custom hook for animating a number from 0 to targetValue.
 * Uses requestAnimationFrame for 60fps smooth animation.
 * Respects prefers-reduced-motion.
 */
export default function useAnimatedNumber(targetValue, duration = 1200) {
  const [current, setCurrent] = useState(0);
  const rafRef = useRef(null);
  const startTimeRef = useRef(null);
  const prefersReduced = useRef(false);

  useEffect(() => {
    prefersReduced.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  useEffect(() => {
    if (prefersReduced.current) {
      setCurrent(targetValue);
      return;
    }

    const target = Number(targetValue) || 0;
    startTimeRef.current = null;

    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

    const animate = (timestamp) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutCubic(progress);
      
      setCurrent(Math.round(eased * target));

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [targetValue, duration]);

  return current;
}
