'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import styles from './HeroSection.module.css';

gsap.registerPlugin(ScrollTrigger, useGSAP);

/* Build spans for typewriter from a string */
function buildTypewriter(container, text) {
  container.innerHTML = '';
  const chars = [...text];  /* spread handles emoji/unicode properly */
  chars.forEach((ch) => {
    const span = document.createElement('span');
    span.textContent = ch === ' ' ? '\u00A0' : ch;
    span.style.opacity = '0';
    container.appendChild(span);
  });
  return container.querySelectorAll('span');
}

export default function HeroSection() {
  const sectionRef = useRef(null);
  const line1Ref = useRef(null);
  const line2Ref = useRef(null);
  const subRef = useRef(null);
  const cta1Ref = useRef(null);
  const cta2Ref = useRef(null);
  const overlayRef = useRef(null);
  const scrollHintRef = useRef(null);

  useGSAP(() => {
    const nav = document.querySelector('header');
    const canvas = document.getElementById('canvas-container');
    const mm = gsap.matchMedia();

    /* ── Initial states ── */
    gsap.set([nav, canvas], { autoAlpha: 0 });
    gsap.set(line2Ref.current, { autoAlpha: 0 });
    gsap.set(subRef.current, { autoAlpha: 0, y: 32 });
    gsap.set([cta1Ref.current, cta2Ref.current], { autoAlpha: 0, y: 16 });
    gsap.set(scrollHintRef.current, { autoAlpha: 0 });
    gsap.set(overlayRef.current, { autoAlpha: 1 });

    const chars = buildTypewriter(line1Ref.current, 'You are being watched.');

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const master = gsap.timeline({ delay: reduceMotion ? 0 : 0.5 });

    /* Fade out overlay */
    master.to(overlayRef.current, { autoAlpha: 0, duration: 1.2, ease: 'power2.inOut' }, 0);

    /* Typewriter — 0.045s per char gives ~1s for 22 chars */
    master.to(chars, {
      opacity: 1,
      duration: 0.001,
      stagger: 0.045,
      ease: 'none',
    }, 0.55);

    /* Pause — let the statement breathe */
    master.to({}, { duration: 0.72 });

    /* Fade line1, reveal line2 with blur-clear */
    master
      .to(line1Ref.current, { autoAlpha: 0, duration: 0.7, ease: 'power2.inOut' })
      .fromTo(
        line2Ref.current,
        { autoAlpha: 0, filter: 'blur(24px)', scale: 1.06 },
        { autoAlpha: 1, filter: 'blur(0px)', scale: 1, duration: 1.0, ease: 'expo.out' },
        '+=0.18'
      )
      /* Canvas rises as line2 appears */
      .to(canvas, { autoAlpha: 1, duration: 1.8, ease: 'power2.inOut' }, '-=1.2')

      /* Content cascade */
      .to({}, { duration: 0.1 })
      .to(subRef.current, { autoAlpha: 1, y: 0, duration: 1.0, ease: 'expo.out' }, '-=0.2')
      .to([cta1Ref.current, cta2Ref.current], {
        autoAlpha: 1,
        y: 0,
        duration: 0.9,
        stagger: 0.2,
        ease: 'expo.out',
      }, '-=1.2')
      .to(scrollHintRef.current, { autoAlpha: 1, duration: 1, ease: 'power2.out' }, '-=0.5');

    mm.add(
      {
        isDesktop: '(min-width: 761px)',
        reduceMotion: '(prefers-reduced-motion: reduce)',
      },
      (context) => {
        const { isDesktop } = context.conditions;
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          pin: false,
          pinSpacing: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          fastScrollEnd: true,
          onUpdate: (self) => {
            const p = self.progress;
            const contentEl = sectionRef.current?.querySelector(`.${styles.content}`);
            if (contentEl) {
              gsap.set(contentEl, {
                y: isDesktop ? p * -24 : p * -12,
                opacity: Math.max(0.34, 1 - p * 0.7),
              });
            }
          },
        });
      }
    );
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className={styles.hero} id="hero" data-scroll-section>
      <div ref={overlayRef} className={styles.overlay} aria-hidden="true" />

      <div className={`container ${styles.content}`}>
        <div className={styles.headline}>
          <p ref={line1Ref} className={styles.line1} aria-label="You are being watched." />
          <p ref={line2Ref} className={styles.line2} aria-label="Not by us.">Not by us.</p>
        </div>

        <p ref={subRef} className={styles.sub}>
          We built Lethon because privacy shouldn&apos;t be a feature you have to trust.<br
            className={styles.brDesktop} />
          {' '}
          We built it into the architecture itself.
        </p>

        <div className={styles.ctas}>
          <a ref={cta1Ref} href="#architecture" className={styles.ctaPrimary} data-interactive="true">
            Explore the architecture
          </a>
          <a
            ref={cta2Ref}
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

      {/* Scroll hint */}
      <div ref={scrollHintRef} className={styles.scrollHint} aria-hidden="true">
        <div className={styles.scrollLine} />
        <span>scroll</span>
      </div>
    </section>
  );
}
