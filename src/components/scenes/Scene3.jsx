'use client';
import { useRef } from 'react';
import { useLang } from '@/lib/i18n';
import { gsap, useGSAP, FULL_MOTION } from '@/lib/gsap';
import styles from './Scene3.module.css';

export default function Scene3() {
  const { t } = useLang();
  const root = useRef(null);
  const s = t.s3;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(FULL_MOTION, () => {
        const el = root.current;
        const html = document.documentElement;
        el.classList.add('is-pinned');
        const bars = gsap.utils.toArray('[data-bar]', el);
        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: { trigger: el, start: 'top top', end: '+=140%', scrub: 0.5, pin: true },
        });
        const flick = { v: 1 };
        // La luz parpadea (varias veces, cada vez más corta) y se va a negro.
        const steps = [0.2, 1, 0.1, 0.8, 0.0, 0.6, 0.0, 0.3, 0.0];
        steps.forEach((v, i) => {
          tl.to(flick, { v, duration: 0.12, onUpdate: () => html.style.setProperty('--thread-o', String(flick.v)) }, 0.2 + i * 0.22);
          tl.to('[data-lights]', { opacity: v, duration: 0.12 }, 0.2 + i * 0.22);
        });
        tl.fromTo('[data-black]', { opacity: 0 }, { opacity: 1, duration: 0.3 }, 2.2)
          .fromTo(bars, { opacity: 1 }, { opacity: 0.18, duration: 0.3, stagger: 0.12 }, 2.3)
          .fromTo('[data-chip]', { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, 2.8)
          .fromTo('[data-title]', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, 2.9)
          .to({}, { duration: 0.8 }, 3.7);
        return () => {
          el.classList.remove('is-pinned');
          html.style.removeProperty('--thread-o');
        };
      });
    },
    { scope: root }
  );

  return (
    <section className={`scene ${styles.scene}`} ref={root} id="el-corte" aria-labelledby="s3-title">
      <div className={`stage ${styles.stage}`}>
        <div className={styles.lights} data-lights aria-hidden="true" />
        <div className={styles.black} data-black aria-hidden="true" />
        <div className={`wrap ${styles.copy}`}>
          <div className={styles.signal} role="img" aria-label={s.signalLabel}>
            <svg viewBox="0 0 80 64" width="96" height="77" aria-hidden="true">
              {[0, 1, 2, 3].map((i) => (
                <rect key={i} data-bar x={4 + i * 19} y={52 - i * 14 - 8} width="11" height={8 + i * 14} rx="3" fill="var(--text)" opacity="0.18" />
              ))}
              <path d="M6 6 L22 22 M22 6 L6 22" stroke="var(--crit)" strokeWidth="3.5" strokeLinecap="round" />
            </svg>
            <span className={styles.chip} data-chip>{s.signalLabel}</span>
          </div>
          <h2 id="s3-title" className={styles.title} data-title>
            {s.title}
          </h2>
          <p className={styles.sub}>{s.sub}</p>
        </div>
      </div>
    </section>
  );
}
