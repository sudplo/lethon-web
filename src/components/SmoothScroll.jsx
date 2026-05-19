'use client';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { useGSAP } from '@gsap/react';

export default function SmoothScroll({ children }) {
  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

    ScrollSmoother.create({
      wrapper: '#smooth-wrapper',
      content: '#smooth-content',
      smooth: 2,               /* Cinematic deceleration (similar to Lenis 2.0) */
      effects: true,           /* Enable data-speed and data-lag attributes */
      smoothTouch: 0.1,        /* Slight smoothing on touch devices for responsiveness */
      normalizeScroll: true,   /* Prevents address bar jitters and ensures consistency */
      ignoreMobileResize: true /* Optimizes performance on mobile orientation changes */
    });
  }, []);

  return <>{children}</>;
}
