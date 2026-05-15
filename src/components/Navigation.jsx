'use client';

import { useEffect, useState } from 'react';
import styles from './Navigation.module.css';

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Initial check
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      <div className={`container ${styles.navContainer}`}>
        <div className={styles.logo}>Lethon</div>
        <a 
          href="https://github.com/sudplo/Ibri" 
          target="_blank" 
          rel="noopener noreferrer" 
          className={styles.githubLink}
          data-interactive="true"
        >
          GitHub
        </a>
      </div>
    </header>
  );
}
