'use client';

import { useRef, useMemo } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import styles from './SurveillanceStatementSection.module.css';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const LINES = [
  { text: 'Metadata is where surveillance lives.', color: null, className: styles.line1 },
  { text: 'Lethon makes it invisible.', color: 'var(--color-accent)', className: styles.line2 },
  { text: 'Not by encryption.', color: 'rgba(240,244,248,0.5)', className: styles.line3 },
  { text: 'By architecture.', color: null, className: styles.line4 },
];

function Word({ word, color, index }) {
  return (
    <span className={styles.wordWrap}>
      <span 
        className={`${styles.wordInner} js-word`} 
        style={{ color: color }}
      >
        {word}{'\u00A0'}
      </span>
    </span>
  );
}

export default function SurveillanceStatementSection() {
  const sectionRef = useRef(null);
  const containerRef = useRef(null);
  const bgGlowRef = useRef(null);
  const borderLineRef = useRef(null);

  useGSAP(() => {
    const q = gsap.utils.selector(sectionRef);
    const mm = gsap.matchMedia();

    // Group words by their line index
    const lineWords = LINES.map((_, i) => q(`.js-line-${i} .js-word`));

    // Global initial state setup to avoid flash on mount
    gsap.set(lineWords[0], { 
      autoAlpha: 0, 
      y: 40, 
      rotateX: -60, 
      filter: 'blur(10px)',
      transformOrigin: '50% 100%'
    });
    gsap.set(lineWords[1], { 
      autoAlpha: 0, 
      y: 40, 
      rotateX: -60, 
      filter: 'blur(10px)',
      transformOrigin: '50% 100%'
    });
    gsap.set(q('.js-line-2 .js-word, .js-line-3 .js-word'), { 
      autoAlpha: 0, 
      filter: 'blur(4px)', 
      x: -25 
    });
    gsap.set(borderLineRef.current, { scaleY: 0 });
    gsap.set(bgGlowRef.current, { scale: 0.8, opacity: 0.3 });

    mm.add(
      {
        isDesktop: '(min-width: 761px)',
        isMobile: '(max-width: 760px)',
      },
      (context) => {
        const { isDesktop } = context.conditions;

        if (!isDesktop) {
          // Mobile: simple clean timeline when scrolled into view
          gsap.set(q('.js-word'), { autoAlpha: 0, y: 25, rotateX: -45, filter: 'blur(4px)' });
          gsap.set(borderLineRef.current, { scaleY: 0 });
          
          const tlMob = gsap.timeline({
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 75%',
              toggleActions: 'play none none none',
            }
          });
          
          tlMob.to(q('.js-line-0 .js-word, .js-line-1 .js-word'), {
            autoAlpha: 1,
            y: 0,
            rotateX: 0,
            filter: 'blur(0px)',
            stagger: 0.03,
            duration: 0.9,
            ease: 'expo.out'
          });
          
          tlMob.to(borderLineRef.current, {
            scaleY: 1,
            duration: 0.6,
            ease: 'power2.inOut'
          }, '-=0.2');
          
          tlMob.to(q('.js-line-2 .js-word, .js-line-3 .js-word'), {
            autoAlpha: 1,
            y: 0,
            rotateX: 0,
            filter: 'blur(0px)',
            stagger: 0.03,
            duration: 0.8,
            ease: 'expo.out'
          }, '-=0.2');
          
          return;
        }

        const inner = containerRef.current;
        
        // Initial setup for desktop
        gsap.set(lineWords[0], { 
          autoAlpha: 0, 
          y: 40, 
          rotateX: -60, 
          filter: 'blur(10px)'
        });
        gsap.set(lineWords[1], { 
          autoAlpha: 0, 
          y: 40, 
          rotateX: -60, 
          filter: 'blur(10px)'
        });
        gsap.set(q('.js-line-2 .js-word, .js-line-3 .js-word'), { 
          autoAlpha: 0, 
          filter: 'blur(4px)', 
          x: -25 
        });
        gsap.set(borderLineRef.current, { scaleY: 0 });
        gsap.set(bgGlowRef.current, { scale: 0.8, opacity: 0.3 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: '+=340%',
            pin: true,
            scrub: 1.8,
            anticipatePin: 1,
          },
        });

        // 1. Subtle entrance shift on the inner container and background glow scale
        tl.fromTo(inner,
          { scale: 0.97, rotateX: -4 },
          { scale: 1, rotateX: 0, duration: 0.6, ease: 'power2.out' },
          0
        );
        tl.to(bgGlowRef.current, {
          scale: 1.15,
          opacity: 1,
          duration: 1.2,
          ease: 'power1.out'
        }, 0);

        // 2. Reveal Line 0 (Metadata is where surveillance lives)
        tl.to(lineWords[0], {
          autoAlpha: 1,
          y: 0,
          rotateX: 0,
          filter: 'blur(0px)',
          stagger: 0.04,
          duration: 0.8,
          ease: 'expo.out'
        }, 0.3);

        // 3. Reveal Line 1 (Lethon makes it invisible)
        tl.to(lineWords[1], {
          autoAlpha: 1,
          y: 0,
          rotateX: 0,
          filter: 'blur(0px)',
          stagger: 0.04,
          duration: 0.8,
          ease: 'expo.out'
        }, 0.8);

        // 4. Grow Border Line
        tl.to(borderLineRef.current, {
          scaleY: 1,
          duration: 0.5,
          ease: 'power2.inOut'
        }, 1.4);

        // 5. Reveal Mono Lines (Not by encryption. By architecture.)
        // Animate from behind the vertical border line (x: -25 to 0)
        tl.to(lineWords[2], {
          autoAlpha: 1,
          filter: 'blur(0px)',
          x: 0,
          stagger: 0.03,
          duration: 0.6,
          ease: 'power2.out'
        }, 1.7);

        tl.to(lineWords[3], {
          autoAlpha: 1,
          filter: 'blur(0px)',
          x: 0,
          stagger: 0.03,
          duration: 0.6,
          ease: 'power2.out'
        }, 2.0);

        // 6. Hold state (large readable scrolling block)
        tl.to({}, { duration: 3.5 });

        // 7. Exit transition: 3D perspective dissolve
        tl.to(inner, {
          opacity: 0,
          y: -80,
          scale: 1.04,
          rotateX: 12,
          filter: 'blur(15px)',
          duration: 1.0,
          ease: 'power2.inOut'
        });

        tl.to(bgGlowRef.current, {
          opacity: 0,
          scale: 1.25,
          duration: 1.0,
          ease: 'power2.in'
        }, '<');
      }
    );
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className={styles.section} id="surveillance" data-scroll-section>
      <div className={styles.bgGlow} ref={bgGlowRef} />
      <div className={`container ${styles.inner}`} ref={containerRef}>
        {LINES.slice(0, 2).map((line, i) => (
          <p key={i} className={`${line.className} js-line-${i}`}>
            {line.text.split(' ').map((word, j) => (
              <Word key={j} word={word} color={line.color} />
            ))}
          </p>
        ))}
        <div className={styles.smallGroup}>
          <div className={styles.borderLine} ref={borderLineRef} />
          {LINES.slice(2).map((line, i) => (
            <p key={i + 2} className={`${line.className} js-line-${i + 2}`}>
              {line.text.split(' ').map((word, j) => (
                <Word key={j} word={word} color={line.color} />
              ))}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
