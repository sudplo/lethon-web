'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './SurveillanceStatementSection.module.css';

gsap.registerPlugin(ScrollTrigger);

export default function SurveillanceStatementSection() {
  const containerRef = useRef(null);
  const block1Ref = useRef(null);
  const block2Ref = useRef(null);
  const block3Ref = useRef(null);
  const block4Ref = useRef(null);

  useEffect(() => {
    const buildWords = (container, text, color) => {
      container.innerHTML = '';
      const words = text.split(' ');
      const spans = [];
      words.forEach((word, i) => {
        const wrap = document.createElement('span');
        wrap.className = styles.wordWrap;
        const inner = document.createElement('span');
        inner.className = styles.wordInner;
        if (color) inner.style.color = color;
        inner.textContent = word + (i < words.length - 1 ? '\u00A0' : '');
        gsap.set(inner, { opacity: 0, y: 36, filter: 'blur(14px)' });
        wrap.appendChild(inner);
        container.appendChild(wrap);
        spans.push(inner);
      });
      return spans;
    };

    const w1 = buildWords(block1Ref.current, 'Metadata is where surveillance lives.', null);
    const w2 = buildWords(block2Ref.current, 'Lethon makes it invisible.', 'var(--color-accent)');
    const w3 = buildWords(block3Ref.current, 'Not by encryption.', 'rgba(255,255,255,0.6)');
    const w4 = buildWords(block4Ref.current, 'By architecture.', null);

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: '+=500%',
        pin: true,
        scrub: 2.2,
      }
    });

    tl
      // Línea 1 sola
      .to(w1, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.55, stagger: 0.13, ease: 'expo.out' }, 0)
      .to({}, { duration: 0.9 })

      // Línea 1 se va, entra línea 2
      .to(w1, { opacity: 0.22, filter: 'blur(3px)', y: -12, duration: 0.4, ease: 'power2.inOut' })
      .to(w2, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.55, stagger: 0.14, ease: 'expo.out' }, '-=0.25')
      .to({}, { duration: 0.8 })

      // Todo se desvanece, entran las dos pequeñas
      .to([...w1, ...w2], { opacity: 0.1, filter: 'blur(5px)', duration: 0.5, ease: 'power2.inOut' })
      .to(w3, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.4, stagger: 0.1, ease: 'expo.out' }, '-=0.3')
      .to(w4, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.5, stagger: 0.12, ease: 'expo.out' }, '-=0.05')
      .to({}, { duration: 0.8 });

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <section ref={containerRef} className={styles.section}>
      <div className={`container ${styles.inner}`}>
        <p ref={block1Ref} className={styles.line1} />
        <p ref={block2Ref} className={styles.line2} />
        <div className={styles.smallGroup}>
          <p ref={block3Ref} className={styles.line3} />
          <p ref={block4Ref} className={styles.line4} />
        </div>
      </div>
    </section>
  );
}