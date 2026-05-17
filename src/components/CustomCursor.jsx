'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import styles from './CustomCursor.module.css';

export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const xTo = useRef(null);
  const yTo = useRef(null);
  const ringXTo = useRef(null);
  const ringYTo = useRef(null);
  
  const isVisibleRef = useRef(false);
  
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Hide native cursor completely
    document.body.style.cursor = 'none';
    
    const startX = window.innerWidth / 2;
    const startY = window.innerHeight / 2;
    gsap.set([dotRef.current, ringRef.current], { x: startX, y: startY });

    xTo.current = gsap.quickTo(dotRef.current, 'x', { duration: 0.08, ease: 'power3.out' });
    yTo.current = gsap.quickTo(dotRef.current, 'y', { duration: 0.08, ease: 'power3.out' });
    ringXTo.current = gsap.quickTo(ringRef.current, 'x', { duration: 0.42, ease: 'expo.out' });
    ringYTo.current = gsap.quickTo(ringRef.current, 'y', { duration: 0.42, ease: 'expo.out' });

    const onMouseMove = (e) => {
      xTo.current(e.clientX);
      yTo.current(e.clientY);
      ringXTo.current(e.clientX);
      ringYTo.current(e.clientY);
      if (!isVisibleRef.current) {
        isVisibleRef.current = true;
        setIsVisible(true);
      }
    };

    const onMouseLeave = () => {
      isVisibleRef.current = false;
      setIsVisible(false);
    };
    const onMouseEnter = () => {
      isVisibleRef.current = true;
      setIsVisible(true);
    };

    const onHoverEnter = () => setIsHovering(true);
    const onHoverLeave = () => setIsHovering(false);

    window.addEventListener('mousemove', onMouseMove);
    document.documentElement.addEventListener('mouseleave', onMouseLeave);
    document.documentElement.addEventListener('mouseenter', onMouseEnter);

    // Attach hover listeners to all interactive elements
    const attachHoverEvents = () => {
      const interactiveElements = document.querySelectorAll('a, button, input, textarea, select, [data-interactive]');
      interactiveElements.forEach((el) => {
        el.addEventListener('mouseenter', onHoverEnter);
        el.addEventListener('mouseleave', onHoverLeave);
      });
      return interactiveElements;
    };

    let interactives = attachHoverEvents();

    // Re-attach on DOM mutations to handle React rendering
    const observer = new MutationObserver(() => {
      interactives.forEach((el) => {
        el.removeEventListener('mouseenter', onHoverEnter);
        el.removeEventListener('mouseleave', onHoverLeave);
      });
      interactives = attachHoverEvents();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.documentElement.removeEventListener('mouseleave', onMouseLeave);
      document.documentElement.removeEventListener('mouseenter', onMouseEnter);
      
      interactives.forEach((el) => {
        el.removeEventListener('mouseenter', onHoverEnter);
        el.removeEventListener('mouseleave', onHoverLeave);
      });
      
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <div 
        ref={dotRef} 
        className={`${styles.dot} ${isVisible ? styles.visible : ''} ${isHovering ? styles.hovering : ''}`}
      />
      <div 
        ref={ringRef} 
        className={`${styles.ring} ${isVisible ? styles.visible : ''} ${isHovering ? styles.hovering : ''}`}
      />
    </>
  );
}
