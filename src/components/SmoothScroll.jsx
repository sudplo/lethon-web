'use client';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { useGSAP } from '@gsap/react';

export default function SmoothScroll({ children }) {
  useGSAP(() => {
    // Disable native browser scroll restoration to prevent jumping
    if (typeof window !== 'undefined') {
      window.history.scrollRestoration = 'manual';
    }

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

    // Instantly scroll to top on page load/refresh
    smoother.scrollTo(0, true);
  }, []);

  return <>{children}</>;
}
