'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import styles from './CommunitiesSection.module.css';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function CommunitiesSection() {
  const sectionRef = useRef(null);
  const headlineRef = useRef(null);
  
  // Centralized column refs
  const centralServerRef = useRef(null);
  const centralClientRef = useRef(null);
  const centralLineRef = useRef(null);
  const centralLogsRef = useRef([]);
  const centralBadgeRef = useRef(null);

  // Lethon column refs
  const lethonMeshRef = useRef(null);
  const lethonNodesRef = useRef([]);
  const lethonLinesRef = useRef([]);
  const lethonLogsRef = useRef([]);
  const lethonBadgeRef = useRef(null);

  useGSAP(() => {
    const q = gsap.utils.selector(sectionRef);
    const mm = gsap.matchMedia();

    // ── 1. INITIAL ANIMATION STATES ──
    const headlineWords = headlineRef.current.querySelectorAll(`.${styles.word}`);
    gsap.set(headlineWords, { autoAlpha: 0, y: 30, rotateX: -30 });
    
    // Centralized Initial State
    gsap.set(centralServerRef.current, { scale: 0.85, autoAlpha: 0, filter: 'blur(10px)' });
    gsap.set(centralClientRef.current, { scale: 0.85, autoAlpha: 0, filter: 'blur(10px)' });
    gsap.set(centralLineRef.current, { scaleY: 0, transformOrigin: 'top' });
    gsap.set(centralLogsRef.current, { autoAlpha: 0, y: 10 });
    gsap.set(centralBadgeRef.current, { scale: 0.8, autoAlpha: 0 });
    
    // Lethon Initial State
    gsap.set(lethonNodesRef.current, { scale: 0.85, autoAlpha: 0, filter: 'blur(10px)' });
    gsap.set(lethonLinesRef.current, { opacity: 0 });
    gsap.set(lethonLogsRef.current, { autoAlpha: 0, y: 10 });
    gsap.set(lethonBadgeRef.current, { scale: 0.8, autoAlpha: 0 });

    // ── 2. GLOBAL INFINITE LOOPS ──
    // Run these immediately so they are active as soon as sections compile/fade in
    gsap.fromTo(q(`.${styles.scanline}`), 
      { top: '0%' }, 
      { top: '100%', duration: 4, repeat: -1, ease: 'none' }
    );

    // Dashes flow loop
    gsap.fromTo(lethonLinesRef.current, 
      { strokeDashoffset: 24 }, 
      { strokeDashoffset: 0, duration: 1.2, repeat: -1, ease: 'none' }
    );

    // Server alarm pulse
    gsap.to(centralServerRef.current, {
      borderColor: 'rgba(239, 68, 68, 0.45)',
      boxShadow: '0 0 20px rgba(239, 68, 68, 0.2)',
      duration: 1.2,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });

    // P2P node heartbeats
    gsap.to(lethonNodesRef.current, {
      borderColor: 'rgba(0, 245, 160, 0.45)',
      boxShadow: '0 0 15px rgba(0, 245, 160, 0.15)',
      stagger: {
        each: 0.2,
        repeat: -1,
        yoyo: true
      },
      duration: 1.0,
      ease: 'sine.inOut'
    });

    // ── 3. LAYOUT SPECIFIC RESPONSIVE ANIMATIONS ──
    mm.add(
      {
        isDesktopTall: '(min-width: 901px) and (min-height: 801px)',
        isDesktopShort: '(min-width: 901px) and (max-height: 800px)',
        isMobile: '(max-width: 900px)',
        reduceMotion: '(prefers-reduced-motion: reduce)',
      },
      (context) => {
        const { isDesktopTall, isDesktopShort, isMobile, reduceMotion } = context.conditions;

        if (reduceMotion) {
          // Instant values for reduced motion
          gsap.set(headlineWords, { autoAlpha: 1, y: 0, rotateX: 0 });
          gsap.set([centralServerRef.current, centralClientRef.current], { scale: 1, autoAlpha: 1, filter: 'blur(0px)' });
          gsap.set(centralLineRef.current, { scaleY: 1 });
          gsap.set(centralLogsRef.current, { autoAlpha: 1, y: 0 });
          gsap.set(centralBadgeRef.current, { scale: 1, autoAlpha: 1 });

          gsap.set(lethonNodesRef.current, { scale: 1, autoAlpha: 1, filter: 'blur(0px)' });
          gsap.set(lethonLinesRef.current, { opacity: 0.8 });
          gsap.set(lethonLogsRef.current, { autoAlpha: 1, y: 0 });
          gsap.set(lethonBadgeRef.current, { scale: 1, autoAlpha: 1 });
          return;
        }

        // --- A. MOBILE VIEWPORTS ---
        if (isMobile) {
          gsap.to(headlineWords, {
            autoAlpha: 1,
            y: 0,
            rotateX: 0,
            stagger: 0.04,
            duration: 1.0,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: headlineRef.current,
              start: 'top 85%',
            }
          });

          // Single trigger timelines for mobile scroll flow
          const tlCentral = gsap.timeline({
            scrollTrigger: {
              trigger: centralClientRef.current,
              start: 'top 85%',
              toggleActions: 'play none none none',
            }
          });
          tlCentral
            .to(centralClientRef.current, { scale: 1, autoAlpha: 1, filter: 'blur(0px)', duration: 0.6, ease: 'back.out(1.2)' })
            .to(centralLineRef.current, { scaleY: 1, duration: 0.6, ease: 'power2.inOut' }, '-=0.25')
            .to(centralServerRef.current, { scale: 1, autoAlpha: 1, filter: 'blur(0px)', duration: 0.6, ease: 'back.out(1.2)' }, '-=0.3')
            .to(centralLogsRef.current, { autoAlpha: 1, y: 0, stagger: 0.12, duration: 0.45, ease: 'power2.out' }, '-=0.15')
            .to(centralBadgeRef.current, { scale: 1, autoAlpha: 1, duration: 0.7, ease: 'elastic.out(1, 0.6)' }, '-=0.1');

          const tlLethon = gsap.timeline({
            scrollTrigger: {
              trigger: lethonMeshRef.current,
              start: 'top 85%',
              toggleActions: 'play none none none',
            }
          });
          tlLethon
            .to(lethonNodesRef.current, { scale: 1, autoAlpha: 1, filter: 'blur(0px)', stagger: 0.1, duration: 0.6, ease: 'back.out(1.3)' })
            .to(lethonLinesRef.current, { opacity: 0.8, duration: 0.45 }, '-=0.4')
            .to(lethonLogsRef.current, { autoAlpha: 1, y: 0, stagger: 0.12, duration: 0.45, ease: 'power2.out' }, '-=0.2')
            .to(lethonBadgeRef.current, { scale: 1, autoAlpha: 1, duration: 0.7, ease: 'elastic.out(1, 0.6)' }, '-=0.1');

          return;
        }

        // --- B. COMPACT DESKTOP (LAPTOPS) ---
        if (isDesktopShort) {
          const tlShort = gsap.timeline({
            scrollTrigger: {
              trigger: headlineRef.current,
              start: 'top 85%',
              toggleActions: 'play none none none',
            }
          });

          tlShort
            .to(headlineWords, {
              autoAlpha: 1,
              y: 0,
              rotateX: 0,
              stagger: 0.04,
              duration: 1.0,
              ease: 'expo.out'
            })
            // Assemble Centralized Diagram
            .to(centralClientRef.current, { scale: 1, autoAlpha: 1, filter: 'blur(0px)', duration: 0.5, ease: 'back.out(1.2)' }, '-=0.4')
            .to(centralLineRef.current, { scaleY: 1, duration: 0.5, ease: 'power2.inOut' }, '-=0.25')
            .to(centralServerRef.current, { scale: 1, autoAlpha: 1, filter: 'blur(0px)', duration: 0.5, ease: 'back.out(1.2)' }, '-=0.35')
            .to(centralLogsRef.current, { autoAlpha: 1, y: 0, stagger: 0.1, duration: 0.4, ease: 'power2.out' }, '-=0.15')
            .to(centralBadgeRef.current, { scale: 1, autoAlpha: 1, duration: 0.6, ease: 'elastic.out(1, 0.6)' }, '-=0.1')
            // Assemble Lethon Diagram
            .to(lethonNodesRef.current, { scale: 1, autoAlpha: 1, filter: 'blur(0px)', stagger: 0.08, duration: 0.6, ease: 'back.out(1.3)' }, '-=0.2')
            .to(lethonLinesRef.current, { opacity: 0.8, duration: 0.35 }, '-=0.35')
            .to(lethonLogsRef.current, { autoAlpha: 1, y: 0, stagger: 0.1, duration: 0.4, ease: 'power2.out' }, '-=0.15')
            .to(lethonBadgeRef.current, { scale: 1, autoAlpha: 1, duration: 0.6, ease: 'elastic.out(1, 0.6)' }, '-=0.1');

          return;
        }

        // --- C. TALL DESKTOP (PINNED REVEAL) ---
        if (isDesktopTall) {
          const tlTall = gsap.timeline({
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top top',
              end: '+=180%',
              pin: true,
              scrub: 1,
              anticipatePin: 1,
            }
          });

          tlTall
            // Step 1: Scrub title text reveal
            .to(headlineWords, {
              autoAlpha: 1,
              y: 0,
              rotateX: 0,
              stagger: 0.04,
              duration: 1.0,
              ease: 'power2.out'
            })
            // Step 2: Build Centralized Standard diagram
            .to(centralClientRef.current, { 
              scale: 1, autoAlpha: 1, filter: 'blur(0px)', duration: 0.8, ease: 'back.out(1.2)' 
            }, '+=0.1')
            .to(centralLineRef.current, { 
              scaleY: 1, duration: 0.8, ease: 'power2.inOut' 
            }, '-=0.4')
            .to(centralServerRef.current, { 
              scale: 1, autoAlpha: 1, filter: 'blur(0px)', duration: 0.8, ease: 'back.out(1.2)' 
            }, '-=0.5')
            .to(centralLogsRef.current, { 
              autoAlpha: 1, y: 0, stagger: 0.15, duration: 0.7, ease: 'power2.out' 
            }, '-=0.2')
            .to(centralBadgeRef.current, { 
              scale: 1, autoAlpha: 1, duration: 0.9, ease: 'back.out(1.4)' 
            }, '-=0.2')
            // Step 3: Build Lethon Cryptographic Mesh diagram
            .to(lethonNodesRef.current, { 
              scale: 1, autoAlpha: 1, filter: 'blur(0px)', stagger: 0.15, duration: 1.0, ease: 'back.out(1.3)' 
            }, '+=0.3')
            .to(lethonLinesRef.current, { 
              opacity: 0.8, duration: 0.6 
            }, '-=0.6')
            .to(lethonLogsRef.current, { 
              autoAlpha: 1, y: 0, stagger: 0.15, duration: 0.7, ease: 'power2.out' 
            }, '-=0.35')
            .to(lethonBadgeRef.current, { 
              scale: 1, autoAlpha: 1, duration: 0.9, ease: 'back.out(1.4)' 
            }, '-=0.2');

          // Persistence delay at the end
          tlTall.to({}, { duration: 0.5 });
        }
      }
    );
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className={styles.section} id="communities" data-scroll-section>
      <div className="container">
        
        {/* Header Section */}
        <header className={styles.header}>
          <div className={styles.tag}>
            <span className={styles.tagDot} />
            DECENTRALIZED COMMUNITIES
          </div>
          <h2 className={styles.headline} ref={headlineRef}>
            {'Groups without a gatekeeper.'.split(' ').map((word, i) => (
              <span key={i} className={styles.word}>{word}&nbsp;</span>
            ))}
          </h2>
          <div className={styles.sub}>
            <p>Lethon communities work like Signal groups.</p>
            <p>But Signal&apos;s server decides who can speak.</p>
            <p>With Lethon, cryptography decides.</p>
            <p>And cryptography doesn&apos;t have an office.</p>
          </div>
        </header>

        {/* The Comparison Grid */}
        <div className={styles.grid}>
          
          {/* Column 1: Centralized Architecture */}
          <div className={styles.col}>
            <div className={styles.colHeader}>
              <span className={`${styles.statusDot} ${styles.statusDotRed}`} />
              Centralized Standard
            </div>
            
            <div className={`${styles.diagram} ${styles.diagramRed}`}>
              <div className={styles.scanline} aria-hidden="true" />
              
              {/* Visual Architecture Area */}
              <div className={styles.visualArea}>
                {/* Central Server Card */}
                <div className={styles.serverCard} ref={centralServerRef}>
                  <div className={styles.serverHeader}>
                    <span className={styles.serverLed} />
                    <span className={styles.monoTitle}>CENTRAL_GATEKEEPER_v4</span>
                  </div>
                  <div className={styles.serverBody}>
                    <span className={styles.telemetryText}>[AUTH_DATABASE: ACTIVE]</span>
                    <span className={styles.telemetrySub}>ENFORCING_RULES...</span>
                  </div>
                </div>

                {/* Connection Line */}
                <div className={styles.connector} ref={centralLineRef}>
                  <div className={styles.connectorLineRed} />
                </div>

                {/* Client Node Card */}
                <div className={styles.clientCard} ref={centralClientRef}>
                  <div className={styles.clientHeader}>
                    <span className={styles.monoTitle}>[CLIENT_ID: 8821]</span>
                  </div>
                  <div className={styles.clientBody}>Group Member</div>
                </div>
              </div>

              {/* Terminal Logs Area */}
              <div className={styles.terminal}>
                <div className={styles.terminalHeader}>
                  <span className={styles.terminalDot} />
                  <span>console_stream</span>
                </div>
                <div className={styles.terminalBody}>
                  <div className={styles.logRow} ref={el => centralLogsRef.current[0] = el}>
                    <span className={styles.logLabel}>REQUEST:</span>
                    <span className={styles.logVal}>&quot;Post Message&quot;</span>
                  </div>
                  <div className={styles.logRow} ref={el => centralLogsRef.current[1] = el}>
                    <span className={styles.logLabel}>QUERY:</span>
                    <span className={styles.logVal}>Server Auth Check</span>
                  </div>
                  <div className={styles.logRow} ref={el => centralLogsRef.current[2] = el}>
                    <span className={styles.logLabel}>RESULT:</span>
                    <span className={styles.logValFail}>PENDING SERVER APPROVAL</span>
                  </div>
                </div>
              </div>

              {/* Status Badge */}
              <div className={styles.badgeWrap} ref={centralBadgeRef}>
                <div className={styles.badgeFail}>
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" className={styles.badgeIcon}>
                    <path d="M8 0a8 8 0 100 16A8 8 0 008 0zm3.5 10.1L10.1 11.5 8 9.4l-2.1 2.1-1.4-1.4 2.1-2.1-2.1-2.1 1.4-1.4 2.1 2.1 2.1-2.1 1.4 1.4-2.1 2.1 2.1 2.1z"/>
                  </svg>
                  <span>SINGLE POINT OF FAILURE</span>
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: Lethon Decentralized Architecture */}
          <div className={styles.col}>
            <div className={styles.colHeader}>
              <span className={`${styles.statusDot} ${styles.statusDotGreen}`} />
              Lethon Cryptographic Mesh
            </div>
            
            <div className={`${styles.diagram} ${styles.diagramGreen}`}>
              <div className={styles.scanline} aria-hidden="true" />
              
              {/* Visual Architecture Area (P2P Mesh Network) */}
              <div className={styles.visualAreaMesh} ref={lethonMeshRef}>
                
                {/* SVG connection lines between P2P nodes */}
                <svg className={styles.meshSvg} viewBox="0 0 300 160">
                  <defs>
                    <linearGradient id="meshGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.85" />
                      <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0.15" />
                    </linearGradient>
                  </defs>
                  
                  {/* Triangle connection paths */}
                  <path
                    ref={el => lethonLinesRef.current[0] = el}
                    d="M 50 40 L 250 40"
                    fill="none"
                    stroke="url(#meshGradient)"
                    strokeWidth="1.5"
                    strokeDasharray="6 6"
                    className={styles.meshPath}
                  />
                  <path
                    ref={el => lethonLinesRef.current[1] = el}
                    d="M 250 40 L 150 120"
                    fill="none"
                    stroke="url(#meshGradient)"
                    strokeWidth="1.5"
                    strokeDasharray="6 6"
                    className={styles.meshPath}
                  />
                  <path
                    ref={el => lethonLinesRef.current[2] = el}
                    d="M 150 120 L 50 40"
                    fill="none"
                    stroke="url(#meshGradient)"
                    strokeWidth="1.5"
                    strokeDasharray="6 6"
                    className={styles.meshPath}
                  />
                </svg>
                
                {/* P2P Node 1 */}
                <div className={`${styles.p2pNode} ${styles.p2pNode1}`} ref={el => lethonNodesRef.current[0] = el}>
                  <div className={styles.p2pLed} />
                  <span className={styles.monoSmall}>NODE_01</span>
                  <span className={styles.nodeRoleTag}>Owner</span>
                </div>
                
                {/* P2P Node 2 */}
                <div className={`${styles.p2pNode} ${styles.p2pNode2}`} ref={el => lethonNodesRef.current[1] = el}>
                  <div className={styles.p2pLed} />
                  <span className={styles.monoSmall}>NODE_02</span>
                  <span className={styles.nodeRoleTag}>Admin</span>
                </div>
                
                {/* P2P Node 3 */}
                <div className={`${styles.p2pNode} ${styles.p2pNode3}`} ref={el => lethonNodesRef.current[2] = el}>
                  <div className={styles.p2pLed} />
                  <span className={styles.monoSmall}>NODE_03</span>
                  <span className={styles.nodeRoleTag}>Member</span>
                </div>
                
              </div>

              {/* Terminal Logs Area */}
              <div className={styles.terminal}>
                <div className={styles.terminalHeader}>
                  <span className={styles.terminalDot} />
                  <span>consensus_stream</span>
                </div>
                <div className={styles.terminalBody}>
                  <div className={styles.logRow} ref={el => lethonLogsRef.current[0] = el}>
                    <span className={styles.logLabel}>SIG:</span>
                    <span className={styles.logVal}>ED25519_AUTH_VALID</span>
                  </div>
                  <div className={styles.logRow} ref={el => lethonLogsRef.current[1] = el}>
                    <span className={styles.logLabel}>CONSENSUS:</span>
                    <span className={styles.logVal}>LOCAL_RULES_ENFORCED</span>
                  </div>
                  <div className={styles.logRow} ref={el => lethonLogsRef.current[2] = el}>
                    <span className={styles.logLabel}>RESULT:</span>
                    <span className={styles.logValSuccess}>MATHEMATICAL CERTAINTY</span>
                  </div>
                </div>
              </div>

              {/* Status Badge */}
              <div className={styles.badgeWrap} ref={lethonBadgeRef}>
                <div className={styles.badgeSuccess}>
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" className={styles.badgeIcon}>
                    <path d="M8 0a8 8 0 100 16A8 8 0 008 0zm3.5 6.5l-4.5 4.5-2.5-2.5 1.4-1.4 1.1 1.1 3.1-3.1 1.4 1.4z"/>
                  </svg>
                  <span>DECENTRALIZED ENFORCEMENT</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
