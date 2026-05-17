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
  { words: ['Privacy', 'by', 'architecture,', 'not', 'by', 'trust.'], color: 'var(--color-teal)', cls: styles.phrase2, glow: true },
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
    gsap.set(inner, { autoAlpha: 0, y: 50, rotateX: -60, filter: 'blur(10px)' });
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
    const q = gsap.utils.selector(sectionRef);
    const allSpans = phraseRefs.current.map((el, i) =>
      el ? buildPhrase(el, PHRASES[i].words) : []
    );

    gsap.set(ctasRef.current, { autoAlpha: 0, y: 30 });
    gsap.set(dividerRef.current, { scaleX: 0, transformOrigin: 'center' });

    const mm = gsap.matchMedia();

    mm.add(
      {
        isDesktop: '(min-width: 901px)',
        isMobile: '(max-width: 900px)',
        reduceMotion: '(prefers-reduced-motion: reduce)',
      },
      (context) => {
        const { isDesktop, reduceMotion } = context.conditions;

        if (!isDesktop) {
          allSpans.forEach(spans => {
            gsap.set(spans, { autoAlpha: 1, y: 0, rotateX: 0, filter: 'blur(0px)' });
          });
          gsap.to([dividerRef.current, ctasRef.current], {
            autoAlpha: 1,
            scaleX: 1,
            y: 0,
            duration: 1,
            stagger: 0.2,
            scrollTrigger: {
              trigger: ctasRef.current,
              start: 'top 90%',
            }
          });
          return;
        }

        // ── CINEMATIC TIMELINE ──
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: '+=400%',
            pin: true,
            scrub: 1.5,
          },
        });

        PHRASES.forEach((phrase, idx) => {
          const spans = allSpans[idx];
          const startTime = idx * 3;

          tl.addLabel(`phrase-${idx}`, startTime);

          // Reveal current
          tl.to(spans, {
            autoAlpha: 1,
            y: 0,
            rotateX: 0,
            filter: 'blur(0px)',
            duration: 1.5,
            stagger: 0.12,
            ease: 'expo.out',
          }, `phrase-${idx}`);

          // Pulse glow if needed
          if (phrase.glow) {
            tl.to(phraseRefs.current[idx], {
              textShadow: '0 0 50px rgba(0, 245, 160, 0.4)',
              duration: 1,
              repeat: 1,
              yoyo: true
            }, `phrase-${idx}+=1`);
          }

          // Dim and push back previous
          if (idx < PHRASES.length - 1) {
            tl.to(spans, {
              autoAlpha: 0.1,
              y: -30,
              z: -100,
              filter: 'blur(5px)',
              duration: 1.2,
              ease: 'power2.inOut'
            }, `phrase-${idx}+=2.5`);
          }
        });

        // Final Resolution
        tl.to(dividerRef.current, { scaleX: 1, duration: 1, ease: 'expo.inOut' }, '+=0.5')
          .to(ctasRef.current, { autoAlpha: 1, y: 0, duration: 1.2, ease: 'back.out(1.7)' }, '-=0.4');
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
              style={{ color: ph.color }}
              aria-label={ph.words.join(' ')}
            />
          ))}
        </div>

        <div className={styles.ctaBlock} ref={ctasRef}>
          <div ref={dividerRef} className={styles.divider} />
          <div className={styles.ctaGrid}>
            <div className={styles.ctaItem}>
              <span className={styles.ctaItemLabel}>Don&apos;t trust us.</span>
              <a href="https://github.com/sudplo/lethon" target="_blank" rel="noopener noreferrer" className={styles.ctaLink}>
                Read the code.
              </a>
            </div>
            <div className={styles.ctaItem}>
              <span className={styles.ctaItemLabel}>Join the build.</span>
              <a href="https://github.com/sudplo/lethon" target="_blank" rel="noopener noreferrer" className={styles.ctaLink}>
                Star on GitHub.
              </a>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
