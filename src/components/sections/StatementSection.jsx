'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './StatementSection.module.css';

gsap.registerPlugin(ScrollTrigger);

export default function StatementSection() {
  const containerRef = useRef(null);
  const line1Ref = useRef(null);
  const line2Ref = useRef(null);
  const subRef = useRef(null);

  useEffect(() => {
    // ---- Línea 1: "The network carries" ----
    // ---- Línea 2: "what it doesn't understand." ---- (aparece después, más dramático)

    // Build words for line 1
    const words1 = ["The", "network", "carries"];
    const words2 = ["what", "it", "doesn't", "understand."];

    const buildLine = (container, words) => {
      container.innerHTML = '';
      const els = [];
      words.forEach((word, i) => {
        const wrap = document.createElement('span');
        wrap.className = styles.wordContainer;
        const span = document.createElement('span');
        span.className = styles.word;
        span.textContent = word + (i < words.length - 1 ? '\u00A0' : '');
        gsap.set(span, { opacity: 0, y: 30, filter: 'blur(12px)' });
        wrap.appendChild(span);
        container.appendChild(wrap);
        els.push(span);
      });
      return els;
    };

    const els1 = buildLine(line1Ref.current, words1);
    const els2 = buildLine(line2Ref.current, words2);
    gsap.set(subRef.current, { opacity: 0, y: 20 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "center center",
        end: "+=360%",
        pin: true,
        scrub: 1.5,
      }
    });

    // --- FASE 1: Primera línea cae desde arriba ---
    tl.to(els1, {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      duration: 0.65,
      stagger: 0.18,
      ease: "power3.out"
    }, 0)

      // Pausa narrativa — el usuario lee la primera línea
      .to({}, { duration: 1.2 })

      // --- FASE 2: Segunda línea completa el pensamiento ---
      .to(els2, {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        duration: 0.6,
        stagger: 0.15,
        ease: "power3.out"
      })

      // Pausa para absorber la frase completa
      .to({}, { duration: 1.4 })

      // --- FASE 3: Transición suave hacia subtext ---
      .to([...els1, ...els2], {
        opacity: 0.25,
        filter: 'blur(4px)',
        duration: 0.7,
        ease: "power2.inOut"
      })
      .to(subRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out"
      }, "-=0.4")

      // Cierre
      .to({}, { duration: 1 });

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <section ref={containerRef} className={styles.statementSection} id="statement">
      <div className="container">
        <div className={styles.textBlock}>
          <h2 ref={line1Ref} className={styles.statementLine1}></h2>
          <h2 ref={line2Ref} className={styles.statementLine2}></h2>
          <p ref={subRef} className={styles.subStatement}>
            Privacy by architecture, not by trust.
          </p>
        </div>
      </div>
    </section>
  );
}