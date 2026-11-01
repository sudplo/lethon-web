'use client';
import { useLang } from '@/lib/i18n';

export default function SkipLink() {
  const { t } = useLang();
  return (
    <a className="skip" href="#contenido">
      {t.ui.skip}
    </a>
  );
}
