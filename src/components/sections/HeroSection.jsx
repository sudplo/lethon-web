'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import styles from './HeroSection.module.css';

gsap.registerPlugin(ScrollTrigger, useGSAP);

function buildTypewriter(container, text) {
  container.innerHTML = '';
  const chars = [...text];
  chars.forEach((ch) => {
    const span = document.createElement('span');
    span.textContent = ch === ' ' ? '\u00A0' : ch;
    span.style.opacity = '0';
    span.style.display = 'inline-block';
    container.appendChild(span);
  });
  return container.querySelectorAll('span');
}

export default function HeroSection() {
  const sectionRef = useRef(null);
  const contentRef = useRef(null);
  const line1Ref = useRef(null);
  const line2Ref = useRef(null);
  const subRef = useRef(null);
  const ctasRef = useRef(null);
  const overlayRef = useRef(null);
  const scrollHintRef = useRef(null);

  useGSAP((context, contextSafe) => {
    const nav = document.querySelector('header');
    const canvas = document.getElementById('canvas-container');
    const mm = gsap.matchMedia();

    // ── 1. INITIAL STATES ──
    gsap.set([nav, canvas], { autoAlpha: 0 });
    gsap.set(line2Ref.current, { autoAlpha: 0, y: 20 });
    gsap.set(subRef.current, { autoAlpha: 0, y: 30 });
    gsap.set(ctasRef.current, { autoAlpha: 0, y: 20 });
    gsap.set(scrollHintRef.current, { autoAlpha: 0 });
    gsap.set(overlayRef.current, { autoAlpha: 1 });

    const chars = buildTypewriter(line1Ref.current, 'You are being watched.');

    // ── 2. ENTRANCE NARRATIVE ──
    const master = gsap.timeline({ delay: 0.5 });

    master.to(overlayRef.current, { autoAlpha: 0, duration: 1.5, ease: 'power2.inOut' })
      .to(chars, {
        opacity: 1,
        y: 0,
        stagger: 0.04,
        duration: 0.1,
        ease: 'none',
      }, '-=0.5')
      .to({}, { duration: 1 }) // Breath
      .to(line1Ref.current, { 
        autoAlpha: 0, 
        filter: 'blur(10px)', 
        scale: 1.1, 
        duration: 0.8, 
        ease: 'power2.in' 
      })
      .fromTo(line2Ref.current,
        { autoAlpha: 0, filter: 'blur(20px)', scale: 0.9, y: 20 },
        { autoAlpha: 1, filter: 'blur(0px)', scale: 1, y: 0, duration: 1.2, ease: 'expo.out' },
        '+=0.2'
      )
      .to(canvas, { autoAlpha: 1, duration: 2, ease: 'power2.inOut' }, '-=1')
      .to(subRef.current, { autoAlpha: 1, y: 0, duration: 1, ease: 'power3.out' }, '-=0.8')
      .to(ctasRef.current, { autoAlpha: 1, y: 0, duration: 1, ease: 'power3.out' }, '-=0.6')
      .to(scrollHintRef.current, { autoAlpha: 1, y: 0, duration: 1.2, ease: 'back.out(1.7)' }, '-=0.4')
      .to(nav, { autoAlpha: 1, duration: 1 }, '-=1');

    // ── 3. MOUSE PARALLAX (Interactive Depth) ──
    const onMouseMove = contextSafe((e) => {
      if (!isDesktop) return;
      const { clientX, clientY } = e;
      const xPos = (clientX / window.innerWidth - 0.5) * 30;
      const yPos = (clientY / window.innerHeight - 0.5) * 30;

      gsap.to(contentRef.current, {
        x: xPos,
        y: yPos,
        duration: 1.2,
        ease: 'power2.out',
        overwrite: 'auto'
      });
    });

    window.addEventListener('mousemove', onMouseMove);

    // ── 4. RESPONSIVE SCROLL EFFECTS ──
    const isDesktop = window.innerWidth > 760;
    
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
          gsap.set(contentRef.current, {
            opacity: 1 - self.progress * 1.2,
            y: self.progress * (isDesktop ? -100 : -50)
          });
        }
      });
    });

    return () => window.removeEventListener('mousemove', onMouseMove);
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className={styles.hero} id="hero" data-scroll-section>
      <div ref={overlayRef} className={styles.overlay} aria-hidden="true" />

      <div className={`container ${styles.content}`} ref={contentRef}>
        <div className={styles.headline}>
          <p ref={line1Ref} className={styles.line1} aria-label="You are being watched." />
          <h1 ref={line2Ref} className={styles.line2}>Not by us.</h1>
        </div>

        <p ref={subRef} className={styles.sub}>
          Privacy shouldn&apos;t be a feature you have to trust.<br className={styles.brDesktop} />
          We built it into the architecture itself.
        </p>

        <div className={styles.ctas} ref={ctasRef}>
          <a href="#architecture" className={styles.ctaPrimary} data-interactive="true">
            Explore the architecture
          </a>
          <a
            href="https://github.com/sudplo/lethon"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.ctaSecondary}
            data-interactive="true"
          >
            Star on GitHub ↗
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
