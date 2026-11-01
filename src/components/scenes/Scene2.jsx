'use client';
import { useRef } from 'react';
import { useLang } from '@/lib/i18n';
import { gsap, useGSAP, FULL_MOTION } from '@/lib/gsap';
import styles from './Scene2.module.css';

const CROWD = 28;

export default function Scene2() {
  const { t } = useLang();
  const root = useRef(null);
  const s = t.s2;
  const tags = t.s1.tags;
  const msg = t.s1.bubble;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(FULL_MOTION, () => {
        const el = root.current;
        el.classList.add('is-pinned');
        const rows = gsap.utils.toArray('[data-row]', el);
        const crowd = gsap.utils.toArray('[data-crowd]:not([data-me])', el);
        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: { trigger: el, start: 'top top', end: '+=280%', scrub: 0.6, pin: true },
        });
        // estado inicial: todo encendido, como al acabar la escena 1
        tl.set('[data-me]', { opacity: 1 }, 0)
          .set('[data-sub]', { opacity: 1 }, 0)
          .set('[data-title]', { opacity: 0 }, 0);
        gsap.set(crowd, { opacity: 0, scale: 0.85 });
        gsap.set('[data-me]', { opacity: 1 });
        rows.forEach((row, i) => {
          const at = 0.4 + i * 1.1;
          const v = row.querySelector('[data-v]');
          const line = row.querySelector('[data-line]');
          const on = row.querySelector('[data-on]');
          const off = row.querySelector('[data-off]');
          tl.fromTo(v, { opacity: 1 }, { opacity: 0, duration: 0.4 }, at)
            .fromTo(on, { opacity: 1 }, { opacity: 0, duration: 0.3 }, at)
            .fromTo(off, { opacity: 0, scale: 0.4 }, { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(2)' }, at + 0.25)
            .fromTo(line, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, at + 0.2);
        });
        const endA = 0.4 + rows.length * 1.1 + 0.5;
        tl.to('[data-sub]', { opacity: 0, duration: 0.5 }, endA)
          .to(rows, { opacity: 0, y: -14, duration: 0.7, stagger: 0.06 }, endA)
          .to(crowd, { opacity: 1, scale: 1, duration: 0.8, stagger: { each: 0.05, from: 'center' }, ease: 'power2.out' }, endA + 0.3)
          .to(['[data-mebg]', '[data-metext]'], { opacity: 0, duration: 1.1 }, endA + 1.6)
          .fromTo('[data-me] [class*=bar]', { opacity: 0 }, { opacity: 1, duration: 1.1 }, endA + 1.6)
          .fromTo('[data-title]', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.9, ease: 'power2.out' }, endA + 1.2)
          .to({}, { duration: 1 }, endA + 2.4);
        return () => el.classList.remove('is-pinned');
      });
    },
    { scope: root }
  );

  return (
    <section className={`scene ${styles.scene}`} ref={root} id="apagar-luces" aria-labelledby="s2-title">
      <div className={`stage ${styles.stage}`}>
        <div className={`wrap ${styles.content}`}>
          <h2 id="s2-title" className={styles.title} data-title>
            {s.title}
          </h2>
          <p className={styles.sub} data-sub>
            {s.sub}
          </p>
          <ul className={styles.rows}>
            {tags.map((tag, i) => (
              <li key={tag.k} className={styles.row} data-row>
                <span className={styles.lamp} aria-hidden="true">
                  <i className={styles.lampOn} data-on />
                  <i className={styles.lampOff} data-off />
                </span>
                <span className={styles.k}>{tag.k}</span>
                <span className={styles.cell}>
                  <span className={styles.v} data-v aria-hidden="true">
                    {tag.v}
                  </span>
                  <span className={styles.line} data-line>
                    {s.off[i]}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className={styles.crowd} role="img" aria-label={s.crowdLabel}>
          {Array.from({ length: CROWD }, (_, i) => (
            <span key={i} className={`${styles.b} ${i === 1 ? styles.me : ''}`} data-crowd {...(i === 1 ? { 'data-me': true } : {})}>
              <span className={styles.bar} />
              <span className={`${styles.bar} ${styles.short}`} />
              {i === 1 && <span className={styles.meBg} data-mebg />}
              {i === 1 && (
                <span className={styles.meText} data-metext aria-hidden="true">
                  {msg}
                </span>
              )}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
