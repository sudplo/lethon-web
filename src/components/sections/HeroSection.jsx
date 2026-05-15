'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './HeroSection.module.css';

gsap.registerPlugin(ScrollTrigger);

export default function HeroSection() {
  const containerRef = useRef(null);
  const line1Ref = useRef(null);
  const line2Ref = useRef(null);
  const subheadRef = useRef(null);
  const cta1Ref = useRef(null);
  const cta2Ref = useRef(null);
  const overlayRef = useRef(null);

  useEffect(() => {
    const navEl = document.querySelector('header');
    const canvasContainer = document.querySelector('#canvas-container');

    // Start everything hidden, black
    gsap.set(navEl, { y: -60, opacity: 0 });
    gsap.set(canvasContainer, { opacity: 0 });
    gsap.set(line2Ref.current, { opacity: 0 });
    gsap.set(subheadRef.current, { opacity: 0, y: 40 });
    gsap.set([cta1Ref.current, cta2Ref.current], { opacity: 0, y: 20 });
    gsap.set(overlayRef.current, { opacity: 1 });

    const tl = gsap.timeline({ delay: 0.8 });

    // --- FASE 1: Pantalla negra, sólo aparece la frase principal ---
    // Primero el overlay desaparece muy lentamente
    tl.to(overlayRef.current, { opacity: 0, duration: 2.5, ease: "power2.inOut" }, 0);

    // Typewriter "You are being watched."
    const text = "You are being watched.";
    const chars = text.split('');
    line1Ref.current.innerHTML = '';
    chars.forEach((char) => {
      const span = document.createElement('span');
      span.textContent = char === ' ' ? '\u00A0' : char;
      span.style.opacity = '0';
      line1Ref.current.appendChild(span);
    });
    const spans = line1Ref.current.querySelectorAll('span');

    tl.to(spans, {
      opacity: 1,
      duration: 0.001,
      stagger: 0.055,
      ease: "none",
    }, 1.2);

    // Pausa narrativa — tiempo para absorber
    tl.to({}, { duration: 2.6 });

    // --- FASE 2: Fade out del texto, aparece "Not by us." ---
    tl.to(line1Ref.current, { opacity: 0, duration: 0.6, ease: "power2.inOut" })
      .fromTo(line2Ref.current,
        { opacity: 0, filter: 'blur(18px)', scale: 1.06 },
        { opacity: 1, filter: 'blur(0px)', scale: 1, duration: 2.2, ease: "power3.out" },
        "+=0.3"
      )
      // Canvas fade sincronizado con "Not by us."
      .to(canvasContainer, { opacity: 1, duration: 2.8, ease: "power2.inOut" }, "-=1.8")

      // --- FASE 3: Entrada progresiva de contenido ---
      .to({}, { duration: 1.2 })
      .to(navEl, { y: 0, opacity: 1, duration: 1.6, ease: "power3.out" }, "-=0.4")
      .to(subheadRef.current, { y: 0, opacity: 1, duration: 1.6, ease: "power3.out" }, "-=1.3")
      .to([cta1Ref.current, cta2Ref.current], {
        y: 0, opacity: 1, duration: 1.4, stagger: 0.25, ease: "power3.out"
      }, "-=1");

    // Pin hero — más largo para que el usuario absorba
    ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      end: "+=200%",
      pin: true,
      pinSpacing: true
    });

    return () => { tl.kill(); };
  }, []);

  return (
    <section ref={containerRef} className={styles.heroSection}>
      {/* Overlay negro inicial */}
      <div ref={overlayRef} className={styles.blackOverlay} />

      <div className="container">
        <div className={styles.content}>
          <div className={styles.mainHeadline}>
            <div ref={line1Ref} className={styles.line1}></div>
            <div ref={line2Ref} className={styles.line2}>Not by us.</div>
          </div>

          <div ref={subheadRef} className={styles.subheadline}>
            <p>We built Lethon because privacy shouldn't be a feature you have to trust.</p>
            <p>We built it into the architecture itself.</p>
          </div>

          <div className={styles.ctas}>
            <a
              ref={cta1Ref}
              href="#architecture"
              className={styles.primaryCta}
              data-interactive="true"
            >
              Explore the architecture
            </a>
            <a
              ref={cta2Ref}
              href="https://github.com/sudplo/lethon"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.secondaryCta}
              data-interactive="true"
            >
              Star on GitHub
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}