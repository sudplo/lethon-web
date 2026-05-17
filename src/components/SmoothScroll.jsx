'use client';

import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* Exponential ease-out — p=2 gives a cinematic deceleration */
const easeExpoOut = (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

export default function SmoothScroll({ children }) {
  const lenisRef = useRef(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 2.0,
      easing: easeExpoOut,
      smoothWheel: true,
      wheelMultiplier: 0.88,
      touchMultiplier: 1.6,
      infinite: false,
      orientation: 'vertical',
    });

    lenisRef.current = lenis;

    /* Keep ScrollTrigger in sync */
    lenis.on('scroll', () => ScrollTrigger.update());

    /* Drive Lenis via GSAP ticker for frame-perfect sync */
    const ticker = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(ticker);
    gsap.ticker.lagSmoothing(0);   /* prevent stutter after tab switch */

    /* Normalize touch-scroll so iOS momentum doesn't fight ScrollTrigger */
    ScrollTrigger.normalizeScroll({
      allowNestedScroll: true,
      lockAxis: false,
      type: 'touch',
    });

    return () => {
      gsap.ticker.remove(ticker);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
