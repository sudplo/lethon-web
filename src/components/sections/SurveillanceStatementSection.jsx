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
          // Mobile: simple stagger reveal for all words when they scroll into view
          gsap.fromTo(q('.js-word'),
            { opacity: 0.15, filter: 'blur(4px)', y: 10 },
            {
              opacity: 1,
              filter: 'blur(0px)',
              y: 0,
              stagger: 0.03,
              duration: 0.9,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: sectionRef.current,
                start: 'top 80%',
                toggleActions: 'play none none none',
              }
            }
          );
          return;
        }

        // Desktop: High-impact sequence but softened
        gsap.set(q('.js-word'), { opacity: 0.15, filter: 'blur(5px)', y: 10 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: '+=300%',
            pin: true,
            scrub: 1,
            anticipatePin: 1,
          },
        });

        // 1. Entrance transition
        tl.fromTo(containerRef.current,
          { opacity: 0, y: 40, filter: 'blur(10px)' },
          { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.0, ease: 'power2.out' },
          0
        );

        lineWords.forEach((words, idx) => {
          const startTime = 1.0 + (idx * 2.4);
          const label = `line-${idx}`;
          tl.addLabel(label, startTime);

          // 1. Reveal Group
          tl.to(words, {
            opacity: 1,
            filter: 'blur(0px)',
            y: 0,
            stagger: 0.03,
            duration: 0.8,
            ease: 'power2.out'
          }, label);

          // 2. Persistence
          tl.to({}, { duration: 0.8 }, `${label}+=0.8`);

          // 3. Exit if not last
          if (idx < lineWords.length - 1) {
            tl.to(words, {
              opacity: 0.25,
              filter: 'blur(3.5px)',
              y: -10,
              stagger: 0.02,
              duration: 0.7,
              ease: 'power2.inOut'
            }, `${label}+=1.6`);
          }
        });

        // 2. Exit transition
        tl.to(containerRef.current, {
          opacity: 0,
          y: -40,
          filter: 'blur(10px)',
          duration: 1.2,
          ease: 'power2.in'
        }, 1.0 + (lineWords.length * 2.4) - 0.4);
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
