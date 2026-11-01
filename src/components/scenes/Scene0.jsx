'use client';
import { useRef } from 'react';
import { useLang } from '@/lib/i18n';
import { gsap, useGSAP, FULL_MOTION } from '@/lib/gsap';
import styles from './Scene0.module.css';

export default function Scene0() {
  const { t } = useLang();
  const root = useRef(null);
  const words = t.s0.title.split(' ');

  useGSAP(
    () => {
      const html = document.documentElement;
      const mm = gsap.matchMedia();
      mm.add(FULL_MOTION, () => {
        root.current.classList.add('is-pinned');
        gsap.to('[data-w]', { opacity: 1, y: 0, duration: 1.1, ease: 'power3.out', stagger: 0.07, delay: 0.5 });
        gsap.to('[data-cue]', { opacity: 1, duration: 1.2, delay: 2.2 });
        const tl = gsap.timeline({
          scrollTrigger: { trigger: root.current, start: 'top top', end: '+=65%', scrub: true, pin: true },
        });
        tl.to('[data-cue]', { opacity: 0, duration: 0.2 }, 0)
          .to('[data-title]', { opacity: 0, y: -50, duration: 0.5, ease: 'none' }, 0.5);
        return () => root.current && root.current.classList.remove('is-pinned');
      });
      if (!window.matchMedia(FULL_MOTION).matches) html.classList.remove('motion');
    },
    { scope: root }
  );

  return (
    <section className={`scene ${styles.scene}`} ref={root} id="top" aria-labelledby="s0-title">
      <div className={`stage ${styles.stage}`}>
        <div className={styles.glow} aria-hidden="true" />
        <div className={styles.dotWrap}>
          <span className={styles.dot} role="img" aria-label={t.s0.dotLabel} />
        </div>
        <div className={`wrap ${styles.copy}`}>
          <h1 id="s0-title" className={styles.title} data-title>
            {words.map((w, i) => (
              <span key={i} className={styles.w} data-w>
                {w}{' '}
              </span>
            ))}
          </h1>
        </div>
        <div className={styles.cue} data-cue aria-label={t.s0.cueLabel}>
          <span>{t.s0.cue}</span>
          <i aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
