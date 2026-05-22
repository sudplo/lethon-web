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
  
  // Mobile-specific refs for inline cards
  const cardMobileRefs = useRef([]);
  const barMobileRefs = useRef([]);
  const lockMobileRefs = useRef([]);

  const headlineRef = useRef(null);
  const [activeIdx, setActiveIdx] = useState(0);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    const q = gsap.utils.selector(sectionRef);

    mm.add(
      {
        isDesktopTall: '(min-width: 901px) and (min-height: 801px)',
        isMobileOrShort: '(max-width: 900px), (max-height: 800px)',
        reduceMotion: '(prefers-reduced-motion: reduce)',
      },
      (context) => {
        const { isDesktopTall, isMobileOrShort, reduceMotion } = context.conditions;

        if (reduceMotion) return;

        // ── 1. PREPARATION ──
        if (isDesktopTall) {
          gsap.set(cardRefs.current, { 
            y: 400, z: 0, rotationX: 10, autoAlpha: 0, scale: 0.9, filter: 'blur(15px)', transformPerspective: 1200
          });
          gsap.set(barRefs.current, { scaleY: 0, transformOrigin: 'top' });
          gsap.set(lockRefs.current, { autoAlpha: 0, x: -30 });
          
          // Ensure all descriptions start hidden so GSAP has full control
          gsap.set(q(`.${styles.desc}`), { autoAlpha: 0 });
          gsap.set(q(`.${styles.descTitle}`), { autoAlpha: 0, x: -20 });
          gsap.set(q(`.${styles.descLine}`), { autoAlpha: 0, x: -10 });
        } else if (isMobileOrShort) {
          gsap.set(q(`.${styles.desc}`), { autoAlpha: 0, y: 30, filter: 'blur(8px)' });
          gsap.set(cardMobileRefs.current, { autoAlpha: 0, y: 30, scale: 0.95, filter: 'blur(8px)' });
          gsap.set(barMobileRefs.current, { scaleY: 0, transformOrigin: 'top' });
          gsap.set(lockMobileRefs.current, { autoAlpha: 0, x: -20 });
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

        if (isMobileOrShort) {
          // Animate descriptions and their corresponding inline cards on scroll
          const descs = q(`.${styles.desc}`);
          descs.forEach((desc, i) => {
            if (!desc) return;
            
            const mobileCard = cardMobileRefs.current[i];
            const mobileBar = barMobileRefs.current[i];
            const mobileLock = lockMobileRefs.current[i];

            const tl = gsap.timeline({
              scrollTrigger: {
                trigger: desc,
                start: 'top 85%',
                toggleActions: 'play none none none',
              }
            });

            tl.to(desc, {
              autoAlpha: 1,
              y: 0,
              filter: 'blur(0px)',
              duration: 0.8,
              ease: 'power3.out'
            });

            if (mobileCard) {
              tl.to(mobileCard, {
                autoAlpha: 1,
                y: 0,
                scale: 1,
                filter: 'blur(0px)',
                duration: 0.8,
                ease: 'power3.out'
              }, '-=0.6');
            }

            if (mobileBar) {
              tl.to(mobileBar, {
                scaleY: 1,
                duration: 0.5,
                ease: 'power2.out'
              }, '-=0.4');
            }

            if (mobileLock) {
              tl.to(mobileLock, {
                autoAlpha: 1,
                x: 0,
                duration: 0.4,
                ease: 'back.out(1.5)'
              }, '-=0.2');
            }
          });
          return;
        }

        // ── 3. CORE 3D SEQUENCE (THE NARRATIVE STACK) ──
        const mainTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: '+=500%',
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            onUpdate: (self) => {
              const progress = self.progress;
              // Precise index calculation with slight buffer
              const idx = gsap.utils.clamp(0, LAYERS.length - 1, Math.floor(progress * LAYERS.length * 0.99));
              if (idx !== activeIdx) setActiveIdx(idx);
              
              gsap.to(sectionRef.current, {
                '--layer-color': LAYERS[idx].color,
                duration: 0.4,
                overwrite: 'auto'
              });
            },
          },
        });

        LAYERS.forEach((_, i) => {
          const card = cardRefs.current[i];
          const bar = barRefs.current[i];
          const lock = lockRefs.current[i];
          
          const descBox = q(`.${styles.desc}`)[i];
          const descTitle = q(`.${styles.descTitle}`)[i];
          const descLines = q(`.${styles.desc}:nth-child(${i + 1}) .${styles.descLine}`);

          // Give each layer a dedicated block of time
          const startTime = i * 4; 

          mainTimeline.addLabel(`layer-${i}`, startTime);
          
          // --- ENTRANCE ---
          mainTimeline
            .fromTo(descBox, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.1 }, `layer-${i}`)
            .fromTo(descTitle, { autoAlpha: 0, x: -30 }, { autoAlpha: 1, x: 0, duration: 0.8, ease: 'power3.out' }, `layer-${i}`)
            .fromTo(descLines, { autoAlpha: 0, x: -20 }, { 
              autoAlpha: 1, x: 0, stagger: 0.1, duration: 0.8, ease: 'power2.out' 
            }, `layer-${i}+=0.3`)
            .fromTo(card, { 
              y: 400, autoAlpha: 0, scale: 0.8, rotationX: 15, filter: 'blur(15px)'
            }, { 
              y: 0, autoAlpha: 1, scale: 1, rotationX: 0, filter: 'blur(0px)', duration: 1.2, ease: 'expo.out',
              immediateRender: false
            }, `layer-${i}+=0.5`)
            .fromTo(bar, { scaleY: 0 }, { scaleY: 1, duration: 0.8, ease: 'expo.out' }, `layer-${i}+=1.2`)
            .fromTo(lock, { autoAlpha: 0, x: -20 }, { autoAlpha: 1, x: 0, duration: 0.6, ease: 'back.out(1.5)' }, `layer-${i}+=1.4`);

          // --- PERSISTENCE --- (Keep it visible for a while)
          mainTimeline.to({}, { duration: 1.5 }, `layer-${i}+=2`);

          // --- EXIT --- (Only if not last layer)
          if (i < LAYERS.length - 1) {
            mainTimeline
              .to([descTitle, descLines], {
                autoAlpha: 0, x: 20, duration: 0.6, ease: 'power2.in', stagger: 0.05
              }, `layer-${i}+=3.5`)
              .to(descBox, { autoAlpha: 0, duration: 0.1 }, `layer-${i}+=4.1`)
              .to(card, {
                y: -60, z: -100, rotationX: -10, scale: 0.92, autoAlpha: 0.4, filter: 'blur(8px)', duration: 1, ease: 'power2.inOut'
              }, `layer-${i}+=3.8`);

            // Push ALL previous cards deeper
            for (let j = 0; j <= i; j++) {
              const prevCard = cardRefs.current[j];
              const depth = i - j + 1;
              mainTimeline.to(prevCard, {
                y: depth * -40 - 60,
                z: depth * -120 - 100,
                rotationX: depth * -8 - 10,
                autoAlpha: Math.max(0, 0.4 / (depth + 1)),
                scale: 0.92 - depth * 0.04,
                filter: `blur(${8 + depth * 3}px)`,
                duration: 1,
                ease: 'power2.inOut',
                immediateRender: false
              }, `layer-${i}+=3.8`);
            }
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
                
                {/* Mobile-only inline card */}
                <div className={styles.mobileCardContainer}>
                  <div className={styles.card} ref={el => cardMobileRefs.current[i] = el}>
                    <div
                      className={styles.cardBar}
                      ref={el => barMobileRefs.current[i] = el}
                      style={{ backgroundColor: layer.color }}
                    />
                    <div className={styles.cardBody}>
                      <h4 className={styles.cardTitle} style={{ color: layer.color }}>{layer.title}</h4>
                      <div className={styles.cardTags}>
                        {layer.tags.map((tag, j) => <span key={j} className="tag">{tag}</span>)}
                      </div>
                      <pre className={styles.cardLock} ref={el => lockMobileRefs.current[i] = el}>
                        {layer.lock}
                      </pre>
                    </div>
                  </div>
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
