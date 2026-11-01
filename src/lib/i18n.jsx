'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import es from '@/content/es';
import en from '@/content/en';

const DICTS = { es, en };
const KEY = 'lethon-lang';

const Ctx = createContext({ lang: 'es', t: es, setLang: () => {} });

function readStored() {
  try {
    const v = window.localStorage.getItem(KEY);
    return v === 'es' || v === 'en' ? v : null;
  } catch {
    return null;
  }
}

export function LangProvider({ children }) {
  // El HTML exportado está en español; al cargar elegimos el idioma del lector.
  const [lang, setLangState] = useState('es');

  useEffect(() => {
    const stored = readStored();
    const nav = (navigator.languages && navigator.languages[0]) || navigator.language || 'es';
    const pick = stored || (/^en\b/i.test(nav) ? 'en' : 'es');
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (pick !== 'es') setLangState(pick);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = DICTS[lang].meta.title;
    const d = document.querySelector('meta[name="description"]');
    if (d) d.setAttribute('content', DICTS[lang].meta.description);
  }, [lang]);

  const setLang = useCallback((l) => {
    setLangState(l);
    try {
      window.localStorage.setItem(KEY, l);
    } catch {
      /* el navegador no deja guardar: no pasa nada */
    }
  }, []);

  const value = useMemo(() => ({ lang, t: DICTS[lang], setLang }), [lang, setLang]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useLang = () => useContext(Ctx);
