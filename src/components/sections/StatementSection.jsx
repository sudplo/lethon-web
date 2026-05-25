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
    
    // Set default hidden 3D state on mount to prevent layout flash
    gsap.set(allWords, { 
      autoAlpha: 0, 
      y: 40, 
      rotateX: -60, 
      filter: 'blur(10px)',
      transformOrigin: '50% 100%'
    });
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
          gsap.set(allWords, { autoAlpha: 0, y: 30, rotateX: -45, filter: 'blur(5px)' });
          gsap.set(subRef.current, { autoAlpha: 0, y: 15 });
          
          const tlMob = gsap.timeline({
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 75%',
              toggleActions: 'play none none none',
            }
          });
          
          tlMob.to(allWords, {
            autoAlpha: 1,
            y: 0,
            rotateX: 0,
            filter: 'blur(0px)',
            stagger: 0.04,
            duration: 0.9,
            ease: 'expo.out'
          });
          
          tlMob.to(subRef.current, {
            autoAlpha: 1,
            y: 0,
            duration: 0.8,
            ease: 'power2.out'
          }, '-=0.3');
          return;
        }

        const block = sectionRef.current.querySelector(`.${styles.block}`);
        
        // Initial setup for desktop
        gsap.set(allWords, { 
          autoAlpha: 0, 
          y: 45, 
          rotateX: -60, 
          filter: 'blur(10px)'
        });
        gsap.set(subRef.current, { 
          autoAlpha: 0, 
          y: 20,
          '--line-scale': 0
        });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: '+=240%',
            pin: true,
            scrub: 1.8,
            anticipatePin: 1,
          },
        });

        // 1. Subtle entrance shift on the block container (kept fully visible to avoid flash)
        tl.fromTo(block, 
          { scale: 0.97, rotateX: -4 },
          { scale: 1, rotateX: 0, duration: 0.6, ease: 'power2.out' },
          0
        );

        // 2. 3D Unfolding Stagger Reveal
        tl.to(allWords, {
          autoAlpha: 1,
          y: 0,
          rotateX: 0,
          filter: 'blur(0px)',
          duration: 1.0,
          stagger: 0.06,
          ease: 'expo.out',
        }, 0.2);

        // 3. Subtext Reveal (triggers just as the text finishes revealing)
        tl.to(subRef.current, {
          autoAlpha: 1,
          y: 0,
          '--line-scale': 1,
          duration: 0.8,
          ease: 'power2.out'
        }, 0.8);

        // 4. Hold state for reading (occupies the main scroll portion)
        tl.to({}, { duration: 3.0 });

        // 5. 3D Dissolve Exit
        tl.to(block, {
          opacity: 0,
          y: -80,
          scale: 1.04,
          rotateX: 12,
          filter: 'blur(15px)',
          duration: 1.0,
          ease: 'power2.inOut'
        });
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
