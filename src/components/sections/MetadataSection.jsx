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
    right: 'Topic: 0x7f3a9c2e (unique)\nFrom: [hidden by Tor]\nTo:   [hidden by Tor]',
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
    left: 'Frequency: 12 msgs/day\nPattern: Daily at 14:00',
    right: 'Frequency: [isolated events]\nPattern: [obfuscated]',
    desc: 'Ephemeral topics reset. No conversation thread visible. Each message is an isolated event.',
  },
  {
    title: 'Where you are',
    left: 'Location: San Francisco, CA\nIP: 192.168.1.1',
    right: 'Location: [not visible]\nIP: [hidden by Tor]',
    desc: 'Tor exit node location, not your location. I2P further obscures.',
  },
];

export default function MetadataSection() {
  const sectionRef = useRef(null);
  const rowRefs = useRef([]);
  
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
          // Mobile animation: Simple fade up without pinning
          rowRefs.current.forEach((row) => {
            if (!row) return;
            gsap.from(row, {
              scrollTrigger: {
                trigger: row,
                start: 'top 85%',
                toggleActions: 'play none none none',
              },
              y: 30,
              autoAlpha: 0,
              duration: 0.8,
              ease: 'power3.out',
            });
          });
          return;
        }

        // Desktop: High-tech Dashboard Pinning Experience
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: `+=${ITEMS.length * 120}%`,
            scrub: 1,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        // Initialize states
        rowRefs.current.forEach((row, i) => {
          if (!row) return;
          const leftBlock = row.querySelector(`.${styles.dataLeft}`);
          const rightBlock = row.querySelector(`.${styles.dataRight}`);
          const scanner = row.querySelector(`.${styles.scanner}`);
          
          gsap.set(row, { autoAlpha: i === 0 ? 1 : 0.2, scale: i === 0 ? 1 : 0.96 });
          gsap.set(rightBlock, { clipPath: 'inset(0 100% 0 0)' });
          gsap.set(scanner, { left: '0%', autoAlpha: 0 });
        });

        // Sequential Redaction Animation
        rowRefs.current.forEach((row, i) => {
          if (!row) return;
          const leftBlock = row.querySelector(`.${styles.dataLeft}`);
          const rightBlock = row.querySelector(`.${styles.dataRight}`);
          const scanner = row.querySelector(`.${styles.scanner}`);
          
          const label = `row-${i}`;
          tl.addLabel(label);

          // 1. Focus current row
          tl.to(row, { autoAlpha: 1, scale: 1, duration: 0.8, ease: 'power2.out' }, label);

          // 2. Scanner sweeping effect
          tl.to(scanner, { autoAlpha: 1, duration: 0.3 }, `${label}+=0.3`)
            .to(scanner, { left: '100%', duration: 1.8, ease: 'power1.inOut' }, `${label}+=0.3`)
            .to(rightBlock, { clipPath: 'inset(0 0% 0 0)', duration: 1.8, ease: 'power1.inOut' }, `${label}+=0.3`)
            .to(leftBlock, { filter: 'blur(8px)', opacity: 0.2, duration: 1.2, ease: 'power2.in' }, `${label}+=0.8`)
            .to(scanner, { autoAlpha: 0, duration: 0.3 }, `${label}+=2.1`);

          // 3. Persistence
          tl.to({}, { duration: 1 }, `${label}+=2.4`);

          // 4. Dim row if not last
          if (i < ITEMS.length - 1) {
            tl.to(row, { autoAlpha: 0.2, scale: 0.96, duration: 0.8, ease: 'power2.inOut' }, `${label}+=3.4`);
          }
        });
      }
    );
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className={styles.section} id="metadata" data-scroll-section>
      <div className="container">
        <header className={styles.header}>
          <div className={styles.tag}>METADATA OBFUSCATION</div>
          <h2 className={styles.headline}>
            Metadata is not the message.<br />
            <span>It&apos;s everything around it.</span>
          </h2>
        </header>

        <div className={styles.dashboard}>
          <div className={styles.dashHeader}>
            <div>Vector / Category</div>
            <div>Standard Reality</div>
            <div className={styles.accentText}>Lethon Reality</div>
          </div>

          <div className={styles.dashBody}>
            {ITEMS.map((item, i) => (
              <div key={i} className={styles.row} ref={el => rowRefs.current[i] = el}>
                <div className={styles.rowMeta}>
                  <h3 className={styles.rowTitle}>{item.title}</h3>
                  <p className={styles.rowDesc}>{item.desc}</p>
                </div>
                
                <div className={styles.dataBlock} aria-label="Standard metadata">
                  <div className={styles.dataLeft}>
                    <pre>{item.left}</pre>
                  </div>
                </div>

                <div className={styles.dataBlock} aria-label="Lethon metadata">
                  <div className={styles.scanner} />
                  <div className={styles.dataRight}>
                    <pre>{item.right}</pre>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
