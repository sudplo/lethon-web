'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './CommunitiesSection.module.css';

gsap.registerPlugin(ScrollTrigger);

export default function CommunitiesSection() {
  const containerRef = useRef(null);
  const signalServerRef = useRef(null);
  const signalLinesRef = useRef([]);
  const signalPermsRef = useRef([]);
  const signalXRef = useRef(null);
  const lethonNodesRef = useRef([]);
  const lethonLinesRef = useRef([]);
  const lethonPermsRef = useRef([]);
  const lethonCheckRef = useRef(null);
  const tlRef = useRef(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "center center",
        end: "+=300%",
        pin: true,
        scrub: prefersReduced ? 0 : 1.5,
      }
    });
    tlRef.current = tl;

    if (!prefersReduced) {
      gsap.set(signalServerRef.current, { scale: 0, opacity: 0 });
      gsap.set(signalLinesRef.current, { scaleY: 0, transformOrigin: "top" });
      gsap.set(signalPermsRef.current, { opacity: 0, x: -12, filter: 'blur(6px)' });
      gsap.set(signalXRef.current, { opacity: 0, scale: 0 });
      gsap.set(lethonNodesRef.current, { scale: 0, opacity: 0 });
      gsap.set(lethonLinesRef.current, { scaleY: 0, scaleX: 0, transformOrigin: "center" });
      gsap.set(lethonPermsRef.current, { opacity: 0, x: 12, filter: 'blur(6px)' });
      gsap.set(lethonCheckRef.current, { opacity: 0, scale: 0 });

      tl.to(signalServerRef.current, { scale: 1, opacity: 1, duration: 0.95, ease: "back.out(1.3)" })
        .to(signalLinesRef.current, { scaleY: 1, duration: 0.95, stagger: 0.18, ease: "power3.out" })
        .to(signalPermsRef.current, { opacity: 1, x: 0, filter: 'blur(0px)', duration: 0.9, stagger: 0.28, ease: "power2.out" })
        .to(signalXRef.current, { opacity: 1, scale: 1, duration: 0.9, ease: "back.out(2.2)" })
        .to(lethonNodesRef.current, { scale: 1, opacity: 1, duration: 0.95, stagger: 0.2, ease: "back.out(1.3)" }, "+=0.4")
        .to(lethonLinesRef.current, { scaleY: 1, scaleX: 1, duration: 0.95, stagger: 0.2, ease: "power3.out" })
        .to(lethonPermsRef.current, { opacity: 1, x: 0, filter: 'blur(0px)', duration: 0.9, stagger: 0.28, ease: "power2.out" })
        .to(lethonCheckRef.current, { opacity: 1, scale: 1, duration: 0.9, ease: "back.out(2.2)" })
        .to(signalServerRef.current, {
          boxShadow: "0 0 30px rgba(239, 68, 68, 0.8)",
          borderColor: "rgba(239, 68, 68, 1)",
          duration: 0.5,
          ease: "power2.out"
        }, "-=0.5");
    }

    return () => {
      if (tlRef.current) {
        tlRef.current.scrollTrigger?.kill();
        tlRef.current.kill();
        tlRef.current = null;
      }
    };
  }, []);

  return (
    <section ref={containerRef} className={styles.communitiesSection} id="communities">
      <div className="container">
        <h2 className={styles.headline}>Groups without a gatekeeper.</h2>
        <div className={styles.subheadline}>
          <p>Lethon communities work like Signal groups.</p>
          <p>But Signal's server decides who can speak.</p>
          <p>With Lethon, cryptography decides.</p>
          <p>And cryptography doesn't have an office.</p>
        </div>

        <div className={styles.diagramArea}>
          <div className={styles.diagramCol}>
            <div className={styles.diagramHeader}>Standard Groups</div>
            <div className={styles.diagramBox}>
              <div className={styles.server} ref={signalServerRef}>SERVER</div>
              <div className={styles.lineVert} ref={el => signalLinesRef.current[0] = el} />
              <div className={styles.clientNode}>Owner</div>
              <div className={styles.lineVert} ref={el => signalLinesRef.current[1] = el} />
              <div className={styles.permsList}>
                <div className={styles.permSignal} ref={el => signalPermsRef.current[0] = el}>Server verifies: "Is Admin?"</div>
                <div className={styles.permSignal} ref={el => signalPermsRef.current[1] = el}>Server verifies: "Can delete?"</div>
                <div className={styles.permSignal} ref={el => signalPermsRef.current[2] = el}>Server enforces rules.</div>
              </div>
            </div>
            <div className={styles.resultMark} ref={signalXRef}>
              <span style={{ color: 'var(--color-amber)' }}>✗ Server point of failure</span>
            </div>
          </div>

          <div className={styles.diagramCol}>
            <div className={styles.diagramHeader}>Lethon Communities</div>
            <div className={styles.diagramBox}>
              <div className={styles.meshNodes}>
                <div className={styles.lethonNode} ref={el => lethonNodesRef.current[0] = el}>Owner</div>
                <div className={styles.lethonLineH} ref={el => lethonLinesRef.current[0] = el} />
                <div className={styles.lethonNode} ref={el => lethonNodesRef.current[1] = el}>Admin</div>
                <div className={styles.lethonLineH} ref={el => lethonLinesRef.current[1] = el} />
                <div className={styles.lethonNode} ref={el => lethonNodesRef.current[2] = el}>Member</div>
              </div>
              <div className={styles.lineVert} style={{ backgroundColor: 'var(--color-accent)' }} ref={el => lethonLinesRef.current[2] = el} />
              <div className={styles.permsList}>
                <div className={styles.permLethon} ref={el => lethonPermsRef.current[0] = el}>Ed25519 signs: "This is an Admin."</div>
                <div className={styles.permLethon} ref={el => lethonPermsRef.current[1] = el}>Client checks: "Signature valid?"</div>
                <div className={styles.permLethon} ref={el => lethonPermsRef.current[2] = el}>The math is the rule.</div>
              </div>
            </div>
            <div className={styles.resultMark} ref={lethonCheckRef}>
              <span style={{ color: 'var(--color-green)' }}>✓ Distributed enforcement</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}