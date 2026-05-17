'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './ArchitectureSection.module.css';

gsap.registerPlugin(ScrollTrigger);

const LAYERS = [
  {
    title: 'i2pd',
    body: `Carries your voice. Carries your files.\nOpens a tunnel. Closes it. The address disappears.\n\nEphemeral by default.\nThe tunnel existed for 5 minutes.\nNothing else knows that address ever existed.`,
    lock: 'Lock 1: You can\'t trace the data.',
    color: 'var(--color-amber)',
    tags: ['Data Streaming', 'Ephemeral Tunnels'],
  },
  {
    title: 'Tor',
    body: `Finds the other person without asking a server.\nA shared secret becomes an address.\nYour metadata vanishes into onion routing.\n\nNo central point can see your metadata.\nTor doesn't know the content. The mesh doesn't know your IP.`,
    lock: 'Lock 2: You can\'t see who\'s talking.',
    color: 'var(--color-purple)',
    tags: ['Rendezvous', 'Metadata Stripping'],
  },
  {
    title: 'Waku',
    body: `Moves the message through a mesh of strangers.\nEach node forwards without understanding.\nEphemeral topics erase the link between messages.\n\nNo central point of observation.\nThe network IS the server.`,
    lock: 'Lock 3: You can\'t link messages together.',
    color: 'var(--color-teal)',
    tags: ['Mesh', 'Propagation', 'Obfuscation'],
  },
  {
    title: 'Briar',
    body: `Encrypts. Ratchets. Forgets the old keys.\nForward secrecy by default.\n\nPermissions without a central server.\nAll enforcement is client-side.\n\nWorks offline. Sync when you reconnect.`,
    lock: 'Lock 4: You can\'t decrypt without the key.\nAnd the key is gone after it\'s used.',
    color: 'var(--color-green)',
    tags: ['Encryption', 'Permissions', 'Offline-first'],
  },
];

export default function ArchitectureSection() {
  const sectionRef = useRef(null);
  const cardRefs = useRef([]);
  const barRefs = useRef([]);
  const lockRefs = useRef([]);
  const triggerRef = useRef(null);
  const tlRef = useRef(null);
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add(
      {
        isDesktop: '(min-width: 901px)',
        reduceMotion: '(prefers-reduced-motion: reduce)',
      },
      (context) => {
        const { isDesktop, reduceMotion } = context.conditions;
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: isDesktop ? 'top top' : 'top 76%',
            end: isDesktop ? '+=380%' : 'bottom 22%',
            pin: isDesktop && !reduceMotion,
            pinSpacing: true,
            scrub: reduceMotion ? false : isDesktop ? 1.8 : 0.65,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const idx = Math.min(LAYERS.length - 1, Math.floor(self.progress * LAYERS.length));
              setActiveIdx(idx);
            },
          },
        });

        tlRef.current = tl;
        triggerRef.current = tl.scrollTrigger;

        if (!reduceMotion) {
      cardRefs.current.forEach((card, i) => {
        if (!card) return;
        const bar = barRefs.current[i];
        const lock = lockRefs.current[i];

        gsap.set(card, { y: 160, autoAlpha: 0, scale: 0.94, filter: 'blur(10px)' });
        gsap.set(bar, { scaleY: 0, transformOrigin: 'top' });
        gsap.set(lock, { autoAlpha: 0 });

        const t0 = i * 0.9;

        tl.to(card, { y: 0, autoAlpha: 1, scale: 1, filter: 'blur(0px)', duration: 0.5, ease: 'power3.out' }, t0)
          .to(bar, { scaleY: 1, duration: 0.4, ease: 'power2.out' }, t0 + 0.15)
          .to(lock, { autoAlpha: 1, duration: 0.35, ease: 'power2.out' }, t0 + 0.4);

        /* Push previous cards up + dim */
        for (let j = 0; j < i; j++) {
          tl.to(cardRefs.current[j], {
            opacity: 0.16,
            y: -40 * (i - j),
            scale: 0.94,
            filter: 'blur(4px)',
            duration: 0.5,
            ease: 'power2.inOut',
          }, t0);
        }
      });

      /* Hold at end and fade out content */
      tl.to({}, { duration: 0.7 })
        .to([sectionRef.current.querySelector(`.${styles.leftCol}`), cardRefs.current], {
          autoAlpha: 0,
          y: isDesktop ? -50 : -18,
          duration: 0.8,
          ease: 'power2.in'
        });
        }

        return () => tl.kill();
      }
    );

    return () => {
      mm.revert();
    };
  }, []);

  return (
    <section ref={sectionRef} className={styles.section} id="architecture" data-scroll-section>
      <div className={`container ${styles.pinWrapper}`}>

        {/* ── Left ── */}
        <div className={styles.leftCol}>
          <h2 className={styles.headline}>
            Four locks.<br />
            One fails, three remain.<br />
            You can&apos;t break all four simultaneously.
          </h2>

          <div className={styles.descWrap}>
            {LAYERS.map((layer, i) => (
              <div key={i} className={`${styles.desc} ${activeIdx === i ? styles.descActive : ''}`}>
                <h3 className={styles.descTitle} style={{ color: layer.color }}>{layer.title}</h3>
                <pre className={styles.descBody}>{layer.body}</pre>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right ── */}
        <div className={styles.rightCol}>
          {LAYERS.map((layer, i) => (
            <div key={i} className={styles.card} ref={el => cardRefs.current[i] = el} data-gsap-scan>
              <div
                className={styles.cardBar}
                ref={el => barRefs.current[i] = el}
                style={{ backgroundColor: layer.color }}
              />
              <div className={styles.cardBody}>
                <h4 className={styles.cardTitle} style={{ color: layer.color }}>{layer.title}</h4>
                <div className={styles.cardTags}>
                  {layer.tags.map((tag, j) => <span key={j} className="tag">{tag}</span>)}
                </div>
                <pre className={styles.cardLock} ref={el => lockRefs.current[i] = el}>
                  {layer.lock}
                </pre>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
