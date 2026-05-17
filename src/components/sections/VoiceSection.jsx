'use client';

import { useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import styles from './VoiceSection.module.css';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const STAGES = [
  { label: 'Plaintext', desc: 'Original voice. Recognizable.' },
  { label: 'Vocoder', desc: 'Spectrally flattened.' },
  { label: 'Ring Mod', desc: 'Sidebands added.' },
  { label: 'Pitch LFO', desc: 'Pitch-shifted.' },
  { label: 'Noise Inject', desc: 'SNR lowered.' },
  { label: 'CBR Masking', desc: 'Constant bitrate. Silence = speech.' },
];

const BAR_COUNT = 48; // Increased for higher resolution
const rng = (seed) => {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
};

function computeBar(i, isOriginal, lvl) {
  let h = Math.sin(i * 0.38) * 48 + 50;
  if (!isOriginal) {
    if (lvl >= 1) h = h * 0.78 + 18;
    if (lvl >= 2) h += Math.cos(i * 1.4) * 22;
    if (lvl >= 3) h += Math.sin(i * 0.09) * 28;
    if (lvl >= 4) h += (rng(i + 7) - 0.5) * 38;
    if (lvl >= 5) h = 78 + (rng(i + 3) - 0.5) * 24;
  }
  return Math.max(4, Math.min(100, h));
}

export default function VoiceSection() {
  const sectionRef = useRef(null);
  const containerRef = useRef(null);
  const cardRef = useRef(null);
  const numRef = useRef(null);
  const labelRef = useRef(null);
  const descRef = useRef(null);
  const closingRef = useRef(null);
  const stageRef = useRef({ val: 0 });
  const [stage, setStage] = useState(0);
  const stageValueRef = useRef(0);

  useGSAP(() => {
    const q = gsap.utils.selector(sectionRef);
    const mm = gsap.matchMedia();

    // Initial states for refined entrance
    gsap.set(closingRef.current, { autoAlpha: 0, y: 40, filter: 'blur(12px)' });
    gsap.set(cardRef.current, { autoAlpha: 0, y: 60, scale: 0.98, boxShadow: '0 0 0 rgba(0,245,160,0)' });

    mm.add(
      {
        isDesktop: '(min-width: 901px)',
        isMobile: '(max-width: 900px)',
      },
      (context) => {
        const { isDesktop } = context.conditions;

        if (!isDesktop) {
          gsap.set([cardRef.current, closingRef.current], { autoAlpha: 1, y: 0, scale: 1, filter: 'blur(0px)' });
          return;
        }

        // Entrance animation
        const entranceTl = gsap.timeline({
          scrollTrigger: {
            trigger: cardRef.current,
            start: 'top 85%',
          }
        });

        entranceTl.to(cardRef.current, {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 1.4,
          ease: 'expo.out',
        });

        // Main scrub timeline
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: '+=100%',
            scrub: 1,
            pin: true,
            anticipatePin: 1,
          },
        });

        tl.to(stageRef.current, {
          val: 5,
          duration: 10,
          ease: 'none',
          onUpdate: () => {
            const raw = stageRef.current.val;
            const rounded = Math.min(5, Math.round(raw));

            if (numRef.current) numRef.current.textContent = rounded;

            if (rounded !== stageValueRef.current) {
              stageValueRef.current = rounded;
              setStage(rounded);

              // Refined text transition
              gsap.fromTo(
                [labelRef.current, descRef.current],
                { autoAlpha: 0, y: 5, filter: 'blur(8px)' },
                { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.5, ease: 'power3.out', overwrite: 'auto' }
              );
              
              // Waveform reactive animation
              gsap.fromTo(q(`.${styles.barProcessed}`), 
                { scaleY: 1.3, opacity: 1, filter: 'brightness(1.5)' },
                { scaleY: 1, opacity: 1, filter: 'brightness(1)', duration: 0.6, stagger: { amount: 0.2, from: 'center' }, ease: 'expo.out' }
              );

              // Card intensity glow
              gsap.to(cardRef.current, {
                boxShadow: `0 0 ${20 + rounded * 10}px rgba(0, 245, 160, ${0.05 + rounded * 0.03})`,
                duration: 0.4
              });
            }
          },
        });

        tl.to(closingRef.current, {
          autoAlpha: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 2,
          ease: 'power4.out',
        }, '+=1');
      }
    );
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className={styles.section} id="voice" data-scroll-section>
      <div className="container" ref={containerRef}>
        <header className={styles.header}>
          <div className={styles.tag}>SIGNAL SECURITY</div>
          <h2 className={styles.headline}>
            The voice that leaves your device<br />
            <span>isn&apos;t yours.</span>
          </h2>

          <p className={styles.sub}>
            Five stages. Before audio reaches the network,<br />
            it stops being recognizable by voice analysis systems.
          </p>
        </header>

        <div className={styles.card} ref={cardRef}>
          <div className={styles.cardInner}>
            <div className={styles.intensityRow}>
              <div className={styles.numWrapper}>
                <span ref={numRef} className={styles.intensityNum}>0</span>
                <span className={styles.numLabel}>STAGE</span>
              </div>
              <div className={styles.intensityMeta}>
                <span ref={labelRef} className={styles.stageLabel}>{STAGES[stage].label}</span>
                <span ref={descRef} className={styles.stageDesc}>{STAGES[stage].desc}</span>
              </div>
            </div>

            <div className={styles.trackContainer}>
              <div className={styles.track}>
                <div
                  className={styles.trackFill}
                  style={{ 
                    width: `${((stage / 5) * 100).toFixed(4)}%`,
                  }}
                />
                {STAGES.map((s, i) => (
                  <div key={i} className={`${styles.marker} ${stage >= i ? styles.markerActive : ''}`}>
                    <div className={styles.markerDot} />
                  </div>
                ))}
              </div>
              <div className={styles.trackLabels}>
                {STAGES.map((s, i) => (
                  <span key={i} className={`${styles.markerLabel} ${stage === i ? styles.markerLabelActive : ''}`}>
                    {s.label}
                  </span>
                ))}
              </div>
            </div>

            <div className={styles.waveforms}>
              <div className={styles.waveBlock}>
                <div className={styles.waveHeader}>
                  <div className={styles.waveStatus}>
                    <span className={styles.statusDot} />
                    ORIGINAL INPUT
                  </div>
                </div>
                <div className={styles.waveform}>
                  {Array.from({ length: BAR_COUNT }, (_, i) => (
                    <div
                      key={i}
                      className={styles.bar}
                      style={{
                        height: `${computeBar(i, true, 0).toFixed(4)}%`,
                        opacity: stage === 5 ? '0.1' : (0.4 + (Math.sin(i * 0.2) * 0.2)).toFixed(4),
                      }}
                    />
                  ))}
                </div>
              </div>

              <div className={`${styles.waveBlock} ${styles.waveBlockActive}`}>
                <div className={styles.waveHeader}>
                  <div className={`${styles.waveStatus} ${styles.waveStatusAccent}`}>
                    <span className={styles.statusDotActive} />
                    LETHON PROCESSED
                  </div>
                  <div className={styles.stageIndicator}>LVL {stage}.0</div>
                </div>
                <div className={styles.waveform}>
                  {Array.from({ length: BAR_COUNT }, (_, i) => (
                    <div
                      key={i}
                      className={`${styles.bar} ${styles.barProcessed}`}
                      style={{ 
                        height: `${computeBar(i, false, stage).toFixed(4)}%`,
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div ref={closingRef} className={styles.closing}>
          <div className={styles.closingGrid}>
            <div className={styles.closingLeft}>
              <p>Encrypted wasn&apos;t enough.</p>
              <p className={styles.accentText}>Unrecognizable is the goal.</p>
            </div>
            <div className={styles.closingRight}>
              <p className={styles.closingSub}>
                No analysis system can derive a voice print from the output.<br />
                That&apos;s not security theater. That&apos;s a different layer of privacy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
