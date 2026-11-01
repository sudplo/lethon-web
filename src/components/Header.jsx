'use client';
import { useLang } from '@/lib/i18n';
import Monogram from './Monogram';
import styles from './Header.module.css';

export default function Header() {
  const { t, lang, setLang } = useLang();
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <a className={styles.brand} href="#top" aria-label={t.ui.home}>
          <Monogram size={30} plate={false} />
          <span className={styles.word}>lethon</span>
        </a>
        <div className={styles.right}>
          <div className={styles.lang} role="group" aria-label={t.ui.langLabel}>
            <button type="button" lang="es" aria-pressed={lang === 'es'} onClick={() => setLang('es')} title={t.ui.langEs}>
              ES
            </button>
            <button type="button" lang="en" aria-pressed={lang === 'en'} onClick={() => setLang('en')} title={t.ui.langEn}>
              EN
            </button>
          </div>
          <a className={styles.dl} href="#descargar">
            {t.ui.download}
          </a>
        </div>
      </div>
    </header>
  );
}
