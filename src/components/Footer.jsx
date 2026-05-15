'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './Footer.module.css';

gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
  const footerRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    // Fade in footer content when it comes into view
    gsap.set(contentRef.current, { opacity: 0, y: 40 });
    
    gsap.to(contentRef.current, {
      opacity: 1,
      y: 0,
      duration: 1.2,
      ease: "power3.out",
      scrollTrigger: {
        trigger: footerRef.current,
        start: "top 85%",
        once: true
      }
    });
  }, []);

  return (
    <footer ref={footerRef} className={styles.footer}>
      <div ref={contentRef} className={styles.content}>
        
        {/* Main manifesto line */}
        <div className={styles.manifestoLine}>
          <p>Privacy by architecture, not by trust.</p>
        </div>

        {/* Links grid */}
        <div className={styles.linksGrid}>
          <div className={styles.linkGroup}>
            <h4>Build</h4>
            <ul>
              <li>
                <a 
                  href="https://github.com/sudplo/Ibri" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  data-interactive="true"
                >
                  GitHub Repository
                </a>
              </li>
              <li>
                <a 
                  href="https://github.com/sudplo/Ibri/blob/main/CONTRIBUTING.md" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  data-interactive="true"
                >
                  Contribute
                </a>
              </li>
              <li>
                <a 
                  href="https://github.com/sudplo/Ibri/blob/main/README.md" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  data-interactive="true"
                >
                  Documentation
                </a>
              </li>
            </ul>
          </div>

          <div className={styles.linkGroup}>
            <h4>Security</h4>
            <ul>
              <li>
                <a 
                  href="https://github.com/sudplo/Ibri/blob/main/SECURITY_PATCHES_APPLIED.md" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  data-interactive="true"
                >
                  Security Patches
                </a>
              </li>
              <li>
                <a 
                  href="https://github.com/sudplo/Ibri/blob/main/LICENSE.txt" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  data-interactive="true"
                >
                  License
                </a>
              </li>
              <li>
                <span className={styles.auditStatus}>
                  Audit: Q3 2026 <span className={styles.badge}>Scheduled</span>
                </span>
              </li>
            </ul>
          </div>

          <div className={styles.linkGroup}>
            <h4>Architecture</h4>
            <ul>
              <li>
                <a 
                  href="https://github.com/sudplo/Ibri/blob/main/informe_arquitectura.md" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  data-interactive="true"
                >
                  Architecture Report
                </a>
              </li>
              <li>
                <span className={styles.techStack}>
                  Tor • Waku • Briar • I2P
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom divider + meta */}
        <div className={styles.bottomMeta}>
          <div className={styles.divider} />
          <div className={styles.meta}>
            <p>
              <span>Lethon Protocol</span>
              <span className={styles.dot}>•</span>
              <span>Version 0.1.0</span>
              <span className={styles.dot}>•</span>
              <span>May 2026</span>
            </p>
            <p className={styles.metaNote}>
              The network carries what it doesn't understand.
            </p>
          </div>
        </div>

      </div>
    </footer>
  );
}
