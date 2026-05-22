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

function renderCellVal(val) {
  if (!val) return null;
  const trimmed = val.trim();

  const CheckIcon = () => (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.badgeIcon}>
      <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  const CrossIcon = () => (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.badgeIcon}>
      <path d="M9 3L3 9M3 3L9 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  const WarningIcon = () => (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.badgeIcon}>
      <path d="M6 8V6M6 4H6.01M10.5 6C10.5 8.48528 8.48528 10.5 6 10.5C3.51472 10.5 1.5 8.48528 1.5 6C1.5 3.51472 3.51472 1.5 6 1.5C8.48528 1.5 10.5 3.51472 10.5 6Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  if (trimmed.startsWith('✓')) {
    const text = trimmed.slice(1).trim();
    return (
      <span className={`${styles.badge} ${styles.badgeCheck}`}>
        <span className={styles.badgeLed} />
        <CheckIcon />
        {text ? <span className={styles.badgeText}>{text}</span> : <span className={styles.badgeText}>Yes</span>}
      </span>
    );
  }

  if (trimmed.startsWith('✗')) {
    const text = trimmed.slice(1).trim();
    return (
      <span className={`${styles.badge} ${styles.badgeCross}`}>
        <span className={styles.badgeLed} />
        <CrossIcon />
        {text ? <span className={styles.badgeText}>{text}</span> : <span className={styles.badgeText}>No</span>}
      </span>
    );
  }

  if (trimmed.startsWith('~')) {
    const text = trimmed.slice(1).trim();
    return (
      <span className={`${styles.badge} ${styles.badgePartial}`}>
        <span className={styles.badgeLed} />
        <WarningIcon />
        {text ? <span className={styles.badgeText}>{text}</span> : <span className={styles.badgeText}>Partial</span>}
      </span>
    );
  }

  return <span className={styles.badgeRaw}>{val}</span>;
}

export default function CompareSection() {
  const sectionRef = useRef(null);
  const rowRefs = useRef([]);
  const lethonRefs = useRef([]);
  const scanlineRef = useRef(null);
  const tableRef = useRef(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();

    gsap.set(rowRefs.current, { autoAlpha: 0, x: -20, filter: 'blur(10px)' });
    gsap.set(lethonRefs.current, { backgroundColor: 'transparent' });

    mm.add(
      {
        isDesktopTall: '(min-width: 901px) and (min-height: 801px)',
        isDesktopShort: '(min-width: 901px) and (max-height: 800px)',
        isMobile: '(max-width: 900px)',
      },
      (context) => {
        const { isDesktopTall, isDesktopShort, isMobile } = context.conditions;

        if (isMobile) {
          gsap.set(rowRefs.current, { autoAlpha: 1, x: 0, filter: 'blur(0px)' });
          
          const cards = gsap.utils.toArray(`.${styles.card}`, sectionRef.current);
          gsap.set(cards, { autoAlpha: 0, y: 35, filter: 'blur(6px)' });

          ScrollTrigger.batch(cards, {
            start: 'top 92%',
            once: true,
            onEnter: (batch) => gsap.to(batch, {
              autoAlpha: 1,
              y: 0,
              filter: 'blur(0px)',
              duration: 0.6,
              stagger: 0.12,
              ease: 'power3.out',
              overwrite: 'auto',
            }),
          });
          return;
        }

        if (isDesktopTall) {
          const badges = gsap.utils.toArray(`.${styles.badge}`, tableRef.current);
          gsap.set(badges, { scale: 0.5, autoAlpha: 0 });

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: tableRef.current,
              start: 'top 65%',
              end: 'bottom 20%',
              scrub: 1,
            },
          });

          tl.to(rowRefs.current, {
            autoAlpha: 1,
            x: 0,
            filter: 'blur(0px)',
            stagger: 0.08,
            duration: 1,
            ease: 'power3.out'
          });

          tl.fromTo(scanlineRef.current, 
            { top: '0%', autoAlpha: 0 },
            { top: '100%', autoAlpha: 1, duration: 4, ease: 'none' },
            '+=0.1'
          );

          rowRefs.current.forEach((row, i) => {
            if (!row) return;
            const rowBadges = gsap.utils.toArray(`.${styles.badge}`, row);
            
            tl.to(rowBadges, {
              scale: 1,
              autoAlpha: 1,
              stagger: 0.05,
              duration: 0.4,
              ease: 'back.out(1.5)',
            }, `<+=${(i / ROWS.length) * 4}`);
          });

          lethonRefs.current.forEach((el, i) => {
            if (!el) return;
            tl.to(el, {
              backgroundColor: 'rgba(0, 245, 160, 0.03)',
              duration: 0.2,
              ease: 'power2.inOut'
            }, `<+=${(i / ROWS.length) * 4}`);
          });

          tl.to(scanlineRef.current, { autoAlpha: 0, duration: 0.5 });
        } else if (isDesktopShort) {
          const badges = gsap.utils.toArray(`.${styles.badge}`, tableRef.current);
          gsap.set(badges, { scale: 0.5, autoAlpha: 0 });

          // Desktop Short (e.g. laptop): One-shot entry animation without pinning/scrubbing to prevent cutoffs
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: tableRef.current,
              start: 'top 80%',
              toggleActions: 'play none none none',
            },
          });

          tl.to(rowRefs.current, {
            autoAlpha: 1,
            x: 0,
            filter: 'blur(0px)',
            stagger: 0.05,
            duration: 0.7,
            ease: 'power3.out'
          });

          tl.fromTo(scanlineRef.current, 
            { top: '0%', autoAlpha: 0 },
            { top: '100%', autoAlpha: 1, duration: 1.5, ease: 'power2.inOut' },
            '-=0.4'
          );

          rowRefs.current.forEach((row, i) => {
            if (!row) return;
            const rowBadges = gsap.utils.toArray(`.${styles.badge}`, row);
            
            tl.to(rowBadges, {
              scale: 1,
              autoAlpha: 1,
              stagger: 0.04,
              duration: 0.3,
              ease: 'back.out(1.5)',
            }, `<+=${(i / ROWS.length) * 1.5}`);
          });

          lethonRefs.current.forEach((el, i) => {
            if (!el) return;
            tl.to(el, {
              backgroundColor: 'rgba(0, 245, 160, 0.03)',
              duration: 0.15,
              ease: 'power1.inOut'
            }, `<+=${(i / ROWS.length) * 1.5}`);
          });

          tl.to(scanlineRef.current, { autoAlpha: 0, duration: 0.3 });
        }
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
                    {renderCellVal(row.lethon)}
                    {row.tip && <span className={styles.tip}>{row.tip}</span>}
                  </td>
                  <td className={styles.otherCell}>{renderCellVal(row.briar)}</td>
                  <td className={styles.otherCell}>{renderCellVal(row.signal)}</td>
                  <td className={styles.otherCell}>{renderCellVal(row.wa)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile card stack view */}
        <div className={styles.cardStack}>
          {ROWS.map((row, i) => (
            <div
              key={i}
              className={`${styles.card} ${row.hl ? styles.cardHighlighted : ''}`}
            >
              <div className={styles.cardCap}>
                {row.hl ? <strong>{row.cap}</strong> : row.cap}
              </div>
              <div className={styles.cardLethon}>
                <span className={styles.cardLethonLabel}>Lethon</span>
                <span className={`${styles.cardLethonVal} ${row.audit ? styles.cardLethonAmber : ''}`}>
                  {renderCellVal(row.lethon)}
                </span>
              </div>
              <div className={styles.cardOthers}>
                <div className={styles.cardOther}>
                  <span className={styles.cardOtherLabel}>Briar</span>
                  <span>{renderCellVal(row.briar)}</span>
                </div>
                <div className={styles.cardOther}>
                  <span className={styles.cardOtherLabel}>Signal</span>
                  <span>{renderCellVal(row.signal)}</span>
                </div>
                <div className={styles.cardOther}>
                  <span className={styles.cardOtherLabel}>WhatsApp</span>
                  <span>{renderCellVal(row.wa)}</span>
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
