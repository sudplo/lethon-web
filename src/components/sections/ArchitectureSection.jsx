'use client';

import { useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import styles from './ArchitectureSection.module.css';

gsap.registerPlugin(ScrollTrigger, useGSAP);

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
  const containerRef = useRef(null);
  const cardRefs = useRef([]);
  const barRefs = useRef([]);
  const lockRefs = useRef([]);
  const headlineRef = useRef(null);
  const [activeIdx, setActiveIdx] = useState(0);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    const q = gsap.utils.selector(sectionRef);

    mm.add(
      {
        isDesktop: '(min-width: 901px)',
        isMobile: '(max-width: 900px)',
        reduceMotion: '(prefers-reduced-motion: reduce)',
      },
      (context) => {
        const { isDesktop, reduceMotion } = context.conditions;

        if (reduceMotion) return;

        // ── 1. PREPARATION ──
        if (isDesktop) {
          gsap.set(cardRefs.current, { 
            y: 400, z: 0, rotationX: 10, autoAlpha: 0, scale: 0.9, filter: 'blur(15px)', transformPerspective: 1200
          });
          gsap.set(barRefs.current, { scaleY: 0, transformOrigin: 'top' });
          gsap.set(lockRefs.current, { autoAlpha: 0, x: -30 });
          
          // Ensure all descriptions start hidden so GSAP has full control
          gsap.set(q(`.${styles.desc}`), { autoAlpha: 0 });
          gsap.set(q(`.${styles.descTitle}`), { autoAlpha: 0, x: -20 });
          gsap.set(q(`.${styles.descLine}`), { autoAlpha: 0, x: -10 });
        }

        // ── 2. HEADLINE NARRATIVE ──
        const words = headlineRef.current.querySelectorAll('span');
        gsap.to(words, {
          autoAlpha: 1,
          y: 0,
          rotateX: 0,
          stagger: 0.04,
          duration: 1.4,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: headlineRef.current,
            start: 'top 85%',
          }
        });

        if (!isDesktop) {
          // Mobile: Cards just animate up as you scroll to them.
          // CSS handles the text visibility directly.
          cardRefs.current.forEach((card, i) => {
            if (!card) return;
            gsap.fromTo(card, 
              { y: 60, autoAlpha: 0 },
              {
                scrollTrigger: {
                  trigger: card,
                  start: 'top 90%',
                  toggleActions: 'play none none none',
                },
                y: 0,
                autoAlpha: 1,
                duration: 0.9,
                ease: 'power3.out',
              }
            );
          });
          return;
        }

        // ── 3. CORE 3D SEQUENCE (THE NARRATIVE STACK) ──
        const mainTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: '+=450%',
            pin: true,
            scrub: 1.2,
            anticipatePin: 1,
            onUpdate: (self) => {
              const progress = self.progress;
              // Map progress precisely to active index for the vertical progress bar
              const idx = gsap.utils.clamp(0, LAYERS.length - 1, Math.floor(progress * LAYERS.length));
              if (idx !== activeIdx) setActiveIdx(idx);
              
              gsap.to(sectionRef.current, {
                '--layer-color': LAYERS[idx].color,
                duration: 0.6,
                overwrite: 'auto'
              });
            },
          },
        });

        LAYERS.forEach((_, i) => {
          const card = cardRefs.current[i];
          const bar = barRefs.current[i];
          const lock = lockRefs.current[i];
          
          // Selectors strictly scoped to the current layer index
          const descBox = q(`.${styles.desc}`)[i];
          const descTitle = q(`.${styles.descTitle}`)[i];
          const descLines = q(`.${styles.desc}:nth-child(${i + 1}) .${styles.descLine}`);

          // Added extra spacing multiplier to give text time to be read
          const startTime = i * 2.8; 

          mainTimeline.addLabel(`layer-${i}`, startTime);
          
          // --- ENTRANCE NARRATIVE ---
          
          // 1. Reveal Text Container & Title
          mainTimeline.to(descBox, { autoAlpha: 1, duration: 0.1 }, `layer-${i}`)
                      .to(descTitle, { autoAlpha: 1, x: 0, duration: 0.6, ease: 'power3.out' }, `layer-${i}`);
          
          // 2. Text lines slide in sequentially (Line by Line)
          mainTimeline.to(descLines, { 
            autoAlpha: 1, x: 0, stagger: 0.15, duration: 0.8, ease: 'power2.out' 
          }, `layer-${i}+=0.3`);

          // 3. As text finishes revealing, the card slides in
          mainTimeline.to(card, { 
            y: 0, autoAlpha: 1, scale: 1, rotationX: 0, filter: 'blur(0px)', duration: 1.2, ease: 'power4.out' 
          }, `layer-${i}+=0.8`)
          
          // 4. The security lock bar grows and lock text hits
          .to(bar, { scaleY: 1, duration: 0.8, ease: 'expo.out' }, `layer-${i}+=1.2`)
          .to(lock, { autoAlpha: 1, x: 0, duration: 0.6, ease: 'back.out(1.5)' }, `layer-${i}+=1.4`);

          // --- EXIT NARRATIVE ---
          if (i < LAYERS.length - 1) {
            // Fade out current text before next one comes
            mainTimeline.to([descTitle, descLines], {
              autoAlpha: 0, x: -10, duration: 0.4, ease: 'power2.in', stagger: 0.05
            }, `layer-${i}+=2.5`);
            
            mainTimeline.to(descBox, { autoAlpha: 0, duration: 0.1 }, `layer-${i}+=3.0`);

            // Push the card back into the 3D stack
            mainTimeline.to(card, {
              y: -50, z: -150, rotationX: -15, scale: 0.88, autoAlpha: 0.3, filter: 'blur(6px)', duration: 1.2, ease: 'power2.inOut'
            }, `layer-${i}+=2.6`);
          }

          // --- CASCADE EFFECT --- (Older cards go deeper)
          for (let j = 0; j < i; j++) {
            mainTimeline.to(cardRefs.current[j], {
              y: (i - j) * -40 - 50,
              z: (i - j) * -100 - 150,
              rotationX: (i - j) * -5 - 15,
              autoAlpha: Math.max(0.05, 0.3 / (i - j + 1)),
              scale: 0.88 - (i - j) * 0.05,
              filter: `blur(${6 + (i - j) * 2}px)`,
              duration: 1.2,
              ease: 'power2.inOut'
            }, `layer-${i}+=2.6`);
          }
        });

        // ── 4. FINAL CLOSURE ──
        mainTimeline.to(containerRef.current, {
          autoAlpha: 0,
          y: -120,
          scale: 0.95,
          filter: 'blur(20px)',
          duration: 1.5,
          ease: 'power3.in'
        }, '+=0.5');
      }
    );
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className={styles.section} id="architecture" data-scroll-section>
      <div className={`container ${styles.pinWrapper}`} ref={containerRef}>

        {/* ── Vertical Dashboard (Instrumentation) ── */}
        <div className={styles.progressIndicator}>
          <div className={styles.progressTrack} />
          <div 
            className={styles.progressFill} 
            style={{ 
              height: `${(activeIdx / (LAYERS.length - 1)) * 100}%`,
              transition: 'height 0.8s cubic-bezier(0.16, 1, 0.3, 1)' 
            }}
          />
          {LAYERS.map((_, i) => (
            <div 
              key={i} 
              className={`${styles.stepNum} ${activeIdx >= i ? styles.stepNumActive : ''}`}
            >
              0{i + 1}
            </div>
          ))}
        </div>

        {/* ── Narrative Column ── */}
        <div className={styles.leftCol}>
          <h2 className={styles.headline} ref={headlineRef}>
            {'Four locks. One fails, three remain. You can\'t break all four simultaneously.'.split(' ').map((word, i) => (
              <span key={i} style={{ display: 'inline-block', transform: 'translateY(50px) rotateX(-60deg)', margin: '0 0.25em 0 0' }}>
                {word}
              </span>
            ))}
          </h2>

          <div className={styles.descWrap}>
            {LAYERS.map((layer, i) => (
              <div key={i} className={`${styles.desc} ${activeIdx === i ? styles.descActive : ''}`}>
                <h3 className={styles.descTitle} style={{ color: layer.color }}>{layer.title}</h3>
                <div className={styles.descBodyWrap}>
                  {layer.body.split('\n').map((line, j) => (
                    <p key={j} className={styles.descLine}>{line || '\u00A0'}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── 3D Staging Area ── */}
        <div className={styles.rightCol}>
          {LAYERS.map((layer, i) => (
            <div key={i} className={styles.card} ref={el => cardRefs.current[i] = el}>
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
