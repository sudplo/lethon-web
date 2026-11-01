import './globals.css';
import es from '@/content/es';

const SITE = 'https://sudplo.github.io/lethon-web/';

export const metadata = {
  metadataBase: new URL(SITE),
  title: es.meta.title,
  description: es.meta.description,
  applicationName: 'Lethon',
  authors: [{ name: 'Lethon' }],
  alternates: { canonical: SITE },
  openGraph: {
    title: es.meta.title,
    description: es.meta.description,
    url: SITE,
    siteName: 'Lethon',
    type: 'website',
    locale: 'es_ES',
    alternateLocale: ['en_US'],
  },
  twitter: {
    card: 'summary_large_image',
    title: es.meta.title,
    description: es.meta.description,
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0C1015',
  colorScheme: 'dark',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" data-world="internet">
      <head>
        <link rel="preload" href="/lethon-web/fonts/familjen_grotesk.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/lethon-web/fonts/figtree.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{if(!matchMedia('(prefers-reduced-motion: reduce)').matches&&innerHeight>=560)document.documentElement.classList.add('motion')}catch(e){}",
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
