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
    // Refresh all ScrollTriggers after initial mount to fix spacer heights
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 500);
    return () => clearTimeout(timer);
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