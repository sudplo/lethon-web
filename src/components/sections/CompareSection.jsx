'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import styles from './CompareSection.module.css';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const ROWS = [
  { cap: 'E2E encryption', lethon: '✓ Bramble+MLS', briar: '✓', signal: '✓', wa: '~', },
  { cap: 'No central server', lethon: '✓ 100%', briar: '✓', signal: '✗', wa: '✗', },
  { cap: 'Metadata protection', lethon: '✓ Ephemeral topics + Tor', briar: '✓ Tor', signal: '~ Partial', wa: '✗', hl: true },
  { cap: 'IP hidden', lethon: '✓ Tor + I2P', briar: '✓ Tor', signal: '✗', wa: '✗', },
  { cap: 'Groups with perms', lethon: '✓ Client-enforced RBAC', briar: '✗ Small groups', signal: '✓ Server', wa: '✓', hl: true, tip: 'Owner/Admin/Member' },
  { cap: 'Offline-first', lethon: '✓ Full sync on reconnect', briar: '✓ Bluetooth', signal: '✗', wa: '✗', hl: true },
  { cap: 'Anti-voice-biometric', lethon: '✓ DSP pipeline', briar: '✗', signal: '✗', wa: '✗', },
  { cap: 'No phone number', lethon: '✓', briar: '✓', signal: '✗', wa: '✗', },
  { cap: 'Large communities', lethon: '✓ GossipSub mesh', briar: '✗', signal: '✓ Server sync', wa: '✓', },
  { cap: 'Independent audit', lethon: '✗ Planned', briar: '✓ 2023', signal: '✓ Multiple', wa: '✗', audit: true },
];

export default function CompareSection() {
  const sectionRef = useRef(null);
  const rowRefs = useRef([]);
  const lethonRefs = useRef([]);
  const scanlineRef = useRef(null);
  const tableRef = useRef(null);

  useGSAP(() => {
    const q = gsap.utils.selector(sectionRef);
    const mm = gsap.matchMedia();

    gsap.set(rowRefs.current, { autoAlpha: 0, x: -20, filter: 'blur(10px)' });
    gsap.set(lethonRefs.current, { backgroundColor: 'transparent' });

    mm.add(
      {
        isDesktop: '(min-width: 901px)',
        isMobile: '(max-width: 900px)',
        reduceMotion: '(prefers-reduced-motion: reduce)',
      },
      (context) => {
        const { isDesktop, reduceMotion } = context.conditions;

        if (!isDesktop) {
          gsap.set(rowRefs.current, { autoAlpha: 1, x: 0, filter: 'blur(0px)' });
          return;
        }

        // ── SCANLINE TIMELINE ──
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: tableRef.current,
            start: 'top 60%',
            end: 'bottom 20%',
            scrub: 1,
          },
        });

        // 1. Entrance of the table
        tl.to(rowRefs.current, {
          autoAlpha: 1,
          x: 0,
          filter: 'blur(0px)',
          stagger: 0.1,
          duration: 1,
          ease: 'power3.out'
        });

        // 2. The Scanline "Analysis"
        tl.fromTo(scanlineRef.current, 
          { top: '0%', autoAlpha: 0 },
          { top: '100%', autoAlpha: 1, duration: 4, ease: 'none' },
          '+=0.2'
        );

        // 3. Highlighting Lethon as it's scanned
        lethonRefs.current.forEach((el, i) => {
          if (!el) return;
          tl.to(el, {
            backgroundColor: 'rgba(0, 245, 160, 0.05)',
            duration: 0.2,
            ease: 'power2.inOut'
          }, `<+=${(i / ROWS.length) * 4}`);
        });

        tl.to(scanlineRef.current, { autoAlpha: 0, duration: 0.5 });
      }
    );
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className={styles.section} id="compare" data-scroll-section>
      <div className="container">
        <div className={styles.header}>
          <h2>The complete picture.<br />Where architecture meets reality.</h2>
        </div>

        <div className={styles.tableWrap} ref={tableRef}>
          <div className={styles.scanline} ref={scanlineRef} aria-hidden="true" />

          <table className={styles.table}>
            <thead className={styles.thead}>
              <tr>
                <th>Capability</th>
                <th className={styles.colLethon}>Lethon</th>
                <th className={styles.colOther}>Briar</th>
                <th className={styles.colOther}>Signal</th>
                <th className={styles.colOther}>WhatsApp</th>
              </tr>
            </thead>
            <tbody className={styles.tbody}>
              {ROWS.map((row, i) => (
                <tr
                  key={i}
                  ref={el => rowRefs.current[i] = el}
                  className={row.hl ? styles.highlighted : ''}
                >
                  <td className={styles.capCell}>
                    {row.hl ? <strong>{row.cap}</strong> : row.cap}
                  </td>
                  <td
                    ref={el => lethonRefs.current[i] = el}
                    className={`${styles.lethonCell} ${row.audit ? styles.lethonCellAmber : ''}`}
                  >
                    {row.lethon}
                    {row.tip && <span className={styles.tip}>{row.tip}</span>}
                  </td>
                  <td className={styles.otherCell}>{row.briar}</td>
                  <td className={styles.otherCell}>{row.signal}</td>
                  <td className={styles.otherCell}>{row.wa}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
