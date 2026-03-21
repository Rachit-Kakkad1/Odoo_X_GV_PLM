import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Custom hook for staggered list animations.
 * Uses IntersectionObserver to trigger animations when elements scroll into view.
 * Respects prefers-reduced-motion.
 */
export default function useStaggeredAnimation(itemCount, delayBetween = 80) {
  const [visibleItems, setVisibleItems] = useState([]);
  const containerRef = useRef(null);
  const hasAnimated = useRef(false);
  const prefersReduced = useRef(false);

  useEffect(() => {
    prefersReduced.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced.current) {
      setVisibleItems(Array.from({ length: itemCount }, (_, i) => i));
    }
  }, [itemCount]);

  const triggerAnimation = useCallback(() => {
    if (hasAnimated.current || prefersReduced.current) return;
    hasAnimated.current = true;

    for (let i = 0; i < itemCount; i++) {
      setTimeout(() => {
        setVisibleItems(prev => [...prev, i]);
      }, i * delayBetween);
    }
  }, [itemCount, delayBetween]);

  useEffect(() => {
    if (prefersReduced.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          triggerAnimation();
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [triggerAnimation]);

  const getItemStyle = useCallback((index) => {
    const isVisible = visibleItems.includes(index);
    if (prefersReduced.current) {
      return { opacity: 1, transform: 'translateY(0) translateX(0)' };
    }
    return {
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? 'translateY(0) translateX(0)' : 'translateY(12px) translateX(-8px)',
      transition: `opacity 400ms ease-out, transform 400ms ease-out`,
    };
  }, [visibleItems]);

  return { containerRef, getItemStyle, visibleItems };
}
