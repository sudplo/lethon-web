'use client';

import { useRef, useState } from 'react';
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
      <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  const CrossIcon = () => (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.badgeIcon}>
      <path d="M9 3L3 9M3 3L9 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  const WarningIcon = () => (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.badgeIcon}>
      <path d="M6 8V6M6 4H6.01M10.5 6C10.5 8.48528 8.48528 10.5 6 10.5C3.51472 10.5 1.5 8.48528 1.5 6C1.5 3.51472 3.51472 1.5 6 1.5C8.48528 1.5 10.5 3.51472 10.5 6Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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
  
  const [systemStatus, setSystemStatus] = useState('STANDBY');
  const [activeTab, setActiveTab] = useState('briar'); // 'briar' | 'signal' | 'wa'

  // Mobile switch animation handler
  const cardContainerRef = useRef(null);
  const animateMobileSwitch = (tabName) => {
    setActiveTab(tabName);
    const competitorCards = gsap.utils.toArray(`.${styles.cardCompetitorVal}`, cardContainerRef.current);
    gsap.fromTo(competitorCards, 
      { autoAlpha: 0, y: 10, filter: 'blur(4px)' },
      { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.35, stagger: 0.04, ease: 'power2.out', overwrite: 'auto' }
    );
  };

  useGSAP(() => {
    const mm = gsap.matchMedia();

    // Initial setup to prevent flash of content before ScrollTrigger runs
    gsap.set(rowRefs.current, { autoAlpha: 0, x: -15, filter: 'blur(4px)' });
    gsap.set(lethonRefs.current, { backgroundColor: 'transparent' });
    if (scanlineRef.current) {
      gsap.set(scanlineRef.current, { top: '0%', autoAlpha: 0 });
    }

    mm.add(
      {
        isDesktopTall: '(min-width: 901px) and (min-height: 801px)',
        isDesktopShort: '(min-width: 901px) and (max-height: 800px)',
        isMobile: '(max-width: 900px)',
      },
      (context) => {
        const { isDesktopTall, isDesktopShort, isMobile } = context.conditions;

        if (isMobile) {
          // Mobile animation: Stagger in capability cards on scroll
          gsap.set(rowRefs.current, { autoAlpha: 1, x: 0, filter: 'blur(0px)' }); // clear row refs to prevent table bugs
          
          const cards = gsap.utils.toArray(`.${styles.mobileCard}`, sectionRef.current);
          gsap.set(cards, { autoAlpha: 0, y: 30, filter: 'blur(4px)' });

          ScrollTrigger.batch(cards, {
            start: 'top 92%',
            once: true,
            onEnter: (batch) => gsap.to(batch, {
              autoAlpha: 1,
              y: 0,
              filter: 'blur(0px)',
              duration: 0.55,
              stagger: 0.08,
              ease: 'power2.out',
              overwrite: 'auto',
            }),
          });
          return;
        }

        // Setup for Desktop Animations
        const badges = gsap.utils.toArray(`.${styles.badge}`, tableRef.current);
        gsap.set(badges, { scale: 0.6, autoAlpha: 0 });

        if (isDesktopTall) {
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top top',
              end: '+=150%',
              pin: true,
              scrub: 1,
              anticipatePin: 1,
            },
          });

          // System status state bindings in ScrollTrigger
          tl.to({}, {
            onStart: () => setSystemStatus('SCANNING_CAPABILITIES'),
            onReverseComplete: () => setSystemStatus('STANDBY'),
            duration: 0.1
          }, 0);

          // Laser scan line sweep (linear movement across 4.0 seconds)
          tl.fromTo(scanlineRef.current, 
            { top: '0%', autoAlpha: 0 },
            { top: '100%', autoAlpha: 1, duration: 4.0, ease: 'none' },
            0
          );

          // Synchronize each row reveal at the exact moment the scanline passes it
          rowRefs.current.forEach((row, i) => {
            if (!row) return;
            const rowTime = (i / ROWS.length) * 3.6; // spreads rows from 0s to 3.6s

            // Row reveals (fade, slide in, clear blur)
            tl.to(row, {
              autoAlpha: 1,
              x: 0,
              filter: 'blur(0px)',
              duration: 0.35,
              ease: 'power1.out'
            }, rowTime);

            // Badges inside the row scale up slightly after row begins revealing
            const rowBadges = gsap.utils.toArray(`.${styles.badge}`, row);
            tl.to(rowBadges, {
              scale: 1,
              autoAlpha: 1,
              stagger: 0.04,
              duration: 0.25,
              ease: 'back.out(1.4)'
            }, rowTime + 0.1);

            // Lethon cell glow background lights up
            if (lethonRefs.current[i]) {
              tl.to(lethonRefs.current[i], {
                backgroundColor: 'rgba(0, 245, 160, 0.025)',
                duration: 0.25,
                ease: 'sine.inOut'
              }, rowTime + 0.1);
            }
          });

          // Fade out the scanline at the bottom
          tl.to(scanlineRef.current, { autoAlpha: 0, duration: 0.4 }, 3.8);
          
          tl.to({}, {
            onStart: () => setSystemStatus('SECURED'),
            onReverseComplete: () => setSystemStatus('SCANNING_CAPABILITIES'),
            duration: 0.1
          }, 3.9);

        } else if (isDesktopShort) {
          // Compact / Laptop screens: Play standard entry animation once
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: tableRef.current,
              start: 'top 80%',
              toggleActions: 'play none none none',
            },
          });

          tl.to({}, {
            onStart: () => setSystemStatus('SCANNING_CAPABILITIES'),
            duration: 0.05
          });

          // Sweep scanline over 1.8s
          tl.fromTo(scanlineRef.current, 
            { top: '0%', autoAlpha: 0 },
            { top: '100%', autoAlpha: 1, duration: 1.8, ease: 'power2.inOut' },
            0
          );

          rowRefs.current.forEach((row, i) => {
            if (!row) return;
            const rowTime = (i / ROWS.length) * 1.5;

            tl.to(row, {
              autoAlpha: 1,
              x: 0,
              filter: 'blur(0px)',
              duration: 0.3,
              ease: 'power1.out'
            }, rowTime);

            const rowBadges = gsap.utils.toArray(`.${styles.badge}`, row);
            tl.to(rowBadges, {
              scale: 1,
              autoAlpha: 1,
              stagger: 0.03,
              duration: 0.2,
              ease: 'back.out(1.4)'
            }, rowTime + 0.08);

            if (lethonRefs.current[i]) {
              tl.to(lethonRefs.current[i], {
                backgroundColor: 'rgba(0, 245, 160, 0.025)',
                duration: 0.2,
                ease: 'sine.inOut'
              }, rowTime + 0.08);
            }
          });

          tl.to(scanlineRef.current, { autoAlpha: 0, duration: 0.3 }, 1.7);

          tl.to({}, {
            onStart: () => setSystemStatus('SECURED'),
            duration: 0.05
          }, 1.8);
        }
      }
    );
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className={styles.section} id="compare" data-scroll-section>
      <div className="container">
        
        {/* Header HUD */}
        <div className={styles.header}>
          <div className={styles.headerTop}>
            <div className={styles.systemTag}>
              <span className={styles.tagDot} />
              COMPARATIVE MATRIX
            </div>
            <div className={`${styles.statusConsole} ${systemStatus === 'SECURED' ? styles.statusConsoleSecured : ''}`}>
              <span className={styles.consolePulse} />
              <span className={styles.consoleText}>
                SYS_STATUS: <span className={styles.consoleVal}>{systemStatus}</span>
              </span>
            </div>
          </div>
          <h2>
            The complete picture.<br />
            Where architecture meets reality.
          </h2>
        </div>

        {/* Desktop HUD Table */}
        <div className={styles.tableWrap} ref={tableRef}>
          {/* HUD Corner Plus signs */}
          <span className={`${styles.cornerMarker} ${styles.cornerTL}`}>+</span>
          <span className={`${styles.cornerMarker} ${styles.cornerTR}`}>+</span>
          <span className={`${styles.cornerMarker} ${styles.cornerBL}`}>+</span>
          <span className={`${styles.cornerMarker} ${styles.cornerBR}`}>+</span>

          <div className={styles.scanline} ref={scanlineRef} aria-hidden="true" />

          <table className={styles.table}>
            <thead className={styles.thead}>
              <tr>
                <th>CAPABILITY</th>
                <th className={styles.colLethon}>
                  <div className={styles.lethonThContent}>
                    <span className={styles.lethonTitle}>LETHON</span>
                    <span className={styles.lethonSubtitle}>MESH PROTOCOL</span>
                  </div>
                </th>
                <th className={styles.colOther}>BRIAR</th>
                <th className={styles.colOther}>SIGNAL</th>
                <th className={styles.colOther}>WHATSAPP</th>
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
                    {row.hl ? <strong className={styles.capHighlight}>{row.cap}</strong> : row.cap}
                  </td>
                  <td
                    ref={el => lethonRefs.current[i] = el}
                    className={`${styles.lethonCell} ${row.audit ? styles.lethonCellAmber : ''}`}
                  >
                    <div className={styles.cellContent}>
                      {renderCellVal(row.lethon)}
                      {row.tip && <span className={styles.tip}>{row.tip}</span>}
                    </div>
                  </td>
                  <td className={styles.otherCell}>{renderCellVal(row.briar)}</td>
                  <td className={styles.otherCell}>{renderCellVal(row.signal)}</td>
                  <td className={styles.otherCell}>{renderCellVal(row.wa)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Interactive Console */}
        <div className={styles.mobileConsole} ref={cardContainerRef}>
          {/* Competitor tabs */}
          <div className={styles.tabsHeader}>
            <span className={styles.compareLabel}>COMPARE LETHON WITH:</span>
            <div className={styles.tabGroup}>
              <button 
                onClick={() => animateMobileSwitch('briar')}
                className={`${styles.tabButton} ${activeTab === 'briar' ? styles.tabActive : ''}`}
              >
                BRIAR
              </button>
              <button 
                onClick={() => animateMobileSwitch('signal')}
                className={`${styles.tabButton} ${activeTab === 'signal' ? styles.tabActive : ''}`}
              >
                SIGNAL
              </button>
              <button 
                onClick={() => animateMobileSwitch('wa')}
                className={`${styles.tabButton} ${activeTab === 'wa' ? styles.tabActive : ''}`}
              >
                WHATSAPP
              </button>
            </div>
          </div>

          {/* Capability Cards Stack */}
          <div className={styles.cardStack}>
            {ROWS.map((row, i) => {
              // Extract active competitor value
              let competitorVal = '';
              if (activeTab === 'briar') competitorVal = row.briar;
              else if (activeTab === 'signal') competitorVal = row.signal;
              else if (activeTab === 'wa') competitorVal = row.wa;

              const activeTabLabel = activeTab === 'briar' ? 'Briar' : activeTab === 'signal' ? 'Signal' : 'WhatsApp';

              return (
                <div 
                  key={i} 
                  className={`${styles.mobileCard} ${row.hl ? styles.cardHighlighted : ''}`}
                >
                  <div className={styles.cardCapHeader}>
                    <span className={styles.cardCapIndex}>[{String(i + 1).padStart(2, '0')}]</span>
                    <span className={styles.cardCapTitle}>{row.cap}</span>
                  </div>

                  <div className={styles.cardGrid}>
                    {/* Lethon column */}
                    <div className={styles.cardColumnLethon}>
                      <span className={styles.cardColLabel}>LETHON</span>
                      <div className={`${styles.cardValWrap} ${row.audit ? styles.lethonAmberVal : ''}`}>
                        {renderCellVal(row.lethon)}
                      </div>
                    </div>

                    {/* Competitor column */}
                    <div className={styles.cardColumnCompetitor}>
                      <span className={styles.cardColLabel}>{activeTabLabel.toUpperCase()}</span>
                      <div className={styles.cardCompetitorVal}>
                        {renderCellVal(competitorVal)}
                      </div>
                    </div>
                  </div>

                  {row.tip && (
                    <div className={styles.cardAccordionTip}>
                      <span className={styles.tipIcon}>i</span>
                      <span className={styles.tipText}>{row.tip}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
