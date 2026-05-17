'use client';

import { useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import styles from './JourneySection.module.css';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const NODES = [
  { title: '01 · You type', desc: 'Plaintext. Still human.' },
  { title: '02 · Bramble encrypts', desc: 'ChaCha20-Poly1305.\nThe key will never exist again.' },
  { title: '03 · Topic is born', desc: 'A unique address. For this message only.\nNo two messages share a topic.' },
  { title: '04 · Tor tunnels', desc: 'Your IP address disappears here.\nMetadata about WHERE you are: hidden.' },
  { title: '05 · Mesh carries', desc: 'Strangers forward what they don\'t understand.\nNo node sees the full path.' },
  { title: '06 · Sentinel wakes', desc: 'Checks 256 topics. One match.\nThe receiver\'s device recognizes its message.' },
  { title: '07 · Arrives. Decrypts.', desc: 'Topic dies. Keys rotate. Nothing remains.\nThis conversation is mathematically impossible to recover.' },
];

export default function JourneySection() {
  const sectionRef = useRef(null);
  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const progressLineRef = useRef(null);
  const dotRef = useRef(null);
  const stopRefs = useRef([]);
  const contentRefs = useRef([]);
  const [activeIdx, setActiveIdx] = useState(-1);
  const activeIdxRef = useRef(-1);

  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add(
      {
        isDesktop: '(min-width: 901px)',
        isMobile: '(max-width: 900px)',
      },
      (context) => {
        const { isDesktop } = context.conditions;

        if (!isDesktop) {
          // Mobile: Sequential reveal on scroll
          stopRefs.current.forEach((stop, i) => {
            if (!stop) return;
            gsap.from(stop, {
              scrollTrigger: {
                trigger: stop,
                start: 'top 90%',
                toggleActions: 'play none none none',
              },
              autoAlpha: 0,
              y: 30,
              duration: 0.8,
              ease: 'power3.out',
            });
          });
          return;
        }

        // Desktop: Pinning and scroll-driven journey
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: '+=400%', // More space for professional feel
            scrub: 1,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const raw = self.progress * (NODES.length - 1);
              const idx = gsap.utils.clamp(0, NODES.length - 1, Math.round(raw));
              if (idx !== activeIdxRef.current) {
                activeIdxRef.current = idx;
                setActiveIdx(idx);
              }
            },
          },
        });

        // Initialize cards
        gsap.set(contentRefs.current, { autoAlpha: 0, x: 40, scale: 0.9, filter: 'blur(10px)' });

        // Animate the main path line and dot across the whole timeline
        tl.to(progressLineRef.current, { height: '100%', ease: 'none', duration: NODES.length * 4 }, 0);
        tl.to(dotRef.current, { top: '100%', ease: 'none', duration: NODES.length * 4 }, 0);

        NODES.forEach((_, i) => {
          const startTime = i * 4;
          const label = `node-${i}`;
          tl.addLabel(label, startTime);
          
          const stopCircle = stopRefs.current[i].querySelector(`.${styles.nodeCircle}`);
          const card = contentRefs.current[i];

          // 1. Entrance
          tl.to(stopCircle, {
            scale: 1.5,
            backgroundColor: 'var(--color-accent)',
            boxShadow: '0 0 30px rgba(0, 245, 160, 0.8)',
            duration: 1,
          }, label);

          tl.to(card, {
            autoAlpha: 1,
            x: 0,
            scale: 1,
            filter: 'blur(0px)',
            duration: 1.2,
            ease: 'power3.out'
          }, label);

          // 2. Persistence
          tl.to({}, { duration: 1.5 }, `${label}+=1.2`);

          // 3. Exit (if not last)
          if (i < NODES.length - 1) {
            tl.to(card, {
              autoAlpha: 0,
              x: -40,
              scale: 0.9,
              filter: 'blur(10px)',
              duration: 1,
              ease: 'power3.in'
            }, `${label}+=2.7`);

            tl.to(stopCircle, {
              scale: 1,
              backgroundColor: 'rgba(0, 245, 160, 0.4)',
              boxShadow: '0 0 10px rgba(0, 245, 160, 0.2)',
              duration: 1,
            }, `${label}+=2.7`);
          }
        });
      }
    );
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className={styles.section} id="journey" data-scroll-section>
      <div className={`container ${styles.container}`} ref={containerRef}>
        <div className={styles.stickyWrapper}>
          <div className={styles.header}>
            <div className={styles.tag}>ENCRYPTION FLOW</div>
            <h2 className={styles.headline}>
              Press send.<br />
              <span>Nothing survives the trip.</span>
            </h2>
          </div>

          <div className={styles.journeyGrid}>
            <div className={styles.trackCol}>
              <div className={styles.track} ref={trackRef}>
                <div className={styles.baseLine} />
                <div className={styles.progressLine} ref={progressLineRef} />
                <div className={styles.dot} ref={dotRef} aria-hidden="true">
                  <div className={styles.dotPulse} />
                </div>

                {NODES.map((node, i) => (
                  <div
                    key={i}
                    ref={el => stopRefs.current[i] = el}
                    className={`${styles.stop} ${activeIdx === i ? styles.stopActive : ''}`}
                    style={{ top: `${((i / (NODES.length - 1)) * 100).toFixed(4)}%` }}
                  >
                    <div className={styles.nodeCircle} aria-hidden="true" />
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.contentCol}>
              {NODES.map((node, i) => (
                <div
                  key={i}
                  ref={el => contentRefs.current[i] = el}
                  className={styles.contentCard}
                  style={{ opacity: 0, transform: 'translateX(40px) scale(0.9)', filter: 'blur(10px)' }}
                >
                  <div className={styles.cardHeader}>
                    <span className={styles.nodeIndex}>0{i + 1}</span>
                    <h4 className={styles.nodeTitle}>{node.title}</h4>
                  </div>
                  <div className={styles.cardBody}>
                    <pre className={styles.nodeDesc}>{node.desc}</pre>
                  </div>
                  <div className={styles.cardFooter}>
                    <div className={styles.securityStatus}>
                      <span className={styles.statusDot} />
                      ENCRYPTED_NODE_STMT
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
