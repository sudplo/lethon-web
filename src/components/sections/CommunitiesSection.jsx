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
  
  // Refs for animation targets
  const serverRef = useRef(null);
  const sigLinesRef = useRef([]);
  const sigPermsRef = useRef([]);
  const sigXRef = useRef(null);
  
  const lNodesRef = useRef([]);
  const lLinesRef = useRef([]);
  const lPermsRef = useRef([]);
  const lCheckRef = useRef(null);

  useGSAP(() => {
    const q = gsap.utils.selector(sectionRef);
    const mm = gsap.matchMedia();

    // ── 1. INITIAL STATES ──
    const headlineWords = headlineRef.current.querySelectorAll('span');
    gsap.set(headlineWords, { autoAlpha: 0, y: 30, rotateX: -30 });
    
    gsap.set(serverRef.current, { scale: 0.8, autoAlpha: 0, filter: 'blur(15px)' });
    gsap.set(sigLinesRef.current, { scaleY: 0, transformOrigin: 'top' });
    gsap.set(sigPermsRef.current, { autoAlpha: 0, x: -15, filter: 'blur(10px)' });
    gsap.set(sigXRef.current, { autoAlpha: 0, y: 15, scale: 0.9 });
    
    gsap.set(lNodesRef.current, { scale: 0.5, autoAlpha: 0, filter: 'blur(15px)' });
    gsap.set(lLinesRef.current, { scaleX: 0, scaleY: 0, transformOrigin: 'center' });
    gsap.set(lPermsRef.current, { autoAlpha: 0, x: 15, filter: 'blur(10px)' });
    gsap.set(lCheckRef.current, { autoAlpha: 0, y: 15, scale: 0.9 });

    mm.add(
      {
        isDesktop: '(min-width: 901px)',
        isMobile: '(max-width: 900px)',
      },
      (context) => {
        const { isDesktop } = context.conditions;

        // ── 2. HEADLINE ENTRANCE ──
        gsap.to(headlineWords, {
          autoAlpha: 1,
          y: 0,
          rotateX: 0,
          stagger: 0.05,
          duration: 1.2,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: headlineRef.current,
            start: 'top 85%',
          }
        });

        // ── 3. DIAGRAM ANIMATIONS ──
        
        // --- Standard Side ---
        const tlStandard = gsap.timeline({
          scrollTrigger: {
            trigger: q(`.${styles.col}`)[0],
            start: 'top 75%',
            toggleActions: 'play none none none',
          }
        });

        tlStandard
          .to(serverRef.current, { 
            scale: 1, autoAlpha: 1, filter: 'blur(0px)', duration: 1, ease: 'expo.out' 
          })
          .to(sigLinesRef.current, { 
            scaleY: 1, stagger: 0.1, duration: 0.8, ease: 'power3.out' 
          }, '-=0.4')
          .to(sigPermsRef.current, { 
            autoAlpha: 1, x: 0, filter: 'blur(0px)', stagger: 0.12, duration: 0.8, ease: 'back.out(1.2)' 
          }, '-=0.6')
          .to(sigXRef.current, { 
            autoAlpha: 1, y: 0, scale: 1, duration: 0.8, ease: 'elastic.out(1, 0.5)' 
          }, '-=0.2')
          .to(serverRef.current, {
            boxShadow: '0 0 40px rgba(239, 68, 68, 0.4)',
            borderColor: 'rgba(239, 68, 68, 0.6)',
            backgroundColor: 'rgba(239, 68, 68, 0.12)',
            duration: 1.5,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut'
          }, '-=0.2');

        // --- Lethon Side ---
        const tlLethon = gsap.timeline({
          scrollTrigger: {
            trigger: q(`.${styles.col}`)[1],
            start: 'top 75%',
            toggleActions: 'play none none none',
          }
        });

        tlLethon
          .to(lNodesRef.current, { 
            scale: 1, autoAlpha: 1, filter: 'blur(0px)', stagger: 0.1, duration: 1, ease: 'expo.out' 
          })
          .to(lLinesRef.current, { 
            scaleX: 1, scaleY: 1, stagger: 0.1, duration: 0.6, ease: 'power2.inOut' 
          }, '-=0.8')
          .to(lPermsRef.current, { 
            autoAlpha: 1, x: 0, filter: 'blur(0px)', stagger: 0.12, duration: 0.8, ease: 'back.out(1.2)' 
          }, '-=0.6')
          .to(lCheckRef.current, { 
            autoAlpha: 1, y: 0, scale: 1, duration: 0.8, ease: 'elastic.out(1, 0.5)' 
          }, '-=0.2')
          .to(lNodesRef.current, {
            borderColor: 'rgba(0, 245, 160, 0.6)',
            boxShadow: '0 0 25px rgba(0, 245, 160, 0.25)',
            backgroundColor: 'rgba(0, 245, 160, 0.08)',
            duration: 0.5,
            stagger: 0.1,
            ease: 'sine.inOut'
          }, '-=0.4');

        if (isDesktop) {
          // Add subtle scan effect animation
          gsap.to(q(`.${styles.scanline}`), {
            y: '100%',
            duration: 4,
            repeat: -1,
            ease: 'none',
          });
        }
      }
    );
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className={styles.section} id="communities" data-scroll-section>
      <div className="container">
        <header className={styles.header}>
          <div className={styles.tag}>DECENTRALIZED COMMUNITIES</div>
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

        <div className={styles.grid}>
          {/* Standard Column */}
          <div className={styles.col}>
            <div className={styles.colHeader}>
              <span className={styles.colStatus} />
              Centralized Standard
            </div>
            <div className={styles.diagram}>
              <div className={styles.scanline} aria-hidden="true" />
              <div className={styles.visualStack}>
                {/* Central Server */}
                <div className={styles.server} ref={serverRef}>
                  <div className={styles.serverHeader}>
                    <span className={styles.serverStatusLed} />
                    <span className={styles.mono}>CENTRAL_GATEKEEPER_v4</span>
                  </div>
                  <div className={styles.serverBody}>
                    <div className={styles.telemetry}>[AUTH_DATABASE]</div>
                    <div className={styles.telemetryMuted}>ENFORCING_RULES...</div>
                  </div>
                </div>

                <div className={styles.connector} ref={el => sigLinesRef.current[0] = el}>
                  <div className={styles.connectorLineRed} />
                </div>

                {/* Client Node */}
                <div className={styles.clientNode}>
                  <div className={styles.nodeHeader}>
                    <span className={styles.monoSmall}>[CLIENT_ID: 8821]</span>
                  </div>
                  <div className={styles.nodeRole}>Group Member</div>
                </div>
              </div>

              <div className={styles.terminal}>
                <div className={styles.logRow} ref={el => sigPermsRef.current[0] = el}>
                  <span className={styles.logLabel}>REQUEST:</span>
                  <span className={styles.logVal}>&quot;Post Message&quot;</span>
                </div>
                <div className={styles.logRow} ref={el => sigPermsRef.current[1] = el}>
                  <span className={styles.logLabel}>QUERY:</span>
                  <span className={styles.logVal}>Server Auth Check</span>
                </div>
                <div className={styles.logRow} ref={el => sigPermsRef.current[2] = el}>
                  <span className={styles.logLabel}>RESULT:</span>
                  <span className={styles.logValError}>PENDING SERVER APPROVAL</span>
                </div>
              </div>

              <div className={styles.badgeWrap} ref={sigXRef}>
                <div className={styles.badgeFail}>
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M8 0a8 8 0 100 16A8 8 0 008 0zm3.5 10.1L10.1 11.5 8 9.4l-2.1 2.1-1.4-1.4 2.1-2.1-2.1-2.1 1.4-1.4 2.1 2.1 2.1-2.1 1.4 1.4-2.1 2.1 2.1 2.1z"/>
                  </svg>
                  <span>SINGLE POINT OF FAILURE</span>
                </div>
              </div>
            </div>
          </div>

          {/* Lethon Column */}
          <div className={styles.col}>
            <div className={styles.colHeader}>
              <span className={`${styles.colStatus} ${styles.colStatusActive}`} />
              Lethon Architecture
            </div>
            <div className={styles.diagram}>
              <div className={styles.scanline} aria-hidden="true" />
              <div className={styles.visualStackMesh}>
                {/* Mesh Nodes */}
                <div className={styles.meshWrap}>
                  <svg className={styles.meshSvg} viewBox="0 0 240 120">
                    <path 
                      ref={el => lLinesRef.current[0] = el}
                      d="M 40 30 L 200 30 L 120 90 Z" 
                      fill="none" 
                      stroke="var(--color-accent)" 
                      strokeWidth="1" 
                      strokeDasharray="4 4"
                      opacity="0.3"
                    />
                  </svg>
                  
                  <div className={`${styles.p2pNode} ${styles.p1}`} ref={el => lNodesRef.current[0] = el}>
                    <div className={styles.p2pLed} />
                    <span className={styles.monoSmall}>NODE_01</span>
                  </div>
                  <div className={`${styles.p2pNode} ${styles.p2}`} ref={el => lNodesRef.current[1] = el}>
                    <div className={styles.p2pLed} />
                    <span className={styles.monoSmall}>NODE_02</span>
                  </div>
                  <div className={`${styles.p2pNode} ${styles.p3}`} ref={el => lNodesRef.current[2] = el}>
                    <div className={styles.p2pLed} />
                    <span className={styles.monoSmall}>NODE_03</span>
                  </div>
                </div>

                <div className={styles.connector} ref={el => lLinesRef.current[1] = el}>
                  <div className={styles.connectorLineGreen} />
                </div>
              </div>

              <div className={styles.terminal}>
                <div className={styles.logRow} ref={el => lPermsRef.current[0] = el}>
                  <span className={styles.logLabel}>SIG:</span>
                  <span className={styles.logVal}>ED25519_AUTH_VALID</span>
                </div>
                <div className={styles.logRow} ref={el => lPermsRef.current[1] = el}>
                  <span className={styles.logLabel}>CONSENSUS:</span>
                  <span className={styles.logVal}>LOCAL_RULES_ENFORCED</span>
                </div>
                <div className={styles.logRow} ref={el => lPermsRef.current[2] = el}>
                  <span className={styles.logLabel}>RESULT:</span>
                  <span className={styles.logValSuccess}>MATHEMATICAL CERTAINTY</span>
                </div>
              </div>

              <div className={styles.badgeWrap} ref={lCheckRef}>
                <div className={styles.badgeSuccess}>
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
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
