'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import styles from './CommunitiesSection.module.css';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function CommunitiesSection() {
  const sectionRef = useRef(null);
  const serverRef = useRef(null);
  const sigLinesRef = useRef([]);
  const sigPermsRef = useRef([]);
  const sigXRef = useRef(null);
  const lNodesRef = useRef([]);
  const lLinesRef = useRef([]);
  const lPermsRef = useRef([]);
  const lCheckRef = useRef(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add(
      {
        isDesktop: '(min-width: 901px)',
        isMobile: '(max-width: 900px)',
      },
      (context) => {
        const { isDesktop } = context.conditions;

        if (!isDesktop) return;

        /* Desktop: Advanced build-up animation */
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: '+=100%',
            scrub: 1,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        // Reset states
        gsap.set(serverRef.current, { scale: 0.8, autoAlpha: 0, filter: 'blur(10px)' });
        gsap.set(sigLinesRef.current, { scaleY: 0, transformOrigin: 'top' });
        gsap.set(sigPermsRef.current, { autoAlpha: 0, x: -20, filter: 'blur(8px)' });
        gsap.set(sigXRef.current, { autoAlpha: 0, y: 10, scale: 0.9 });
        gsap.set(lNodesRef.current, { scale: 0.5, autoAlpha: 0, filter: 'blur(10px)' });
        gsap.set(lLinesRef.current, { scaleX: 0, scaleY: 0, transformOrigin: 'center' });
        gsap.set(lPermsRef.current, { autoAlpha: 0, x: 20, filter: 'blur(8px)' });
        gsap.set(lCheckRef.current, { autoAlpha: 0, y: 10, scale: 0.9 });

        tl
          .to(serverRef.current, { scale: 1, autoAlpha: 1, filter: 'blur(0px)', duration: 1, ease: 'expo.out' })
          .to(sigLinesRef.current, { scaleY: 1, stagger: 0.1, duration: 0.8, ease: 'power3.out' }, '-=0.5')
          .to(sigPermsRef.current, { autoAlpha: 1, x: 0, filter: 'blur(0px)', stagger: 0.15, duration: 0.8, ease: 'back.out(1.2)' }, '-=0.6')
          .to(sigXRef.current, { autoAlpha: 1, y: 0, scale: 1, duration: 1, ease: 'elastic.out(1, 0.5)' })
          
          .to(lNodesRef.current, { 
            scale: 1, 
            autoAlpha: 1, 
            filter: 'blur(0px)', 
            stagger: 0.1, 
            duration: 1, 
            ease: 'expo.out' 
          }, '+=0.2')
          .to(lLinesRef.current, { scaleX: 1, scaleY: 1, stagger: 0.08, duration: 0.6, ease: 'power2.inOut' }, '-=0.8')
          .to(lPermsRef.current, { autoAlpha: 1, x: 0, filter: 'blur(0px)', stagger: 0.15, duration: 0.8, ease: 'back.out(1.2)' }, '-=0.6')
          .to(lCheckRef.current, { autoAlpha: 1, y: 0, scale: 1, duration: 1, ease: 'elastic.out(1, 0.5)' })
          
          /* The "Single Point of Failure" warning pulse */
          .to(serverRef.current, {
            boxShadow: '0 0 50px rgba(239,68,68,0.6)',
            borderColor: '#ef4444',
            backgroundColor: 'rgba(239,68,68,0.15)',
            color: '#ff8a8a',
            duration: 1,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut'
          }, '-=0.5');
      }
    );
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className={styles.section} id="communities" data-scroll-section>
      <div className="container">
        <header className={styles.header}>
          <div className={styles.tag}>DECENTRALIZED COMMUNITIES</div>
          <h2 className={styles.headline}>Groups without a gatekeeper.</h2>
          <div className={styles.sub}>
            <p>Lethon communities work like Signal groups.</p>
            <p>But Signal&apos;s server decides who can speak.</p>
            <p>With Lethon, cryptography decides.</p>
            <p>And cryptography doesn&apos;t have an office.</p>
          </div>
        </header>

        <div className={styles.grid}>
          {/* Standard side */}
          <div className={styles.col}>
            <div className={styles.colHeader}>Standard Groups</div>
            <div className={styles.diagram}>
              <div className={styles.server} ref={serverRef}>
                <div className={styles.serverIcon}>CENTRAL SERVER</div>
              </div>
              <div className={styles.lineV} ref={el => sigLinesRef.current[0] = el} />
              <div className={styles.clientNode}>Group Admin / Owner</div>
              <div className={styles.lineV} ref={el => sigLinesRef.current[1] = el} />
              <div className={styles.perms}>
                <div className={styles.permSignal} ref={el => sigPermsRef.current[0] = el}>
                  <span className={styles.permLabel}>Server verifies:</span>
                  &quot;Is this user an Admin?&quot;
                </div>
                <div className={styles.permSignal} ref={el => sigPermsRef.current[1] = el}>
                  <span className={styles.permLabel}>Server verifies:</span>
                  &quot;Can they delete this?&quot;
                </div>
                <div className={styles.permSignal} ref={el => sigPermsRef.current[2] = el}>
                  Server enforces all rules.
                </div>
              </div>
              <div className={styles.result} ref={sigXRef}>
                <span className={styles.resultFail}>✗ Server point of failure</span>
              </div>
            </div>
          </div>

          {/* Lethon side */}
          <div className={styles.col}>
            <div className={styles.colHeader}>Lethon Communities</div>
            <div className={styles.diagram}>
              <div className={styles.mesh}>
                <div className={styles.node} ref={el => lNodesRef.current[0] = el}>Owner</div>
                <div className={styles.lineH} ref={el => lLinesRef.current[0] = el} />
                <div className={styles.node} ref={el => lNodesRef.current[1] = el}>Admin</div>
                <div className={styles.lineH} ref={el => lLinesRef.current[1] = el} />
                <div className={styles.node} ref={el => lNodesRef.current[2] = el}>Member</div>
              </div>
              <div className={`${styles.lineV} ${styles.lineVAccent}`} ref={el => lLinesRef.current[2] = el} />
              <div className={styles.perms}>
                <div className={styles.permLethon} ref={el => lPermsRef.current[0] = el}>
                  <span className={styles.permLabel}>Ed25519 signs:</span>
                  &quot;This is an Admin.&quot;
                </div>
                <div className={styles.permLethon} ref={el => lPermsRef.current[1] = el}>
                  <span className={styles.permLabel}>Client checks:</span>
                  &quot;Is signature valid?&quot;
                </div>
                <div className={styles.permLethon} ref={el => lPermsRef.current[2] = el}>
                  The math is the rule.
                </div>
              </div>
              <div className={styles.result} ref={lCheckRef}>
                <span className={styles.resultSuccess}>✓ Distributed enforcement</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
