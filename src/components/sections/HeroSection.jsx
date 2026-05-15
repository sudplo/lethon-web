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
      stagger: 0.065, // ligeramente más lento — más dramático
      ease: "none",
    }, 1.2); // empieza 1.2s después del inicio de tl

    // Pausa larga para que el usuario lea y sienta la frase
    tl.to({}, { duration: 3.5 });

    // --- FASE 2: Fade out del texto, aparece "Not by us." ---
    tl.to(line1Ref.current, { opacity: 0, duration: 0.8, ease: "power2.inOut" })
      .fromTo(line2Ref.current,
        { opacity: 0, filter: 'blur(20px)', scale: 1.08 },
        { opacity: 1, filter: 'blur(0px)', scale: 1, duration: 2.5, ease: "expo.out" },
        "+=0.4"
      )
      // Canvas sube muy suavemente mientras aparece "Not by us."
      .to(canvasContainer, { opacity: 1, duration: 3, ease: "power2.inOut" }, "-=2")

      // --- FASE 3: El resto del contenido entra lentamente ---
      .to({}, { duration: 1.5 }) // pausa para que respiren
      .to(navEl, { y: 0, opacity: 1, duration: 1.8, ease: "expo.out" }, "-=0.5")
      .to(subheadRef.current, { y: 0, opacity: 1, duration: 1.8, ease: "expo.out" }, "-=1.5")
      .to([cta1Ref.current, cta2Ref.current], {
        y: 0, opacity: 1, duration: 1.5, stagger: 0.3, ease: "expo.out"
      }, "-=1.2");

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