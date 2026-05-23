'use client';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { useGSAP } from '@gsap/react';

// Force manual scroll restoration at the module level (runs as early as possible on client load)
if (typeof window !== 'undefined') {
  window.history.scrollRestoration = 'manual';
  
  // Attempt immediate scroll reset
  window.scrollTo(0, 0);

  // Force scroll to top before unloading so the browser records (0,0) for the current history entry
  window.addEventListener('beforeunload', () => {
    window.scrollTo(0, 0);
  });
}

export default function SmoothScroll({ children }) {
  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

    const smoother = ScrollSmoother.create({
      wrapper: '#smooth-wrapper',
      content: '#smooth-content',
      smooth: 2,               /* Cinematic deceleration (similar to Lenis 2.0) */
      effects: true,           /* Enable data-speed and data-lag attributes */
      smoothTouch: 0.1,        /* Slight smoothing on touch devices for responsiveness */
      normalizeScroll: true,   /* Prevents address bar jitters and ensures consistency */
      ignoreMobileResize: true /* Optimizes performance on mobile orientation changes */
    });

    const resetScroll = () => {
      window.scrollTo(0, 0);
      smoother.scrollTo(0, true);
      ScrollTrigger.refresh();
    };

    // Reset immediately on mount
    resetScroll();

    // Multiple staggered timers to combat Next.js client-side dynamic hydration layout shifts
    const timers = [
      setTimeout(resetScroll, 50),
      setTimeout(resetScroll, 150),
      setTimeout(resetScroll, 300),
      setTimeout(resetScroll, 600)
    ];

    window.addEventListener('load', resetScroll);

    return () => {
      timers.forEach(clearTimeout);
      window.removeEventListener('load', resetScroll);
    };
  }, []);

  return <>{children}</>;
}

