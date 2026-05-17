'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import styles from './MetadataSection.module.css';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const ITEMS = [
  {
    title: 'Who you\'re talking to',
    left: 'From: Alice (+1-555-0123)\nTo:   Bob (+1-555-0456)',
    right: 'Topic: 0x7f3a9c2e (unique, never repeated)\nFrom: [hidden by Tor]\nTo:   [hidden by Tor]',
    desc: 'Tor hides your IP. The mesh doesn\'t care who you are. Topic is ephemeral — exists one conversation only.',
  },
  {
    title: 'When you\'re talking',
    left: 'Sent: 14:32:17\nDuration: 4 min 32 sec',
    right: 'Sent: [hidden by Tor]\nDuration: [not visible to network]',
    desc: 'Tor randomizes timing. CBR makes silence indistinguishable from speech. No pattern to extract.',
  },
  {
    title: 'How often',
    left: 'Frequency: 12 messages/day\nPattern: Daily at 14:00',
    right: 'Frequency: [isolated events]\nPattern: [obfuscated]',
    desc: 'Ephemeral topics reset. No conversation thread visible. Each message is an isolated event.',
  },
  {
    title: 'Where you are',
    left: 'Location: San Francisco, CA\nIP: 192.168.1.1',
    right: 'Location: [not visible]\nIP: [hidden by Tor]',
    desc: 'Tor exit node location, not your location. I2P further obscures.',
  },
  {
    title: 'What device you\'re using',
    left: 'Device: iPhone 15 Pro\nOS: iOS 17.2',
    right: 'Device: [not visible]\nOS: [not visible]',
    desc: 'TLS fingerprinting defeated by Tor. Voice analysis prevented by DSP pipeline.',
  },
];

export default function MetadataSection() {
  const sectionRef = useRef(null);
  const rowRefs = useRef([]);

  useGSAP(() => {
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
          /* Mobile: staggered entrance per row */
          rowRefs.current.forEach((row, i) => {
            if (!row) return;
            gsap.from(row, {
              scrollTrigger: {
                trigger: row,
                start: 'top 88%',
                toggleActions: 'play none none none',
              },
              y: 30,
              autoAlpha: 0,
              duration: 0.65,
              delay: i * 0.05,
              ease: 'power3.out',
            });
          });
          return;
        }

        /* Desktop: scrub-driven clip-path reveal */
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 52%',
            end: 'bottom 26%',
            scrub: reduceMotion ? false : 0.75,
            invalidateOnRefresh: true,
          },
        });

        rowRefs.current.forEach((row, i) => {
          if (!row) return;
          const right = row.querySelector(`.${styles.rightSide}`);
          const left = row.querySelector(`.${styles.leftSide}`);
          const desc = row.querySelector(`.${styles.rowDesc}`);

          gsap.set(right, { clipPath: 'inset(0 100% 0 0)' });
          gsap.set(desc, { autoAlpha: 0, filter: 'blur(5px)' });

          tl
            .to(left, { opacity: 0.2, duration: 0.5, ease: 'power2.inOut' }, i * 1.4)
            .to(right, { clipPath: 'inset(0 0% 0 0)', duration: 1.4, ease: 'power3.out' }, i * 1.4)
            .to(desc, { autoAlpha: 1, filter: 'blur(0px)', duration: 0.9, ease: 'power2.out' }, i * 1.4 + 0.45);
        });

        tl.to({}, { duration: 1.6 });
      }
    );
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className={styles.section} data-scroll-section>
      <div className="container">
        <div className={styles.header}>
          <h2>Metadata is not the message.</h2>
          <p className={styles.headerSub}>It&apos;s everything around the message.</p>
        </div>

        <div className={styles.grid}>
          <div className={styles.gridHead}>
            <span>Standard Encryption</span>
            <span>Lethon Architecture</span>
          </div>

          {ITEMS.map((item, i) => (
            <div key={i} className={styles.row} ref={el => rowRefs.current[i] = el} data-gsap-scan>
              <div className={styles.rowTitle}>{item.title}</div>
              <div className={styles.rowCols}>
                <div className={styles.leftSide}>
                  <pre>{item.left}</pre>
                </div>
                <div className={styles.rightSide}>
                  <pre>{item.right}</pre>
                  <p className={styles.rowDesc}>{item.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
