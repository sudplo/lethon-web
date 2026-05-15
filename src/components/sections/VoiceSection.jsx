'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './VoiceSection.module.css';

gsap.registerPlugin(ScrollTrigger);

const dspStages = [
  { level: 0, label: "Plaintext", desc: "Original voice. Recognizable." },
  { level: 1, label: "Vocoder", desc: "Spectrally flattened." },
  { level: 2, label: "Ring Mod", desc: "Sidebands added." },
  { level: 3, label: "Pitch LFO", desc: "Pitch-shifted." },
  { level: 4, label: "Noise Inject", desc: "SNR lowered." },
  { level: 5, label: "CBR Masking", desc: "Constant bitrate. Silence sounds like speech." }
];

export default function VoiceSection() {
  const containerRef = useRef(null);
  const closingRef = useRef(null);
  const stageNumRef = useRef(null);   // animates the big digit
  const stageLabelRef = useRef(null);
  const stageDescRef = useRef(null);

  // Use a ref for internal intensity so ScrollTrigger can read it
  const intensityRef = useRef(0);
  const [intensity, setIntensity] = useState(0);

  // We animate the number display separately for smoothness
  const displayIntensity = useRef({ val: 0 });

  useEffect(() => {
    gsap.set(closingRef.current, { opacity: 0, filter: 'blur(10px)', y: 20 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: '+=280%',
        pin: true,
        scrub: 1.7,
        onUpdate: (self) => {
          const raw = self.progress * 5;
          const rounded = Math.min(5, Math.round(raw));

          // Smooth the big digit with a quick tween
          gsap.to(displayIntensity.current, {
            val: raw,
            duration: 0.16,
            ease: 'power2.out',
            onUpdate: () => {
              if (stageNumRef.current) {
                stageNumRef.current.textContent = Math.round(displayIntensity.current.val);
              }
            }
          });

          if (rounded !== intensityRef.current) {
            intensityRef.current = rounded;
            setIntensity(rounded);

            // Crossfade label + desc
            gsap.fromTo(
              [stageLabelRef.current, stageDescRef.current],
              { opacity: 0, y: 7, filter: 'blur(5px)' },
              { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.32, ease: 'power3.out' }
            );
          }
        }
      }
    });

    tl.to(closingRef.current, {
      opacity: 1,
      filter: 'blur(0px)',
      y: 0,
      duration: 0.95,
      ease: 'power3.out'
    }, 0.85);

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  // Deterministic random (no hydration mismatch)
  const getRandom = (seed) => {
    const x = Math.sin(seed * 9999) * 10000;
    return x - Math.floor(x);
  };

  const generateWaveform = (isOriginal, lvl) => {
    const bars = [];
    for (let i = 0; i < 40; i++) {
      let h = Math.sin(i * 0.4) * 50 + 50;
      if (!isOriginal) {
        if (lvl >= 1) h = h * 0.8 + 20;
        if (lvl >= 2) h += Math.cos(i * 1.5) * 20;
        if (lvl >= 3) h += Math.sin(i * 0.1) * 30;
        if (lvl >= 4) h += (getRandom(i + 1) - 0.5) * 40;
        if (lvl >= 5) h = 80 + (getRandom(i + 2) - 0.5) * 20;
      }
      const fh = Math.max(5, Math.min(100, h)).toFixed(2);
      bars.push(
        <div
          key={i}
          className={styles.bar}
          style={{
            height: `${fh}%`,
            opacity: isOriginal && lvl === 5 ? 0.2 : 1,
            transition: 'height 0.25s ease, opacity 0.4s ease',
          }}
        />
      );
    }
    return bars;
  };

  return (
    <section ref={containerRef} className={styles.voiceSection} id="voice">
      <div className="container">
        <h2 className={styles.headline}>
          The voice that leaves your device<br />
          isn't yours.
        </h2>

        <p className={styles.subhead}>
          Five stages. Before the audio reaches the network,<br />
          it stops being recognizable by voice analysis systems.
        </p>

        <div className={styles.interactiveArea}>
          {/* Intensity indicator */}
          <div className={styles.intensityDisplay}>
            <span ref={stageNumRef} className={styles.intensityNum}>0</span>
            <div className={styles.intensityMeta}>
              <span ref={stageLabelRef} className={styles.intensityLabel}>
                {dspStages[intensity].label}
              </span>
              <span ref={stageDescRef} className={styles.intensityDesc}>
                {dspStages[intensity].desc}
              </span>
            </div>
          </div>

          {/* Stage track */}
          <div className={styles.stageTrack}>
            {dspStages.map((s, i) => (
              <div
                key={i}
                className={`${styles.stageMarker} ${intensity >= i ? styles.stageActive : ''}`}
              >
                <div className={styles.stageMarkerDot} />
                <span className={styles.stageMarkerLabel}>{s.label}</span>
              </div>
            ))}
            <div
              className={styles.stageProgressLine}
              style={{ width: `${(intensity / 5) * 100}%`, transition: 'width 0.25s ease' }}
            />
          </div>

          {/* Waveforms */}
          <div className={styles.waveformsContainer}>
            <div className={styles.waveformBlock}>
              <div className={styles.waveLabel}>Original</div>
              <div className={styles.waveform}>
                {generateWaveform(true, intensity)}
              </div>
            </div>

            <div className={styles.waveformBlock}>
              <div className={`${styles.waveLabel} ${styles.waveLabelAccent}`}>
                Processed — Stage {intensity}
              </div>
              <div className={`${styles.waveform} ${styles.processedWaveform}`}>
                {generateWaveform(false, intensity)}
              </div>
            </div>
          </div>
        </div>

        <div ref={closingRef} className={styles.closingStatement}>
          <p>Encrypted wasn't enough.</p>
          <p>Unrecognizable is the goal.</p>
          <br />
          <p className={styles.closingSmall}>
            No analysis system can derive a voice print from the output.<br />
            That's not security theater.<br />
            That's a different layer of privacy.
          </p>
        </div>
      </div>
    </section>
  );
}