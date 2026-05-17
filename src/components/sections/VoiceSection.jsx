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

const BAR_COUNT = 36;

/* Deterministic pseudo-random (no hydration mismatch) */
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
  const numRef = useRef(null);
  const labelRef = useRef(null);
  const descRef = useRef(null);
  const closingRef = useRef(null);
  const stageRef = useRef({ val: 0 });
  const [stage, setStage] = useState(0);
  const stageValueRef = useRef(0);

  useGSAP(() => {
    gsap.set(closingRef.current, { autoAlpha: 0, filter: 'blur(8px)', y: 16 });

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
          /* Mobile: simple reveal on scroll */
          gsap.to(closingRef.current, {
            scrollTrigger: {
              trigger: closingRef.current,
              start: 'top 88%',
              toggleActions: 'play none none none',
            },
            autoAlpha: 1,
            filter: 'blur(0px)',
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
          });
          return;
        }

        /* Desktop: scrub-driven */
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 52%',
            end: 'bottom 24%',
            scrub: reduceMotion ? false : 0.75,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const raw = self.progress * 5;
              const rounded = Math.min(5, Math.round(raw));

              /* Smooth counter using GSAP for the number display */
              gsap.to(stageRef.current, {
                val: raw,
                duration: 0.15,
                ease: 'power2.out',
                onUpdate: () => {
                  if (numRef.current) numRef.current.textContent = Math.round(stageRef.current.val);
                },
              });

              /* Update React state only when stage changes to avoid unnecessary re-renders */
              if (rounded !== stageValueRef.current) {
                stageValueRef.current = rounded;
                setStage(rounded);

                gsap.fromTo(
                  [labelRef.current, descRef.current],
                  { autoAlpha: 0, y: 6, filter: 'blur(4px)' },
                  { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.3, ease: 'power3.out', overwrite: true }
                );
              }
            },
          },
        });

        tl.to(closingRef.current, {
          autoAlpha: 1,
          filter: 'blur(0px)',
          y: 0,
          duration: 0.9,
          ease: 'power3.out',
        }, 0.85);
      }
    );
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className={styles.section} id="voice" data-scroll-section>
      <div className="container">
        <h2 className={styles.headline}>
          The voice that leaves your device<br />
          isn&apos;t yours.
        </h2>

        <p className={styles.sub}>
          Five stages. Before audio reaches the network,<br />
          it stops being recognizable by voice analysis systems.
        </p>

        <div className={styles.card} data-gsap-scan>
          {/* Intensity indicator */}
          <div className={styles.intensityRow}>
            <span ref={numRef} className={styles.intensityNum}>0</span>
            <div className={styles.intensityMeta}>
              <span ref={labelRef} className={styles.stageLabel}>{STAGES[stage].label}</span>
              <span ref={descRef} className={styles.stageDesc}>{STAGES[stage].desc}</span>
            </div>
          </div>

          {/* Stage track */}
          <div className={styles.track}>
            <div
              className={styles.trackFill}
              style={{ width: `${(stage / 5) * 100}%` }}
            />
            {STAGES.map((s, i) => (
              <div key={i} className={`${styles.marker} ${stage >= i ? styles.markerActive : ''}`}>
                <div className={styles.markerDot} />
                <span className={styles.markerLabel}>{s.label}</span>
              </div>
            ))}
          </div>

          {/* Waveforms */}
          <div className={styles.waveforms}>
            <div className={styles.waveBlock}>
              <div className={styles.waveLabel}>Original</div>
              <div className={styles.waveform}>
                {Array.from({ length: BAR_COUNT }, (_, i) => (
                  <div
                    key={i}
                    className={styles.bar}
                    style={{
                      height: `${computeBar(i, true, 0).toFixed(4)}%`,
                      opacity: stage === 5 ? '0.18' : '1',
                    }}
                  />
                ))}
              </div>
            </div>

            <div className={styles.waveBlock}>
              <div className={`${styles.waveLabel} ${styles.waveLabelAccent}`}>
                Processed - Stage {stage}
              </div>
              <div className={styles.waveform}>
                {Array.from({ length: BAR_COUNT }, (_, i) => (
                  <div
                    key={i}
                    className={`${styles.bar} ${styles.barProcessed}`}
                    style={{ height: `${computeBar(i, false, stage).toFixed(4)}%` }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div ref={closingRef} className={styles.closing}>
          <p>Encrypted wasn&apos;t enough.</p>
          <p>Unrecognizable is the goal.</p>
          <p className={styles.closingSub}>
            No analysis system can derive a voice print from the output.<br />
            That&apos;s not security theater. That&apos;s a different layer of privacy.
          </p>
        </div>
      </div>
    </section>
  );
}
