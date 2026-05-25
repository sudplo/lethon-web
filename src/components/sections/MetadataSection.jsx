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
  const containerRef = useRef(null);
  
  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add(
      {
        isDesktopTall: '(min-width: 901px) and (min-height: 951px)',
        isDesktopShort: '(min-width: 901px) and (max-height: 950px)',
        isMobile: '(max-width: 900px)',
      },
      (context) => {
        const { isDesktopTall, isDesktopShort, isMobile } = context.conditions;

        if (isMobile) {
          // Mobile animation: Simple fade up without pinning
          rowRefs.current.forEach((row) => {
            if (!row) return;
            const rightBlock = row.querySelector(`.${styles.dataRight}`);
            if (rightBlock) gsap.set(rightBlock, { clipPath: 'inset(0 0 0 0)' });

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

        if (isDesktopTall) {
          // Desktop Tall: High-tech Dashboard Pinning Experience
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

          // 1. Entrance transition
          tl.fromTo(containerRef.current,
            { opacity: 0, y: 50, filter: 'blur(10px)' },
            { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.0, ease: 'power2.out' },
            0
          );

          // Initialize states
          rowRefs.current.forEach((row, i) => {
            if (!row) return;
            const leftBlock = row.querySelector(`.${styles.dataLeft}`);
            const rightBlock = row.querySelector(`.${styles.dataRight}`);
            const scanner = row.querySelector(`.${styles.scanner}`);
            const title = row.querySelector(`.${styles.rowTitle}`);
            const desc = row.querySelector(`.${styles.rowDesc}`);
            
            gsap.set(row, { autoAlpha: i === 0 ? 1 : 0.35, scale: i === 0 ? 1.01 : 0.98 });
            gsap.set(title, { color: i === 0 ? '#ffffff' : 'rgba(240, 244, 248, 0.65)' });
            gsap.set(desc, { opacity: i === 0 ? 0.85 : 0.55 });
            gsap.set(rightBlock, { clipPath: 'inset(0 100% 0 0)' });
            gsap.set(scanner, { left: '0%', autoAlpha: 0 });
          });

          // Sequential Redaction Animation
          rowRefs.current.forEach((row, i) => {
            if (!row) return;
            const leftBlock = row.querySelector(`.${styles.dataLeft}`);
            const rightBlock = row.querySelector(`.${styles.dataRight}`);
            const scanner = row.querySelector(`.${styles.scanner}`);
            const title = row.querySelector(`.${styles.rowTitle}`);
            const desc = row.querySelector(`.${styles.rowDesc}`);
            
            const label = `row-${i}`;
            tl.addLabel(label);

            // 1. Focus current row with high-tech glass highlights
            tl.to(row, { 
              autoAlpha: 1, 
              scale: 1.01, 
              backgroundColor: 'rgba(255, 255, 255, 0.02)',
              boxShadow: 'inset 0 0 20px rgba(0, 245, 160, 0.02)',
              duration: 0.8, 
              ease: 'power2.out' 
            }, label)
            .to(title, { color: '#ffffff', duration: 0.8, ease: 'power2.out' }, label)
            .to(desc, { opacity: 0.85, duration: 0.8, ease: 'power2.out' }, label);

            // 2. Scanner sweeping and redaction
            tl.to(scanner, { autoAlpha: 1, duration: 0.3 }, `${label}+=0.3`)
              .to(scanner, { left: '100%', duration: 1.8, ease: 'power1.inOut' }, `${label}+=0.3`)
              .to(rightBlock, { clipPath: 'inset(0 0% 0 0)', duration: 1.8, ease: 'power1.inOut' }, `${label}+=0.3`)
              .to(leftBlock, { 
                filter: 'blur(5px)', 
                opacity: 0.25, 
                backgroundColor: 'rgba(255, 255, 255, 0.005)',
                borderColor: 'rgba(255, 255, 255, 0.02)',
                color: 'rgba(255, 255, 255, 0.2)',
                duration: 1.4, 
                ease: 'power2.inOut' 
              }, `${label}+=0.6`)
              .to(scanner, { autoAlpha: 0, duration: 0.3 }, `${label}+=2.1`);

            // 3. Persistence
            tl.to({}, { duration: 1 }, `${label}+=2.4`);

            // 4. Dim row if not last
            if (i < ITEMS.length - 1) {
              tl.to(row, { 
                autoAlpha: 0.35, 
                scale: 0.98, 
                backgroundColor: 'rgba(0,0,0,0)',
                boxShadow: 'inset 0 0 0px rgba(0, 0, 0, 0)',
                duration: 0.8, 
                ease: 'power2.inOut' 
              }, `${label}+=3.4`)
              .to(title, { color: 'rgba(240, 244, 248, 0.65)', duration: 0.8, ease: 'power2.inOut' }, `${label}+=3.4`)
              .to(desc, { opacity: 0.55, duration: 0.8, ease: 'power2.inOut' }, `${label}+=3.4`);
            }
          });

          // 2. Exit transition
          tl.to(containerRef.current, {
            opacity: 0,
            y: -50,
            filter: 'blur(10px)',
            duration: 1.2,
            ease: 'power2.in'
          }, `row-${ITEMS.length - 1}+=3.8`);
        } else if (isDesktopShort) {
          // Desktop Short: Flow layout with scroll-triggered redactions playing once
          rowRefs.current.forEach((row, i) => {
            if (!row) return;
            const leftBlock = row.querySelector(`.${styles.dataLeft}`);
            const rightBlock = row.querySelector(`.${styles.dataRight}`);
            const scanner = row.querySelector(`.${styles.scanner}`);
            const title = row.querySelector(`.${styles.rowTitle}`);
            
            gsap.set(row, { autoAlpha: 0, scale: 0.98 });
            gsap.set(title, { color: 'rgba(240, 244, 248, 0.65)' });
            gsap.set(rightBlock, { clipPath: 'inset(0 100% 0 0)' });
            gsap.set(scanner, { left: '0%', autoAlpha: 0 });

            const tlRow = gsap.timeline({
              scrollTrigger: {
                trigger: row,
                start: 'top 85%',
                toggleActions: 'play none none none',
              }
            });

            tlRow
              .to(row, { 
                autoAlpha: 1, 
                scale: 1.01, 
                backgroundColor: 'rgba(255, 255, 255, 0.02)',
                boxShadow: 'inset 0 0 20px rgba(0, 245, 160, 0.02)',
                duration: 0.6, 
                ease: 'power2.out' 
              })
              .to(title, { color: '#ffffff', duration: 0.6 }, '<')
              .to(scanner, { autoAlpha: 1, duration: 0.2 }, '-=0.1')
              .to(scanner, { left: '100%', duration: 1.4, ease: 'power2.inOut' }, '-=0.1')
              .to(rightBlock, { clipPath: 'inset(0 0% 0 0)', duration: 1.4, ease: 'power2.inOut' }, '<')
              .to(leftBlock, { 
                filter: 'blur(5px)', 
                opacity: 0.25, 
                backgroundColor: 'rgba(255, 255, 255, 0.005)',
                borderColor: 'rgba(255, 255, 255, 0.02)',
                color: 'rgba(255, 255, 255, 0.2)',
                duration: 1.1, 
                ease: 'power2.inOut' 
              }, '-=0.9')
              .to(scanner, { autoAlpha: 0, duration: 0.2 });
          });
        }
      }
    );
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className={styles.section} id="metadata" data-scroll-section>
      <div className="container" ref={containerRef}>
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
                    <div className={styles.mobileLabel}>Standard Reality</div>
                    <pre>{item.left}</pre>
                  </div>
                </div>

                <div className={styles.dataBlock} aria-label="Lethon metadata">
                  <div className={styles.scanner} />
                  <div className={styles.dataRight}>
                    <div className={styles.mobileLabel}>Lethon Reality</div>
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
