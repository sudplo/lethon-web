'use client';

import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function GsapMicroInteractions() {
  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let context;
    const timer = window.setTimeout(() => {
      context = gsap.context(() => {
      const interactiveSelector = 'a, button, [data-interactive="true"]';
      const attached = new WeakSet();
      const attachInteractive = (root = document) => {
        root.querySelectorAll(interactiveSelector).forEach((el) => {
          if (attached.has(el)) return;
          attached.add(el);

          const xTo = gsap.quickTo(el, 'x', { duration: 0.34, ease: 'expo.out' });
          const yTo = gsap.quickTo(el, 'y', { duration: 0.34, ease: 'expo.out' });

          el.addEventListener('pointermove', (event) => {
            if (reduceMotion || window.innerWidth < 760) return;
            const rect = el.getBoundingClientRect();
            xTo((event.clientX - rect.left - rect.width / 2) * 0.14);
            yTo((event.clientY - rect.top - rect.height / 2) * 0.22);
          });

          el.addEventListener('pointerleave', () => {
            xTo(0);
            yTo(0);
          });
        });
      };

      attachInteractive();

      const observer = new MutationObserver(() => attachInteractive());
      observer.observe(document.body, { childList: true, subtree: true });

      const updateGlobalGlow = (sectionId) => {
        let glowColor = 'rgba(0, 245, 160, 0.03)';
        let glowX = '80%';
        let glowY = '20%';

        switch (sectionId) {
          case 'hero':
            glowColor = 'rgba(0, 245, 160, 0.04)';
            glowX = '80%';
            glowY = '20%';
            break;
          case 'statement':
            glowColor = 'rgba(30, 41, 59, 0.02)';
            glowX = '20%';
            glowY = '80%';
            break;
          case 'surveillance':
            glowColor = 'rgba(245, 158, 11, 0.04)';
            glowX = '10%';
            glowY = '30%';
            break;
          case 'metadata':
            glowColor = 'rgba(0, 229, 255, 0.04)';
            glowX = '90%';
            glowY = '70%';
            break;
          case 'architecture':
            // Handled dynamically by ArchitectureSection.jsx
            return;
          case 'voice':
            glowColor = 'rgba(0, 245, 160, 0.03)';
            glowX = '50%';
            glowY = '50%';
            break;
          case 'communities':
            glowColor = 'rgba(123, 47, 255, 0.04)';
            glowX = '30%';
            glowY = '70%';
            break;
          case 'journey':
            glowColor = 'rgba(0, 245, 160, 0.03)';
            glowX = '70%';
            glowY = '30%';
            break;
          case 'compare':
            glowColor = 'rgba(51, 65, 85, 0.02)';
            glowX = '50%';
            glowY = '80%';
            break;
          case 'manifesto':
            glowColor = 'rgba(0, 245, 160, 0.04)';
            glowX = '50%';
            glowY = '30%';
            break;
        }

        gsap.to(document.documentElement, {
          '--bg-glow-color': glowColor,
          '--glow-x': glowX,
          '--glow-y': glowY,
          duration: 1.2,
          ease: 'power2.out',
          overwrite: 'auto',
        });
      };

      document.querySelectorAll('[data-scroll-section]').forEach((section) => {
        ScrollTrigger.create({
          trigger: section,
          start: 'top 50%',
          end: 'bottom 50%',
          toggleClass: { targets: section, className: 'is-section-active' },
          onEnter: () => {
            const id = section.id || 'section';
            document.documentElement.dataset.activeSection = id;
            updateGlobalGlow(id);
          },
          onEnterBack: () => {
            const id = section.id || 'section';
            document.documentElement.dataset.activeSection = id;
            updateGlobalGlow(id);
          },
        });
      });

      if (!reduceMotion) {
        gsap.utils.toArray('[data-gsap-scan]').forEach((target) => {
          gsap.fromTo(target, {
            '--scan-x': '-140%',
            '--scan-alpha': 0,
          }, {
            '--scan-x': '140%',
            '--scan-alpha': 0.95,
            duration: 1.35,
            ease: 'power2.inOut',
            immediateRender: false,
            scrollTrigger: {
              trigger: target,
              start: 'top 78%',
              once: true,
            },
          });
        });
      }

      return () => observer.disconnect();
      });
    }, 900);

    return () => {
      window.clearTimeout(timer);
      context?.revert();
    };
  }, []);

  return null;
}
