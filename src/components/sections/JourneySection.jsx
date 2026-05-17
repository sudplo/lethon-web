'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './JourneySection.module.css';

gsap.registerPlugin(ScrollTrigger);

const NODES = [
  { title: '01 · You type', desc: 'Plaintext. Still human.' },
  { title: '02 · Bramble encrypts', desc: 'ChaCha20-Poly1305.\nThe key will never exist again.' },
  { title: '03 · Topic is born', desc: 'A unique address. For this message only.\nNo two messages share a topic.' },
  { title: '04 · Tor tunnels', desc: 'Your IP address disappears here.\nMetadata about WHERE you are: hidden.' },
  { title: '05 · Mesh carries', desc: 'Strangers forward what they don\'t understand.\nNo node sees the full path.' },
  { title: '06 · Sentinel wakes', desc: 'Checks 256 topics. One match.\nThe receiver\'s device recognizes its message.' },
  { title: '07 · Arrives. Decrypts.', desc: 'Topic dies. Keys rotate. Nothing remains.\nThis conversation is mathematically impossible to recover.' },
];

export default function JourneySection() {
  const sectionRef = useRef(null);
  const dotRef = useRef(null);
  const stopRefs = useRef([]);
  const labelRefs = useRef([]);
  const tlRef = useRef(null);
  const [activeIdx, setActiveIdx] = useState(-1);
  const activeIdxRef = useRef(-1);

  useEffect(() => {
    /* Set initial states */
    labelRefs.current.forEach(el => el && gsap.set(el, { autoAlpha: 0, x: -16, filter: 'blur(6px)' }));

    if (window.matchMedia('(max-width: 820px)').matches) {
      labelRefs.current.forEach(el => el && gsap.set(el, { autoAlpha: 1, x: 0, filter: 'blur(0px)' }));
      return undefined;
    }

    const mm = gsap.matchMedia();

    mm.add(
      {
        isDesktop: '(min-width: 821px)',
        reduceMotion: '(prefers-reduced-motion: reduce)',
      },
      (context) => {
        const { isDesktop, reduceMotion } = context.conditions;
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: isDesktop ? 'top 48%' : 'top 78%',
            end: 'bottom 30%',
            pin: false,
            pinSpacing: true,
            scrub: reduceMotion ? false : 0.8,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const raw = self.progress * (NODES.length - 1);
              const idx = Math.min(NODES.length - 1, Math.floor(raw));
              if (idx !== activeIdxRef.current) {
                activeIdxRef.current = idx;
                setActiveIdx(idx);
              }
            },
          },
        });
        tlRef.current = tl;

        const nodeStep = 1 / (NODES.length - 1);

        if (!reduceMotion) {
      tl.to(dotRef.current, { top: 'calc(100% - 0.8rem)', duration: 1, ease: 'none' }, 0);
      NODES.forEach((_, i) => {
        const t = i * nodeStep;

        /* Light up stop dot */
        tl.to(stopRefs.current[i]?.querySelector(`.${styles.stopDot}`), {
          backgroundColor: 'var(--color-accent)',
          borderColor: 'var(--color-accent)',
          boxShadow: '0 0 12px rgba(0,245,160,0.65)',
          duration: 0.05,
          ease: 'power2.out',
        }, t);

        /* Reveal label */
        tl.to(labelRefs.current[i], {
          autoAlpha: 1,
          x: 0,
          filter: 'blur(0px)',
          duration: 0.12,
          ease: 'power3.out',
        }, t);

        /* Dim previous */
        if (i > 0) {
          tl.to(labelRefs.current[i - 1], {
            autoAlpha: 0.2,
            filter: 'blur(3px)',
            duration: 0.1,
            ease: 'power2.inOut',
          }, t + 0.05);
        }
      });
        }

        return () => tl.kill();
      }
    );

    return () => {
      mm.revert();
    };
  }, []);

  return (
    <section ref={sectionRef} className={styles.section} id="journey" data-scroll-section>
      <div className={`container ${styles.inner}`}>
        <h2 className={styles.headline}>
          Press send.<br />
          Nothing survives the trip.
        </h2>

        <div className={styles.trackCol}>
          <div className={styles.track}>
            <div ref={dotRef} className={styles.dot} aria-hidden="true" />

            {NODES.map((node, i) => (
              <div
                key={i}
                ref={el => stopRefs.current[i] = el}
                className={`${styles.stop} ${activeIdx === i ? styles.stopActive : ''} ${activeIdx > i ? styles.stopPassed : ''}`}
              >
                <div className={styles.stopDot} aria-hidden="true" />
                <div ref={el => labelRefs.current[i] = el} className={styles.stopLabel}>
                  <h4 className={styles.stopTitle}>{node.title}</h4>
                  <pre className={styles.stopDesc}>{node.desc}</pre>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
