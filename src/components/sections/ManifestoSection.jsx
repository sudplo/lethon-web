'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import styles from './ManifestoSection.module.css';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const PHRASES = [
  { words: ['Privacy', 'is', 'not', 'a', 'feature.'], color: 'var(--text-primary)', cls: styles.phrase0 },
  { words: ['It\'s', 'the', 'foundation.'], color: 'var(--text-primary)', cls: styles.phrase1 },
  { words: ['Privacy', 'by', 'architecture,', 'not', 'by', 'trust.'], color: 'var(--color-accent)', cls: styles.phrase2, glow: true },
];

function buildPhrase(container, words) {
  container.innerHTML = '';
  const spans = [];
  words.forEach((word, i) => {
    const wrap = document.createElement('span');
    wrap.className = styles.wordWrap;
    const inner = document.createElement('span');
    inner.className = styles.wordInner;
    inner.textContent = word + (i < words.length - 1 ? '\u00A0' : '');
    gsap.set(inner, { autoAlpha: 0, y: 28, filter: 'blur(10px)' });
    wrap.appendChild(inner);
    container.appendChild(wrap);
    spans.push(inner);
  });
  return spans;
}

export default function ManifestoSection() {
  const sectionRef = useRef(null);
  const phraseRefs = useRef([]);
  const ctasRef = useRef(null);
  const dividerRef = useRef(null);

  useGSAP(() => {
    const allSpans = phraseRefs.current.map((el, i) =>
      el ? buildPhrase(el, PHRASES[i].words) : []
    );

    gsap.set(ctasRef.current, { autoAlpha: 0, y: 24 });
    gsap.set(dividerRef.current, { scaleX: 0, transformOrigin: 'left' });

    const mm = gsap.matchMedia();

    mm.add(
      {
        isDesktop: '(min-width: 681px)',
        isMobile: '(max-width: 680px)',
        reduceMotion: '(prefers-reduced-motion: reduce)',
      },
      (context) => {
        const { isDesktop, reduceMotion } = context.conditions;

        /* Mobile: simple scroll-triggered reveal, no pin */
        if (!isDesktop) {
          /* Show all words immediately */
          allSpans.forEach(spans => {
            gsap.set(spans, { autoAlpha: 1, y: 0, filter: 'blur(0px)' });
          });

          /* Fade in CTAs on scroll */
          gsap.to(dividerRef.current, {
            scrollTrigger: {
              trigger: ctasRef.current,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
            scaleX: 1,
            duration: 0.8,
            ease: 'expo.out',
          });

          gsap.to(ctasRef.current, {
            scrollTrigger: {
              trigger: ctasRef.current,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
            autoAlpha: 1,
            y: 0,
            duration: 1,
            ease: 'expo.out',
            delay: 0.2,
          });

          return;
        }

        /* Desktop: pinned cinematic reveal */
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: '+=430%',
            pin: !reduceMotion,
            pinSpacing: true,
            scrub: reduceMotion ? false : 1.8,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        let cursor = 0;
        const PAUSE = 1.0;
        const STAGGER = 0.10;
        const DURATION = 0.60;

        PHRASES.forEach((phrase, idx) => {
          const spans = allSpans[idx];
          if (!spans.length) return;

          /* Dim previous phrases */
          if (idx > 0) {
            for (let p = 0; p < idx; p++) {
              tl.to(allSpans[p], {
                autoAlpha: 0.06,
                filter: 'blur(5px)',
                y: -14,
                duration: 0.45,
                ease: 'power2.inOut',
              }, cursor);
            }
          }

          /* Reveal current */
          tl.to(spans, {
            autoAlpha: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: DURATION,
            stagger: STAGGER,
            ease: 'power3.out',
          }, cursor);

          cursor += 0.4 + spans.length * STAGGER + PAUSE;
        });

        tl.to(dividerRef.current, { scaleX: 1, duration: 0.8, ease: 'expo.out' }, cursor)
          .to(ctasRef.current, { autoAlpha: 1, y: 0, duration: 1, ease: 'expo.out' }, cursor + 0.25)
          .to({}, { duration: 1 });
      }
    );
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className={styles.section} id="manifesto" data-scroll-section>
      <div className={`container ${styles.inner}`}>

        <div className={styles.stack}>
          {PHRASES.map((ph, i) => (
            <p
              key={i}
              ref={el => phraseRefs.current[i] = el}
              className={`${styles.phrase} ${ph.cls}`}
              style={{
                color: ph.color,
                ...(ph.glow ? { textShadow: '0 0 72px rgba(0,245,160,0.18)' } : {}),
              }}
              aria-label={ph.words.join(' ')}
            />
          ))}
        </div>

        <div className={styles.ctaBlock} ref={ctasRef}>
          <div ref={dividerRef} className={styles.divider} />
          <div className={styles.ctaGrid}>
            <div className={styles.ctaItem}>
              <span className={styles.ctaItemLabel}>Don&apos;t trust us.</span>
              <a
                href="https://github.com/sudplo/lethon"
                target="_blank" rel="noopener noreferrer"
                className={styles.ctaLink}
                data-interactive="true"
              >
                Read the code.
              </a>
            </div>
            <div className={styles.ctaItem}>
              <span className={styles.ctaItemLabel}>Join the build.</span>
              <a
                href="https://github.com/sudplo/lethon"
                target="_blank" rel="noopener noreferrer"
                className={styles.ctaLink}
                data-interactive="true"
              >
                Star on GitHub.
              </a>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
