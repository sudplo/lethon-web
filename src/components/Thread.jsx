'use client';
import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger, FULL_MOTION } from '@/lib/gsap';
import styles from './Thread.module.css';

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const ease = (t) => t * t * (3 - 2 * t);
const lerp = (a, b, t) => a + (b - a) * t;

/**
 * El hilo visual: una luz que nace en la oscuridad, acompaña al lector por el borde,
 * se vuelve ámbar en Cerca y al final aterriza en el monograma, junto al botón de descarga.
 * Solo se mueve con transform y opacity.
 */
export default function Thread() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    const root = document.documentElement;
    const mm = gsap.matchMedia();
    mm.add(FULL_MOTION, () => {
      root.classList.add('has-thread');
      const BASE = 12;
      let mono = null;

      const update = () => {
        const w = window.innerWidth;
        const vh = window.innerHeight;
        const y0 = window.scrollY;
        const max = Math.max(1, document.documentElement.scrollHeight - vh);
        // Punto de partida: el punto de luz de la primera escena.
        const sx = w / 2;
        const sy = vh * 0.4;
        // Carril: el borde derecho, de arriba abajo según lo que llevas leído.
        const tx = w - (w < 768 ? 9 : Math.min(40, w * 0.03));
        const ty = lerp(vh * 0.2, vh - 40, clamp(y0 / max));
        const leave = ease(clamp(y0 / (vh * 0.55)));
        let x = lerp(sx, tx, leave);
        let y = lerp(sy, ty, leave);
        let s = 1;
        // Aterrizaje: sigue a la luz del monograma de la escena de descarga.
        if (!mono || !mono.isConnected) mono = document.getElementById('mono-light');
        if (mono) {
          const r = mono.getBoundingClientRect();
          const mx = r.left + r.width / 2;
          const my = r.top + r.height / 2;
          const land = ease(clamp((vh * 0.92 - my) / (vh * 0.4)));
          x = lerp(x, mx, land);
          y = lerp(y, my, land);
          s = lerp(1, r.width / BASE, land);
        }
        el.style.transform = `translate3d(${(x - BASE / 2).toFixed(1)}px, ${(y - BASE / 2).toFixed(1)}px, 0) scale(${s.toFixed(3)})`;
      };

      const st = ScrollTrigger.create({
        trigger: document.body,
        start: 0,
        end: 'max',
        onUpdate: update,
        onRefresh: update,
      });
      update();
      window.addEventListener('resize', update);
      return () => {
        st.kill();
        window.removeEventListener('resize', update);
        root.classList.remove('has-thread');
      };
    });
    return () => mm.revert();
  }, []);

  return (
    <div className={styles.thread} ref={ref} aria-hidden="true">
      <span className={`${styles.dot} ${styles.jade}`} />
      <span className={`${styles.dot} ${styles.amber}`} />
    </div>
  );
}
