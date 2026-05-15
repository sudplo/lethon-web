'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './CompareSection.module.css';

gsap.registerPlugin(ScrollTrigger);

const tableData = [
  { cap: "E2E encryption", lethon: "✓ Bramble+MLS", briar: "✓", signal: "✓", wa: "~" },
  { cap: "No central server", lethon: "✓ 100%", briar: "✓", signal: "✗", wa: "✗" },
  { cap: "Metadata protection", lethon: "✓ Ephemeral topics + Tor", briar: "✓ Tor", signal: "~ Partial", wa: "✗", highlight: true },
  { cap: "IP hidden", lethon: "✓ Tor+I2P", briar: "✓ Tor", signal: "✗", wa: "✗" },
  { cap: "Groups with perms", lethon: "✓ Client-enforced RBAC", briar: "✗ Small groups only", signal: "✓ Server-enforced", wa: "✓ Server", highlight: true, tooltip: "Owner/Admin/Member enforced by Ed25519 signatures" },
  { cap: "Offline-first", lethon: "✓ Full sync on reconnect", briar: "✓ Bluetooth offline", signal: "✗", wa: "✗", highlight: true },
  { cap: "Anti-voice-biometric", lethon: "✓ DSP pipeline", briar: "✗", signal: "✗", wa: "✗" },
  { cap: "No phone number", lethon: "✓", briar: "✓", signal: "✗", wa: "✗" },
  { cap: "Large communities", lethon: "✓ GossipSub mesh", briar: "✗", signal: "✓ Server sync", wa: "✓ Server" },
  { cap: "Independent audit", lethon: "✗", briar: "✓ 2023", signal: "✓ Multiple", wa: "✗", isAudit: true }
];

export default function CompareSection() {
  const containerRef = useRef(null);
  const rowsRef = useRef([]);
  const lethonCellsRef = useRef([]);
  const scanlineRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "center center",
        end: "+=400%", // 4 viewports to scroll through the table
        pin: true,
        scrub: 1.5, // heavy scrub
      }
    });

    // Initial state
    gsap.set(rowsRef.current, { opacity: 0, y: 20, filter: 'blur(5px)' });
    gsap.set(lethonCellsRef.current, { opacity: 0, x: -10, filter: 'blur(5px)' });
    gsap.set(scanlineRef.current, { top: 0, opacity: 0 });

    // Animate rows down
    rowsRef.current.forEach((row, i) => {
      tl.to(row, {
        y: 0,
        opacity: 1,
        filter: 'blur(0px)',
        duration: 1,
        ease: "expo.out"
      }, i * 0.5); // stagger by 0.5 timeline seconds

      tl.to(lethonCellsRef.current[i], {
        x: 0,
        opacity: 1,
        filter: 'blur(0px)',
        duration: 1,
        ease: "power3.out"
      }, i * 0.45 + 0.15);
    });

    // Scanline effect con timing profesional
    const totalTime = rowsRef.current.length * 0.45;
    
    tl.to(scanlineRef.current, {
      opacity: 1,
      duration: 0.4
    }, totalTime + 0.5)
    .to(scanlineRef.current, {
      top: "100%",
      duration: 2.8,
      ease: "power2.inOut"
    }, totalTime + 0.5)
    .to(scanlineRef.current, {
      opacity: 0,
      duration: 0.45
    }, totalTime + 3.3);

    // Pausa final para leer la tabla
    tl.to({}, { duration: 1.5 });

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <section ref={containerRef} className={styles.compareSection} id="compare">
      <div className="container">
        <div className={styles.header}>
          <h2>
            The complete picture.<br />
            Where architecture meets reality.
          </h2>
        </div>

        <div className={styles.tableContainer}>
          <div className={styles.scanline} ref={scanlineRef}></div>
          
          <div className={styles.tableHeader}>
            <div className={styles.colCap}>Capability</div>
            <div className={styles.colLethon}>Lethon</div>
            <div className={styles.colOther}>Briar</div>
            <div className={styles.colOther}>Signal</div>
            <div className={styles.colOther}>WhatsApp</div>
          </div>

          <div className={styles.tableBody}>
            {tableData.map((row, i) => (
              <div 
                key={i} 
                className={`${styles.tableRow} ${row.highlight ? styles.highlightedRow : ''}`}
                ref={el => rowsRef.current[i] = el}
              >
                <div className={styles.colCap}>
                  {row.highlight ? <strong>{row.cap}</strong> : row.cap}
                </div>
                
                <div 
                  className={`${styles.colLethon} ${styles.tooltipContainer}`}
                  ref={el => lethonCellsRef.current[i] = el}
                >
                  <span className={row.isAudit ? styles.amberText : styles.accentText}>
                    {row.lethon}
                  </span>
                  {row.tooltip && (
                    <div className={styles.tooltip}>{row.tooltip}</div>
                  )}
                </div>
                
                <div className={styles.colOther}>{row.briar}</div>
                <div className={styles.colOther}>{row.signal}</div>
                <div className={styles.colOther}>{row.wa}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
