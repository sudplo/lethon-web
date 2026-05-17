'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextPlugin } from 'gsap/TextPlugin';
import { useGSAP } from '@gsap/react';
import styles from './HeroSection.module.css';

gsap.registerPlugin(ScrollTrigger, TextPlugin, useGSAP);

export default function HeroSection() {
  const sectionRef = useRef(null);
  const contentRef = useRef(null);
  const line1Ref = useRef(null);
  const line2Ref = useRef(null);
  const subRef = useRef(null);
  const ctasRef = useRef(null);
  const overlayRef = useRef(null);
  const scrollHintRef = useRef(null);
  const gridRef = useRef(null);

  useGSAP((context, contextSafe) => {
    const nav = document.querySelector('header');
    const canvas = document.getElementById('canvas-container');
    const mm = gsap.matchMedia();

    // ── 1. INITIAL STATES ──
    gsap.set([nav, canvas], { autoAlpha: 0 });
    gsap.set(line1Ref.current, { text: "" }); // Start empty for typing
    gsap.set(line2Ref.current, { autoAlpha: 0, scale: 0.8, filter: 'blur(20px)' });
    gsap.set(subRef.current, { autoAlpha: 0, y: 30, filter: 'blur(10px)' });
    gsap.set(ctasRef.current, { autoAlpha: 0, y: 20 });
    gsap.set(scrollHintRef.current, { autoAlpha: 0 });
    gsap.set(overlayRef.current, { autoAlpha: 1 });
    gsap.set(gridRef.current, { opacity: 0 });

    // ── 2. ENTRANCE NARRATIVE ──
    const master = gsap.timeline({ delay: 0.3 });

    master
      .to(overlayRef.current, { autoAlpha: 0, duration: 1.5, ease: 'power2.inOut' })
      .to(gridRef.current, { opacity: 0.15, duration: 2 }, '-=1')
      .to(line1Ref.current, {
        duration: 1.5,
        text: {
          value: "You are being watched.",
          delimiter: ""
        },
        ease: "none"
      })
      .to(line1Ref.current, {
        autoAlpha: 0,
        filter: 'blur(10px)',
        scale: 1.05,
        duration: 0.8,
        ease: 'power2.inIn',
        delay: 0.5
      })
      .to(line2Ref.current, {
        autoAlpha: 1,
        scale: 1,
        filter: 'blur(0px)',
        duration: 1.5,
        ease: 'expo.out'
      }, "-=0.2")
      .to(canvas, { autoAlpha: 1, duration: 2, ease: 'power2.inOut' }, '-=1.2')
      .to(subRef.current, { 
        autoAlpha: 1, 
        y: 0, 
        filter: 'blur(0px)',
        duration: 1.2, 
        ease: 'power3.out' 
      }, '-=1')
      .to(ctasRef.current, { autoAlpha: 1, y: 0, duration: 1, ease: 'power3.out' }, '-=0.8')
      .to(scrollHintRef.current, { autoAlpha: 1, y: 0, duration: 1.2, ease: 'back.out(1.7)' }, '-=0.6')
      .to(nav, { autoAlpha: 1, duration: 1 }, '-=1');

    // ── 3. MOUSE PARALLAX & GRID ANIMATION ──
    const onMouseMove = contextSafe((e) => {
      const { clientX, clientY } = e;
      const xPercent = (clientX / window.innerWidth - 0.5);
      const yPercent = (clientY / window.innerHeight - 0.5);

      gsap.to(contentRef.current, {
        x: xPercent * 40,
        y: yPercent * 40,
        rotateY: xPercent * 10,
        rotateX: -yPercent * 10,
        duration: 1.5,
        ease: 'power2.out',
        overwrite: 'auto'
      });

      gsap.to(gridRef.current, {
        x: -xPercent * 60,
        y: -yPercent * 60,
        duration: 2,
        ease: 'power1.out'
      });
    });

    window.addEventListener('mousemove', onMouseMove);

    // ── 4. SCROLL PERSPECTIVE ──
    mm.add({
      isDesktop: "(min-width: 761px)",
      isMobile: "(max-width: 760px)"
    }, (c) => {
      const { isDesktop } = c.conditions;
      
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
        onUpdate: (self) => {
          const p = self.progress;
          gsap.set(contentRef.current, {
            opacity: 1 - p * 1.5,
            y: p * -150,
            scale: 1 - p * 0.1,
            rotateX: p * 20
          });
          gsap.set(gridRef.current, {
            y: p * 100,
            opacity: 0.15 * (1 - p)
          });
        }
      });
    });

    return () => window.removeEventListener('mousemove', onMouseMove);
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className={styles.hero} id="hero" data-scroll-section>
      <div ref={overlayRef} className={styles.overlay} aria-hidden="true" />
      <div ref={gridRef} className={styles.gridBackground} aria-hidden="true" />

      <div className={`container ${styles.content}`} ref={contentRef}>
        <div className={styles.headline}>
          <p ref={line1Ref} className={styles.line1}>You are being watched.</p>
          <h1 ref={line2Ref} className={styles.line2}>Not by us.</h1>
        </div>

        <p ref={subRef} className={styles.sub}>
          Privacy shouldn&apos;t be a feature you have to trust.<br className={styles.brDesktop} />
          We built it into the architecture itself.
        </p>

        <div className={styles.ctas} ref={ctasRef}>
          <a href="#architecture" className={styles.ctaPrimary} data-interactive="true">
            Explore architecture
          </a>
          <a
            href="https://github.com/sudplo/lethon"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.ctaSecondary}
            data-interactive="true"
          >
            Open Source ↗
          </a>
        </div>
      </div>

      <div ref={scrollHintRef} className={styles.scrollHint} aria-hidden="true">
        <div className={styles.scrollLine} />
        <span>scroll</span>
      </div>
    </section>
  );
}
