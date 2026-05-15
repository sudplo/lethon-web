import "./globals.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import GlobalCanvas from "@/components/canvas/GlobalCanvas";
import SmoothScroll from "@/components/SmoothScroll";

export const metadata = {
  title: "Lethon | Privacy by Architecture",
  description: "The network carries what it doesn't understand. Privacy by architecture, not by trust.",
  viewport: "width=device-width, initial-scale=1.0, maximum-scale=5.0",
  robots: "index, follow",
  authors: [{ name: "Lethon Protocol" }],
  openGraph: {
    title: "Lethon | Privacy by Architecture",
    description: "The network carries what it doesn't understand. Privacy by architecture, not by trust.",
    url: "https://lethon-protocol.dev",
    siteName: "Lethon Protocol",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Lethon Protocol - Privacy by Architecture"
      }
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lethon | Privacy by Architecture",
    description: "The network carries what it doesn't understand. Privacy by architecture, not by trust.",
    images: ["/og-image.png"]
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="canonical" href="https://lethon-protocol.dev" />
        <meta name="theme-color" content="#030508" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Lethon Protocol",
              url: "https://lethon-protocol.dev",
              description: "Privacy by architecture, not by trust.",
              sameAs: ["https://github.com/sudplo/lethon"]
            })
          }}
        />
      </head>
      <body>
        <Navigation />
        <GlobalCanvas />
        <SmoothScroll>
          {children}
        </SmoothScroll>
        <Footer />
      </body>
    </html>
  );
}