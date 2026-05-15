'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './ManifestoSection.module.css';

gsap.registerPlugin(ScrollTrigger);

const PHRASES = [
  {
    words: ["Privacy", "is", "not", "a", "feature."],
    color: "var(--text-primary)",
    size: "large"
  },
  {
    words: ["It's", "the", "foundation."],
    color: "var(--text-primary)",
    size: "large"
  },
  {
    words: ["Privacy", "by", "architecture,", "not", "by", "trust."],
    color: "var(--color-accent)",
    size: "medium",
    glow: true
  }
];

export default function ManifestoSection() {
  const containerRef = useRef(null);
  const phraseRefs = useRef([]);
  const ctasRef = useRef(null);
  const lineRef = useRef(null);

  useEffect(() => {
    phraseRefs.current.forEach((phraseEl, phraseIdx) => {
      if (!phraseEl) return;
      phraseEl.innerHTML = '';
      const phrase = PHRASES[phraseIdx];

      phrase.words.forEach((word, wordIdx) => {
        const wrap = document.createElement('span');
        wrap.className = styles.wordWrap;
        const span = document.createElement('span');
        span.className = styles.wordInner;
        span.textContent = word + (wordIdx < phrase.words.length - 1 ? '\u00A0' : '');
        wrap.appendChild(span);
        phraseEl.appendChild(wrap);
      });

      const spans = phraseEl.querySelectorAll(`.${styles.wordInner}`);
      gsap.set(spans, { opacity: 0, y: 30, filter: 'blur(9px)' });
    });

    gsap.set(ctasRef.current, { opacity: 0, y: 32 });
    gsap.set(lineRef.current, { scaleX: 0, transformOrigin: 'left' });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "+=410%",
        pin: true,
        scrub: 1.7,
      }
    });

    let cursor = 0;
    const PAUSE = 1.2;
    const PHRASE_DURATION = 0.5;
    const WORD_STAGGER = 0.11;
    const WORD_DURATION = 0.65;

    PHRASES.forEach((phrase, phraseIdx) => {
      const phraseEl = phraseRefs.current[phraseIdx];
      if (!phraseEl) return;
      const spans = phraseEl.querySelectorAll(`.${styles.wordInner}`);

      if (phraseIdx > 0) {
        for (let prev = 0; prev < phraseIdx; prev++) {
          const prevEl = phraseRefs.current[prev];
          if (!prevEl) continue;
          const prevSpans = prevEl.querySelectorAll(`.${styles.wordInner}`);
          tl.to(prevSpans, {
            opacity: 0.08,
            filter: 'blur(5px)',
            y: -18,
            duration: PHRASE_DURATION,
            ease: "power2.inOut"
          }, cursor);
        }
      }

      tl.to(spans, {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        duration: WORD_DURATION,
        stagger: WORD_STAGGER,
        ease: "power3.out"
      }, cursor);

      cursor += PHRASE_DURATION + spans.length * WORD_STAGGER + PAUSE;
    });

    tl.to(lineRef.current, { scaleX: 1, duration: 0.8, ease: "expo.out" }, cursor)
      .to(ctasRef.current, { opacity: 1, y: 0, duration: 1, ease: "expo.out" }, cursor + 0.3)
      .to({}, { duration: 1 });

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <section ref={containerRef} className={styles.manifestoSection} id="manifesto">
      <div className={`container ${styles.inner}`}>

        <div className={styles.phrasesStack}>
          {PHRASES.map((phrase, i) => (
            <div
              key={i}
              ref={el => phraseRefs.current[i] = el}
              className={`${styles.phrase} ${styles[`phrase${i}`]}`}
              style={{
                color: phrase.color,
                ...(phrase.glow ? { textShadow: '0 0 60px rgba(0,245,160,0.2)' } : {})
              }}
            />
          ))}
        </div>

        <div className={styles.ctaBlock} ref={ctasRef}>
          <div ref={lineRef} className={styles.dividerLine} />
          <div className={styles.ctaGrid}>
            <div className={styles.ctaItem}>
              <span className={styles.ctaLabel}>Don't trust us.</span>
              <a href="https://github.com/sudplo/lethon" target="_blank" rel="noopener noreferrer" className={styles.ctaLink} data-interactive="true">
                Read the code.
              </a>
            </div>
            <div className={styles.ctaItem}>
              <span className={styles.ctaLabel}>Join the build.</span>
              <a href="https://github.com/sudplo/lethon" target="_blank" rel="noopener noreferrer" className={styles.ctaLink} data-interactive="true">
                Star on GitHub.
              </a>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}