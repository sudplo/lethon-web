'use client';

import dynamic from 'next/dynamic';
import HeroSection from "@/components/sections/HeroSection";
import StatementSection from "@/components/sections/StatementSection";
import SurveillanceStatementSection from "@/components/sections/SurveillanceStatementSection";

// Lazy load heavy sections
const MetadataSection = dynamic(() => import("@/components/sections/MetadataSection"), {
  loading: () => <div style={{ height: '100vh' }} />,
  ssr: true
});

const ArchitectureSection = dynamic(() => import("@/components/sections/ArchitectureSection"), {
  loading: () => <div style={{ height: '100vh' }} />,
  ssr: true
});

const VoiceSection = dynamic(() => import("@/components/sections/VoiceSection"), {
  loading: () => <div style={{ height: '100vh' }} />,
  ssr: true
});

const CommunitiesSection = dynamic(() => import("@/components/sections/CommunitiesSection"), {
  loading: () => <div style={{ height: '100vh' }} />,
  ssr: true
});

const JourneySection = dynamic(() => import("@/components/sections/JourneySection"), {
  loading: () => <div style={{ height: '100vh' }} />,
  ssr: true
});

const CompareSection = dynamic(() => import("@/components/sections/CompareSection"), {
  loading: () => <div style={{ height: '100vh' }} />,
  ssr: true
});

const ManifestoSection = dynamic(() => import("@/components/sections/ManifestoSection"), {
  loading: () => <div style={{ height: '100vh' }} />,
  ssr: true
});

import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  useEffect(() => {
    /* Wait for fonts + images to settle before calculating pin spacers */
    const refresh = () => {
      ScrollTrigger.refresh();
    };

    /* Use document.fonts.ready for precise timing instead of arbitrary timeout */
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        /* Small delay after fonts to let layout settle */
        requestAnimationFrame(() => {
          requestAnimationFrame(refresh);
        });
      });
    } else {
      /* Fallback for older browsers */
      const timer = setTimeout(refresh, 600);
      return () => clearTimeout(timer);
    }

    /* Also refresh on window load (images etc.) */
    window.addEventListener('load', refresh);
    return () => window.removeEventListener('load', refresh);
  }, []);

  return (
    <main>
      <HeroSection />
      <StatementSection />
      <SurveillanceStatementSection />
      <MetadataSection />
      <ArchitectureSection />
      <VoiceSection />
      <CommunitiesSection />
      <JourneySection />
      <CompareSection />
      <ManifestoSection />
    </main>
  );
}