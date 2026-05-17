'use client';

import { useRef, useMemo } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import styles from './SurveillanceStatementSection.module.css';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const LINES = [
  { text: 'Metadata is where surveillance lives.', color: null, className: styles.line1 },
  { text: 'Lethon makes it invisible.', color: 'var(--color-accent)', className: styles.line2 },
  { text: 'Not by encryption.', color: 'rgba(240,244,248,0.5)', className: styles.line3 },
  { text: 'By architecture.', color: null, className: styles.line4 },
];

function Word({ word, color, index }) {
  return (
    <span className={styles.wordWrap}>
      <span 
        className={`${styles.wordInner} js-word`} 
        style={{ color: color }}
      >
        {word}{'\u00A0'}
      </span>
    </span>
  );
}

export default function SurveillanceStatementSection() {
  const sectionRef = useRef(null);
  const containerRef = useRef(null);

  useGSAP(() => {
    const q = gsap.utils.selector(sectionRef);
    const mm = gsap.matchMedia();

    // Group words by their line index
    const lineWords = LINES.map((_, i) => q(`.js-line-${i} .js-word`));

    mm.add(
      {
        isDesktop: '(min-width: 761px)',
        isMobile: '(max-width: 760px)',
      },
      (context) => {
        const { isDesktop } = context.conditions;

        if (!isDesktop) {
          gsap.set(q('.js-word'), { opacity: 1, filter: 'blur(0px)', y: 0 });
          return;
        }

        // Desktop: High-impact sequence
        gsap.set(q('.js-word'), { opacity: 0.1, filter: 'blur(12px)', y: 20 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: '+=300%',
            scrub: 1,
            pin: true,
            anticipatePin: 1,
          },
        });

        lineWords.forEach((words, idx) => {
          const label = `line-${idx}`;
          tl.addLabel(label);

          // 1. Reveal Group
          tl.to(words, {
            opacity: 1,
            filter: 'blur(0px)',
            y: 0,
            stagger: 0.04,
            duration: 0.8,
            ease: 'power3.out'
          }, label);

          // 2. Persistence
          tl.to({}, { duration: 0.8 }, `${label}+=0.8`);

          // 3. Exit if not last
          if (idx < lineWords.length - 1) {
            tl.to(words, {
              opacity: 0.05,
              filter: 'blur(15px)',
              y: -25,
              stagger: 0.02,
              duration: 0.6,
              ease: 'power2.in'
            }, `${label}+=1.6`);
          }
        });
      }
    );
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className={styles.section} id="surveillance" data-scroll-section>
      <div className={`container ${styles.inner}`} ref={containerRef}>
        {LINES.slice(0, 2).map((line, i) => (
          <p key={i} className={`${line.className} js-line-${i}`}>
            {line.text.split(' ').map((word, j) => (
              <Word key={j} word={word} color={line.color} />
            ))}
          </p>
        ))}
        <div className={styles.smallGroup}>
          {LINES.slice(2).map((line, i) => (
            <p key={i + 2} className={`${line.className} js-line-${i + 2}`}>
              {line.text.split(' ').map((word, j) => (
                <Word key={j} word={word} color={line.color} />
              ))}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
