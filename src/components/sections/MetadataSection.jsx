'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './MetadataSection.module.css';

gsap.registerPlugin(ScrollTrigger);

const metadataItems = [
  {
    title: "Who you're talking to",
    left: "From: Alice (+1-555-0123)\nTo: Bob (+1-555-0456)",
    right: "Topic: 0x7f3a9c2e (unique, never repeated)\nFrom: [hidden by Tor]\nTo: [hidden by Tor]",
    desc: "Tor hides your IP. The mesh doesn't care who you are. Topic is ephemeral — exists one conversation only."
  },
  {
    title: "When you're talking",
    left: "Sent: 14:32:17\nDuration: 4 minutes 32 seconds",
    right: "Sent: [hidden by Tor]\nDuration: [not visible to network]",
    desc: "Tor randomizes timing. CBR (constant bitrate) makes silence indistinguishable from speech. No pattern to extract."
  },
  {
    title: "How often",
    left: "Frequency: 12 messages/day\nPattern: Daily at 14:00",
    right: "Frequency: [isolated events]\nPattern: [obfuscated]",
    desc: "Ephemeral topics reset. No \"conversation thread\" visible to network. Each message appears as an isolated event."
  },
  {
    title: "Where you are",
    left: "Location: San Francisco, CA\nIP: 192.168.1.1",
    right: "Location: [not visible to network]\nIP: [hidden by Tor]",
    desc: "Tor exit node location, not your location. I2P further obscures."
  },
  {
    title: "What device you're using",
    left: "Device: iPhone 15 Pro\nOS: iOS 17.2",
    right: "Device: [not visible to network]\nOS: [not visible to network]",
    desc: "TLS fingerprinting defeated by Tor. Voice analysis prevented by DSP pipeline."
  }
];

export default function MetadataSection() {
  const containerRef = useRef(null);
  const rowsRef = useRef([]);

  useEffect(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "center center",
        end: "+=380%",
        pin: true,
        scrub: 1.7,
      }
    });

    rowsRef.current.forEach((row, index) => {
      if (!row) return;

      const rightSide = row.querySelector(`.${styles.rightSide}`);
      const leftSide = row.querySelector(`.${styles.leftSide}`);
      const desc = row.querySelector(`.${styles.description}`);

      gsap.set(rightSide, { clipPath: 'inset(0 100% 0 0)' });
      gsap.set(desc, { opacity: 0, filter: 'blur(6px)' });

      tl.to(leftSide, { opacity: 0.25, duration: 0.48, ease: "power2.inOut" }, index * 1.4)
        .to(rightSide, { clipPath: 'inset(0 0% 0 0)', duration: 1.4, ease: "power3.out" }, index * 1.4)
        .to(desc, { opacity: 1, filter: 'blur(0px)', duration: 0.95, ease: "power2.out" }, index * 1.4 + 0.45);
    });

    tl.to({}, { duration: 1.8 });

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <section ref={containerRef} className={styles.metadataSection}>
      <div className="container h-full flex-col justify-center">

        <div className={styles.headerRow}>
          <h2>Metadata is not the message.</h2>
          <p className={styles.subtext}>It's everything around the message.</p>
        </div>

        <div className={styles.comparisonGrid}>
          <div className={styles.gridHeader}>
            <div className={styles.leftCol}>Standard Encryption</div>
            <div className={styles.rightCol}>Lethon Architecture</div>
          </div>

          {metadataItems.map((item, i) => (
            <div
              key={i}
              className={styles.dataRow}
              ref={el => rowsRef.current[i] = el}
            >
              <div className={styles.rowTitle}>{item.title}</div>
              <div className={styles.splitContent}>
                <div className={styles.leftSide}>
                  <pre>{item.left}</pre>
                </div>
                <div className={styles.rightSide}>
                  <pre>{item.right}</pre>
                  <p className={styles.description}>{item.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}