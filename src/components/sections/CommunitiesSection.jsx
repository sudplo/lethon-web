'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './CommunitiesSection.module.css';

gsap.registerPlugin(ScrollTrigger);

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
  const tlRef = useRef(null);

  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add(
      {
        isDesktop: '(min-width: 861px)',
        reduceMotion: '(prefers-reduced-motion: reduce)',
      },
      (context) => {
        const { isDesktop, reduceMotion } = context.conditions;
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: isDesktop ? 'top 52%' : 'top 78%',
            end: 'bottom 24%',
            pin: false,
            pinSpacing: true,
            scrub: reduceMotion ? false : 0.75,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
        tlRef.current = tl;

        if (!reduceMotion) {
      gsap.set(serverRef.current, { scale: 0, autoAlpha: 0 });
      gsap.set(sigLinesRef.current, { scaleY: 0, transformOrigin: 'top' });
      gsap.set(sigPermsRef.current, { autoAlpha: 0, x: -10, filter: 'blur(5px)' });
      gsap.set(sigXRef.current, { autoAlpha: 0, scale: 0 });
      gsap.set(lNodesRef.current, { scale: 0, autoAlpha: 0 });
      gsap.set(lLinesRef.current, { scaleX: 0, scaleY: 0 });
      gsap.set(lPermsRef.current, { autoAlpha: 0, x: 10, filter: 'blur(5px)' });
      gsap.set(lCheckRef.current, { autoAlpha: 0, scale: 0 });

      tl
        .to(serverRef.current, { scale: 1, autoAlpha: 1, duration: 0.85, ease: 'back.out(1.4)' })
        .to(sigLinesRef.current, { scaleY: 1, stagger: 0.16, duration: 0.8, ease: 'power3.out' })
        .to(sigPermsRef.current, { autoAlpha: 1, x: 0, filter: 'blur(0px)', stagger: 0.24, duration: 0.75, ease: 'power2.out' })
        .to(sigXRef.current, { autoAlpha: 1, scale: 1, duration: 0.8, ease: 'back.out(2)' })
        .to(lNodesRef.current, { scale: 1, autoAlpha: 1, stagger: 0.18, duration: 0.85, ease: 'back.out(1.4)' }, '+=0.3')
        .to(lLinesRef.current, { scaleX: 1, scaleY: 1, stagger: 0.18, duration: 0.85, ease: 'power3.out' })
        .to(lPermsRef.current, { autoAlpha: 1, x: 0, filter: 'blur(0px)', stagger: 0.24, duration: 0.75, ease: 'power2.out' })
        .to(lCheckRef.current, { autoAlpha: 1, scale: 1, duration: 0.8, ease: 'back.out(2)' })
        /* Pulse server red at end to show "single point of failure" */
        .to(serverRef.current, {
          boxShadow: '0 0 28px rgba(239,68,68,0.75)',
          borderColor: 'rgba(239,68,68,1)',
          duration: 0.4, ease: 'power2.out',
        }, '-=0.4')
        .to({}, { duration: 0.6 });
        }

        return () => tl.kill();
      }
    );

    return () => {
      mm.revert();
    };
  }, []);

  return (
    <section ref={sectionRef} className={styles.section} id="communities" data-scroll-section>
      <div className="container">
        <h2 className={styles.headline}>Groups without a gatekeeper.</h2>
        <div className={styles.sub}>
          <p>Lethon communities work like Signal groups.</p>
          <p>But Signal&apos;s server decides who can speak.</p>
          <p>With Lethon, cryptography decides.</p>
          <p>And cryptography doesn&apos;t have an office.</p>
        </div>

        <div className={styles.grid}>
          {/* Standard side */}
          <div className={styles.col}>
            <div className={styles.colHeader}>Standard Groups</div>
            <div className={styles.diagram} data-gsap-scan>
              <div className={styles.server} ref={serverRef}>SERVER</div>
              <div className={styles.lineV} ref={el => sigLinesRef.current[0] = el} />
              <div className={styles.clientNode}>Owner</div>
              <div className={styles.lineV} ref={el => sigLinesRef.current[1] = el} />
              <div className={styles.perms}>
                <div className={styles.permSignal} ref={el => sigPermsRef.current[0] = el}>Server verifies: &quot;Is Admin?&quot;</div>
                <div className={styles.permSignal} ref={el => sigPermsRef.current[1] = el}>Server verifies: &quot;Can delete?&quot;</div>
                <div className={styles.permSignal} ref={el => sigPermsRef.current[2] = el}>Server enforces rules.</div>
              </div>
              <div className={styles.result} ref={sigXRef}>
                <span style={{ color: 'var(--color-amber)' }}>✗ Server point of failure</span>
              </div>
            </div>
          </div>

          {/* Lethon side */}
          <div className={styles.col}>
            <div className={styles.colHeader}>Lethon Communities</div>
            <div className={styles.diagram} data-gsap-scan>
              <div className={styles.mesh}>
                <div className={styles.node} ref={el => lNodesRef.current[0] = el}>Owner</div>
                <div className={styles.lineH} ref={el => lLinesRef.current[0] = el} />
                <div className={styles.node} ref={el => lNodesRef.current[1] = el}>Admin</div>
                <div className={styles.lineH} ref={el => lLinesRef.current[1] = el} />
                <div className={styles.node} ref={el => lNodesRef.current[2] = el}>Member</div>
              </div>
              <div className={`${styles.lineV} ${styles.lineVAccent}`} ref={el => lLinesRef.current[2] = el} />
              <div className={styles.perms}>
                <div className={styles.permLethon} ref={el => lPermsRef.current[0] = el}>Ed25519 signs: &quot;This is an Admin.&quot;</div>
                <div className={styles.permLethon} ref={el => lPermsRef.current[1] = el}>Client checks: &quot;Signature valid?&quot;</div>
                <div className={styles.permLethon} ref={el => lPermsRef.current[2] = el}>The math is the rule.</div>
              </div>
              <div className={styles.result} ref={lCheckRef}>
                <span style={{ color: 'var(--color-green)' }}>✓ Distributed enforcement</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
