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
  { cap: 'Groups with perms', lethon: '✓ Client-enforced RBAC', briar: '✗ Small groups', signal: '✓ Server', wa: '✓', hl: true, tip: 'Owner/Admin/Member via Ed25519 signatures' },
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
  const cardRefs = useRef([]);

  useGSAP(() => {
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
          /* Mobile: stagger-reveal each card */
          cardRefs.current.forEach((card, i) => {
            if (!card) return;
            gsap.from(card, {
              scrollTrigger: {
                trigger: card,
                start: 'top 90%',
                toggleActions: 'play none none none',
              },
              y: 30,
              autoAlpha: 0,
              duration: 0.6,
              delay: i * 0.04,
              ease: 'power3.out',
            });
          });
          return;
        }

        /* Desktop: scrub-driven table reveal */
        rowRefs.current.forEach(r => r && gsap.set(r, { autoAlpha: 0, y: 18, filter: 'blur(4px)' }));
        lethonRefs.current.forEach(r => r && gsap.set(r, { autoAlpha: 0, x: -8, filter: 'blur(4px)' }));
        gsap.set(scanlineRef.current, { top: 0, autoAlpha: 0 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 52%',
            end: 'bottom 22%',
            scrub: reduceMotion ? false : 0.75,
            invalidateOnRefresh: true,
          },
        });

        ROWS.forEach((_, i) => {
          tl.to(rowRefs.current[i], {
            autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.9, ease: 'expo.out',
          }, i * 0.48);
          tl.to(lethonRefs.current[i], {
            autoAlpha: 1, x: 0, filter: 'blur(0px)', duration: 0.9, ease: 'power3.out',
          }, i * 0.44 + 0.12);
        });

        const endTime = ROWS.length * 0.48;

        tl.to(scanlineRef.current, { autoAlpha: 1, duration: 0.35 }, endTime + 0.3)
          .to(scanlineRef.current, { top: '100%', duration: 2.6, ease: 'power2.inOut' }, endTime + 0.3)
          .to(scanlineRef.current, { autoAlpha: 0, duration: 0.35 }, endTime + 2.95)
          .to({}, { duration: 1.2 });
      }
    );
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className={styles.section} id="compare" data-scroll-section>
      <div className="container">
        <div className={styles.header}>
          <h2>The complete picture.<br />Where architecture meets reality.</h2>
        </div>

        {/* Desktop: full table */}
        <div className={styles.tableWrap} data-gsap-scan>
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

        {/* Mobile: card stack */}
        <div className={styles.cardStack}>
          {ROWS.map((row, i) => (
            <div
              key={i}
              ref={el => cardRefs.current[i] = el}
              className={`${styles.card} ${row.hl ? styles.cardHighlighted : ''}`}
            >
              <div className={styles.cardCap}>{row.cap}</div>
              <div className={styles.cardLethon}>
                <span className={styles.cardLethonLabel}>Lethon</span>
                <span className={`${styles.cardLethonVal} ${row.audit ? styles.cardLethonAmber : ''}`}>
                  {row.lethon}
                </span>
              </div>
              <div className={styles.cardOthers}>
                <div className={styles.cardOther}>
                  <span className={styles.cardOtherLabel}>Briar</span>
                  <span>{row.briar}</span>
                </div>
                <div className={styles.cardOther}>
                  <span className={styles.cardOtherLabel}>Signal</span>
                  <span>{row.signal}</span>
                </div>
                <div className={styles.cardOther}>
                  <span className={styles.cardOtherLabel}>WA</span>
                  <span>{row.wa}</span>
                </div>
              </div>
              {row.tip && <div className={styles.cardTip}>{row.tip}</div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
