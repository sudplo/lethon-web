'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import styles from './CustomCursor.module.css';

export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const requestRef = useRef(null);
  
  const mouse = useRef({ x: 0, y: 0 });
  const ringPos = useRef({ x: 0, y: 0 });
  
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Hide native cursor completely
    document.body.style.cursor = 'none';
    
    // Initial position centering
    mouse.current = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    ringPos.current = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

    const onMouseMove = (e) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
      if (!isVisible) setIsVisible(true);
    };

    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

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

    // Render loop for smooth lag effect
    const render = () => {
      // Direct positioning for dot (no lag)
      gsap.set(dotRef.current, {
        x: mouse.current.x,
        y: mouse.current.y,
      });

      // Linear interpolation for ring (12% lag as spec: "Ring 32px con lag 12%")
      const lag = 0.12;
      ringPos.current.x += (mouse.current.x - ringPos.current.x) * lag;
      ringPos.current.y += (mouse.current.y - ringPos.current.y) * lag;

      gsap.set(ringRef.current, {
        x: ringPos.current.x,
        y: ringPos.current.y,
      });

      requestRef.current = requestAnimationFrame(render);
    };

    requestRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.documentElement.removeEventListener('mouseleave', onMouseLeave);
      document.documentElement.removeEventListener('mouseenter', onMouseEnter);
      
      interactives.forEach((el) => {
        el.removeEventListener('mouseenter', onHoverEnter);
        el.removeEventListener('mouseleave', onHoverLeave);
      });
      
      observer.disconnect();
      cancelAnimationFrame(requestRef.current);
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
