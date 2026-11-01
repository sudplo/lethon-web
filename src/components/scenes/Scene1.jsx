'use client';
import { useRef } from 'react';
import { useLang } from '@/lib/i18n';
import { gsap, useGSAP, FULL_MOTION } from '@/lib/gsap';
import styles from './Scene1.module.css';

function Lock() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

export default function Scene1() {
  const { t } = useLang();
  const root = useRef(null);
  const s = t.s1;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(FULL_MOTION, () => {
        const el = root.current;
        el.classList.add('is-pinned');
        const rows = gsap.utils.toArray('[data-row]', el);
        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: { trigger: el, start: 'top top', end: '+=230%', scrub: 0.6, pin: true },
        });
        tl.fromTo('[data-bubble]', { opacity: 0, y: 70, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, duration: 1, ease: 'power2.out' })
          .fromTo('[data-thread]', { scaleY: 0 }, { scaleY: 1, duration: rows.length * 1.1, transformOrigin: 'top' }, 1.2);
        rows.forEach((row, i) => {
          const at = 1.3 + i * 1.1;
          tl.fromTo(row, { opacity: 0.12, x: 24 }, { opacity: 1, x: 0, duration: 0.7, ease: 'power2.out' }, at)
            .fromTo(row.querySelector('[data-lamp]'), { opacity: 0, scale: 0.4 }, { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(2)' }, at + 0.1);
        });
        const end = 1.3 + rows.length * 1.1;
        tl.to({}, { duration: 1 }, end);
        return () => el.classList.remove('is-pinned');
      });
    },
    { scope: root }
  );

  return (
    <section className={`scene ${styles.scene}`} ref={root} id="lo-que-ven" aria-labelledby="s1-title">
      <div className={`stage ${styles.stage}`}>
        <div className={`wrap ${styles.grid}`}>
          <div className={styles.copy}>
            <h2 id="s1-title" className={styles.title} data-title>
              {s.title}
            </h2>
            <p className={styles.sub} data-sub>
              {s.sub}
            </p>
          </div>
          <div className={styles.panel}>
            <div className={styles.bubbleRow}>
              <div className={styles.bubble} data-bubble>
                <span className={styles.msg}>{s.bubble}</span>
                <span className={styles.enc}>
                  <Lock /> {s.bubbleMeta}
                </span>
              </div>
            </div>
            <div className={styles.rowsWrap}>
            <span className={styles.thread} data-thread aria-hidden="true" />
            <ul className={styles.rows}>
              {s.tags.map((tag) => (
                <li key={tag.k} className={styles.row} data-row>
                  <span className={styles.lamp} data-lamp aria-hidden="true" />
                  <span className={styles.k}>{tag.k}</span>
                  <span className={styles.v}>{tag.v}</span>
                </li>
              ))}
            </ul>
            </div>
            <p className={styles.example}>{s.example}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
