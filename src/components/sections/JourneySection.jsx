'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './JourneySection.module.css';

gsap.registerPlugin(ScrollTrigger);

const journeyNodes = [
  {
    title: "01 · You type",
    desc: "Plaintext. Still human."
  },
  {
    title: "02 · Bramble encrypts",
    desc: "ChaCha20-Poly1305. The key will never exist again."
  },
  {
    title: "03 · Topic is born",
    desc: "A unique address. For this message only.\nNo two messages share a topic."
  },
  {
    title: "04 · Tor tunnels",
    desc: "Your IP address disappears here.\nMetadata about WHERE you are: hidden."
  },
  {
    title: "05 · Mesh carries",
    desc: "Strangers forward what they don't understand.\nNo node sees the full path."
  },
  {
    title: "06 · Sentinel wakes",
    desc: "Checks 256 topics. One match.\nThe receiver's device recognizes its message."
  },
  {
    title: "07 · Arrives. Decrypts.",
    desc: "Topic dies. Keys rotate. Nothing remains.\nIf someone seizes this device tomorrow,\nthis conversation is mathematically impossible to recover."
  }
];

export default function JourneySection() {
  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const dotRef = useRef(null);
  const nodesRef = useRef([]);

  useEffect(() => {
    // Total height of the track to scrub through
    const trackHeight = trackRef.current.offsetHeight;
    
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "center center",
        end: "+=375%",
        pin: true,
        scrub: 1.6,
      }
    });

    // Move the dot from top to bottom of the track
    tl.to(dotRef.current, {
      y: trackHeight,
      ease: "none",
      duration: 1
    }, 0);

    // Calculate when the dot passes each node
    const nodeInterval = 1 / (journeyNodes.length - 1);

    nodesRef.current.forEach((nodeEl, index) => {
      if(!nodeEl) return;
      
      const label = nodeEl.querySelector(`.${styles.nodeLabel}`);
      const point = nodeEl.querySelector(`.${styles.nodePoint}`);
      
      gsap.set(label, { opacity: 0, x: -22, filter: 'blur(6px)' });
      gsap.set(point, { backgroundColor: 'var(--text-lethon)', scale: 1 });

      const startTime = Math.max(0, index * nodeInterval - 0.048);
      const activeTime = index * nodeInterval;

      tl.to(point, {
        backgroundColor: 'var(--color-accent)',
        scale: 1.6,
        boxShadow: '0 0 12px var(--color-accent)',
        duration: 0.06,
        ease: "power2.out"
      }, startTime)
      .to(label, {
        opacity: 1,
        x: 0,
        filter: 'blur(0px)',
        duration: 0.12,
        ease: "power3.out"
      }, startTime)
      // Dim when passed
      .to(point, {
        scale: 1,
        boxShadow: 'none',
        duration: 0.06,
        ease: "power2.in"
      }, activeTime + 0.06);
      
      if(index < journeyNodes.length - 1) {
        tl.to(label, {
          opacity: 0.25,
          filter: 'blur(3px)',
          duration: 0.11,
          ease: "power2.inOut"
        }, activeTime + 0.13);
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <section ref={containerRef} className={styles.journeySection} id="journey">
      <div className={`container ${styles.journeyContainer}`}>
        <h2 className={styles.headline}>
          Press send.<br />
          Nothing survives the trip.
        </h2>

        <div className={styles.mapArea}>
          <div className={styles.trackContainer}>
            <div className={styles.track} ref={trackRef}>
              <div className={styles.travelingDot} ref={dotRef}></div>
              
              {journeyNodes.map((node, i) => (
                <div 
                  key={i} 
                  className={styles.nodeStop} 
                  style={{ top: `${(i / (journeyNodes.length - 1)) * 100}%` }}
                  ref={el => nodesRef.current[i] = el}
                >
                  <div className={styles.nodePoint}></div>
                  <div className={styles.nodeLabel}>
                    <h4>{node.title}</h4>
                    <pre>{node.desc}</pre>
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
