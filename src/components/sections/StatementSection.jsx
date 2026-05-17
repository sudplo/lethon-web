'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import styles from './StatementSection.module.css';

gsap.registerPlugin(ScrollTrigger, useGSAP);

function buildWords(container, words) {
  container.innerHTML = '';
  const spans = [];
  words.forEach((word, i) => {
    const wrap = document.createElement('span');
    wrap.className = styles.wordWrap;
    const inner = document.createElement('span');
    inner.className = styles.wordInner;
    inner.textContent = word + (i < words.length - 1 ? '\u00A0' : '');
    gsap.set(inner, { autoAlpha: 0, y: 28, filter: 'blur(12px)' });
    wrap.appendChild(inner);
    container.appendChild(wrap);
    spans.push(inner);
  });
  return spans;
}

export default function StatementSection() {
  const sectionRef = useRef(null);
  const line1Ref = useRef(null);
  const line2Ref = useRef(null);
  const subRef = useRef(null);

  useGSAP(() => {
    const w1 = buildWords(line1Ref.current, ['The', 'network', 'carries']);
    const w2 = buildWords(line2Ref.current, ['what', 'it', 'doesn\'t', 'understand.']);
    gsap.set(subRef.current, { autoAlpha: 0, y: 18 });

    const mm = gsap.matchMedia();

    mm.add(
      {
        isDesktop: '(min-width: 761px)',
        isMobile: '(max-width: 760px)',
        reduceMotion: '(prefers-reduced-motion: reduce)',
      },
      (context) => {
        const { isDesktop, reduceMotion } = context.conditions;

        if (!isDesktop) {
          /* Mobile: show everything immediately */
          gsap.set([...w1, ...w2], { autoAlpha: 1, y: 0, filter: 'blur(0px)' });
          gsap.set(subRef.current, { autoAlpha: 1, y: 0 });
          return;
        }

        /* Desktop: scrub-driven reveal */
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 55%',
            end: 'bottom 35%',
            scrub: reduceMotion ? false : 0.7,
            toggleActions: 'play none none reverse',
            invalidateOnRefresh: true,
            fastScrollEnd: true,
          },
        });

        tl
          /* Line 1 falls in */
          .to(w1, { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.6, stagger: 0.16, ease: 'power3.out' }, 0)
          .to({}, { duration: 0.35 })

          /* Line 2 completes the thought */
          .to(w2, { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.55, stagger: 0.13, ease: 'power3.out' })
          .to({}, { duration: 0.35 })

          /* Dim both, surface subline */
          .to([...w1, ...w2], { autoAlpha: 0.18, filter: 'blur(5px)', y: -10, duration: 0.65, ease: 'power2.inOut' })
          .to(subRef.current, { autoAlpha: 1, y: 0, duration: 0.75, ease: 'power3.out' }, '-=0.4')
          .to({}, { duration: 0.9 });
      }
    );
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className={styles.section} data-scroll-section>
      <div className="container">
        <div className={styles.block}>
          <h2 ref={line1Ref} className={styles.line1} aria-label="The network carries" />
          <h2 ref={line2Ref} className={styles.line2} aria-label="what it doesn't understand." />
          <p ref={subRef} className={styles.sub}>
            Privacy by architecture, not by trust.
          </p>
        </div>
      </div>
    </section>
  );
}
