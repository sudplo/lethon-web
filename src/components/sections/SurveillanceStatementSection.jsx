'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './SurveillanceStatementSection.module.css';

gsap.registerPlugin(ScrollTrigger);

function buildWords(container, text, color) {
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
    gsap.set(inner, { autoAlpha: 0, y: 34, filter: 'blur(14px)' });
    wrap.appendChild(inner);
    container.appendChild(wrap);
    spans.push(inner);
  });
  return spans;
}

export default function SurveillanceStatementSection() {
  const sectionRef = useRef(null);
  const b1 = useRef(null), b2 = useRef(null), b3 = useRef(null), b4 = useRef(null);
  const tlRef = useRef(null);

  useEffect(() => {
    const w1 = buildWords(b1.current, 'Metadata is where surveillance lives.', null);
    const w2 = buildWords(b2.current, 'Lethon makes it invisible.', 'var(--color-accent)');
    const w3 = buildWords(b3.current, 'Not by encryption.', 'rgba(240,244,248,0.55)');
    const w4 = buildWords(b4.current, 'By architecture.', null);

    if (window.matchMedia('(max-width: 760px)').matches) {
      gsap.set([...w1, ...w2, ...w3, ...w4], { autoAlpha: 1, y: 0, filter: 'blur(0px)' });
      return undefined;
    }

    const mm = gsap.matchMedia();

    mm.add(
      {
        isDesktop: '(min-width: 761px)',
        reduceMotion: '(prefers-reduced-motion: reduce)',
      },
      (context) => {
        const { isDesktop, reduceMotion } = context.conditions;
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: isDesktop ? 'top 55%' : 'top 78%',
            end: isDesktop ? 'bottom 30%' : 'bottom 25%',
            pin: false,
            scrub: reduceMotion ? false : 0.7,
            toggleActions: 'play none none reverse',
            invalidateOnRefresh: true,
          },
        });
        tlRef.current = tl;

        tl
      .to(w1, { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.55, stagger: 0.12, ease: 'expo.out' }, 0)
      .to({}, { duration: 0.25 })

      .to(w1, { autoAlpha: 0.18, filter: 'blur(3px)', y: -10, duration: 0.38, ease: 'power2.inOut' })
      .to(w2, { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.55, stagger: 0.13, ease: 'expo.out' }, '-=0.2')
      .to({}, { duration: 0.25 })

      .to([...w1, ...w2], { autoAlpha: 0.06, filter: 'blur(5px)', duration: 0.45, ease: 'power2.inOut' })
      .to(w3, { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.4, stagger: 0.10, ease: 'expo.out' }, '-=0.25')
      .to(w4, { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.5, stagger: 0.11, ease: 'expo.out' }, '-=0.05')
          .to({}, { duration: 0.75 });

        return () => tl.kill();
      }
    );

    return () => {
      mm.revert();
    };
  }, []);

  return (
    <section ref={sectionRef} className={styles.section} data-scroll-section>
      <div className={`container ${styles.inner}`}>
        <p ref={b1} className={styles.line1} />
        <p ref={b2} className={styles.line2} />
        <div className={styles.smallGroup}>
          <p ref={b3} className={styles.line3} />
          <p ref={b4} className={styles.line4} />
        </div>
      </div>
    </section>
  );
}
