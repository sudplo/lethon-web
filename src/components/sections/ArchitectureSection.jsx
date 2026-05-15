'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './ArchitectureSection.module.css';

gsap.registerPlugin(ScrollTrigger);

const layers = [
  {
    title: "i2pd",
    desc: "Carries your voice. Carries your files.\nOpens a tunnel. Closes it. The address disappears.\n\nEphemeral by default.\nThe tunnel existed for 5 minutes.\nNothing else knows that address ever existed.",
    lock: "Lock 1: You can't trace the data.",
    color: "var(--color-amber)",
    tags: ["Data Streaming", "Ephemeral Tunnels"]
  },
  {
    title: "Tor",
    desc: "Finds the other person without asking a server.\nA shared secret becomes an address.\nYour metadata vanishes into onion routing.\n\nNo central point can see your metadata.\nTor doesn't know the content. The mesh doesn't know your IP.",
    lock: "Lock 2: You can't see who's talking.",
    color: "var(--color-purple)",
    tags: ["Rendezvous", "Metadata Stripping"]
  },
  {
    title: "Waku",
    desc: "Moves the message through a mesh of strangers.\nEach node forwards without understanding.\nEphemeral topics erase the link between messages.\n\nNo central point of observation.\nNo entity sees the full conversation.\nThe network IS the server.\nNo one controls it. Everyone maintains it.",
    lock: "Lock 3: You can't link messages together.",
    color: "var(--color-teal)",
    tags: ["Mesh", "Propagation", "Obfuscation"]
  },
  {
    title: "Briar",
    desc: "Encrypts. Ratchets. Forgets the old keys.\nForward secrecy by default.\n\nPermissions without a central server.\nOwner. Admin. Member.\nAll enforcement is client-side.\nNo server decides who can speak.\n\nWorks offline.\nSync when you reconnect.\nThe network doesn't disappear if Tor goes down.",
    lock: "Lock 4: You can't decrypt without the key.\nAnd the key is gone after it's used.",
    color: "var(--color-green)",
    tags: ["Encryption", "Permissions", "Offline-first"]
  }
];

export default function ArchitectureSection() {
  const containerRef = useRef(null);
  const layersRef = useRef([]);
  const [activeIndex, setActiveIndex] = useState(0);
  // Keep refs to our own triggers so cleanup is scoped
  const triggersRef = useRef([]);

  useEffect(() => {
    // Check reduced motion preference
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "+=375%",
        pin: true,
        scrub: prefersReduced ? 0 : 1.6,
        onUpdate: (self) => {
          let index = Math.floor(self.progress * layers.length);
          if (index >= layers.length) index = layers.length - 1;
          setActiveIndex(index);
        }
      }
    });

    // Store the ScrollTrigger instance for scoped cleanup
    triggersRef.current.push(tl.scrollTrigger);

    if (!prefersReduced) {
      layersRef.current.forEach((layerEl, index) => {
        if (!layerEl) return;

        const layerBar = layerEl.querySelector(`.${styles.layerBar}`);
        const tags = layerEl.querySelectorAll(`.${styles.tag}`);
        const lockStmt = layerEl.querySelector(`.${styles.lockStatement}`);

        gsap.set(layerEl, { y: 180, opacity: 0, scale: 0.92, filter: 'blur(12px)' });
        gsap.set(layerBar, { scaleY: 0, transformOrigin: "top" });
        gsap.set(tags, { opacity: 0, scale: 0.88 });
        gsap.set(lockStmt, { opacity: 0 });

        const startTime = index * 0.95;

        tl.to(layerEl, { y: 0, opacity: 1, scale: 1, filter: 'blur(0px)', duration: 0.48, ease: "power3.out" }, startTime)
          .to(layerBar, { scaleY: 1, duration: 0.35, ease: "power2.out" }, startTime + 0.18)
          .to(tags, { opacity: 1, scale: 1, stagger: 0.06, duration: 0.32, ease: "power2.out" }, startTime + 0.3)
          .to(lockStmt, { opacity: 1, duration: 0.35, ease: "power2.out" }, startTime + 0.48);

        for (let i = 0; i < index; i++) {
          tl.to(layersRef.current[i], {
            opacity: 0.18,
            y: -45 * (index - i),
            scale: 0.93,
            filter: 'blur(5px)',
            duration: 0.48,
            ease: "power2.inOut"
          }, startTime);
        }
      });

      tl.to({}, { duration: 0.8 });
    }

    return () => {
      // Only kill OUR triggers — not everyone else's
      triggersRef.current.forEach(t => t && t.kill());
      triggersRef.current = [];
      tl.kill();
    };
  }, []);

  return (
    <section ref={containerRef} className={styles.architectureSection} id="architecture">
      <div className={`container ${styles.archContainer}`}>

        <div className={styles.leftCol}>
          <h2 className={styles.headline}>
            Four locks.<br />
            One fails, three remain.<br />
            You can't break all four simultaneously.
          </h2>

          <div className={styles.descContainer}>
            {layers.map((layer, i) => (
              <div
                key={i}
                className={`${styles.dynamicDesc} ${activeIndex === i ? styles.activeDesc : ''}`}
              >
                <h3 style={{ color: layer.color }}>{layer.title}</h3>
                <pre>{layer.desc}</pre>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.rightCol}>
          <div className={styles.layersContainer}>
            {layers.map((layer, i) => (
              <div
                key={i}
                className={styles.layerWrapper}
                ref={el => layersRef.current[i] = el}
              >
                <div className={styles.layerBar} style={{ backgroundColor: layer.color }} />
                <div className={styles.layerContent}>
                  <h4 style={{ color: layer.color }}>{layer.title}</h4>
                  <div className={styles.tagsContainer}>
                    {layer.tags.map((tag, j) => (
                      <span key={j} className={styles.tag}>{tag}</span>
                    ))}
                  </div>
                  <div className={styles.lockStatement}>
                    <pre style={{ color: 'var(--color-accent)' }}>{layer.lock}</pre>
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