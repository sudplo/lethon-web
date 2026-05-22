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
    const allWords = [...w1, ...w2];
    
    gsap.set(allWords, { opacity: 0.15, filter: 'blur(5px)', scale: 0.98 });
    gsap.set(subRef.current, { autoAlpha: 0, y: 15 });

    const mm = gsap.matchMedia();

    mm.add(
      {
        isDesktop: '(min-width: 761px)',
        isMobile: '(max-width: 760px)',
      },
      (context) => {
        const { isDesktop } = context.conditions;

        if (!isDesktop) {
          gsap.fromTo(allWords, 
            { opacity: 0.15, filter: 'blur(4px)', scale: 0.98 },
            {
              opacity: 1,
              filter: 'blur(0px)',
              scale: 1,
              stagger: 0.06,
              duration: 1.0,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: sectionRef.current,
                start: 'top 80%',
                toggleActions: 'play none none none',
              }
            }
          );
          gsap.fromTo(subRef.current,
            { autoAlpha: 0, y: 10 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.8,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: subRef.current,
                start: 'top 85%',
                toggleActions: 'play none none none',
              }
            }
          );
          return;
        }

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: '+=150%',
            scrub: 1,
            pin: true,
            anticipatePin: 1,
          },
        });

        // Dynamic soft focus effect
        allWords.forEach((word, i) => {
          tl.to(word, {
            opacity: 1,
            filter: 'blur(0px)',
            scale: 1,
            color: '#fff',
            duration: 0.6,
            ease: 'power2.out'
          }, i * 0.18)
          .to(word, {
            opacity: 0.35,
            filter: 'blur(3.5px)',
            scale: 0.98,
            duration: 0.6,
            ease: 'power2.inOut'
          }, (i * 0.18) + 0.6);
        });

        tl.to(subRef.current, {
          autoAlpha: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out'
        }, '>-=0.3');
      }
    );
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className={styles.section} id="statement" data-scroll-section>
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
