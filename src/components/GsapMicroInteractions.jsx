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

      document.querySelectorAll('[data-scroll-section]').forEach((section) => {
        ScrollTrigger.create({
          trigger: section,
          start: 'top 58%',
          end: 'bottom 42%',
          toggleClass: { targets: section, className: 'is-section-active' },
          onToggle: (self) => {
            document.documentElement.dataset.activeSection = self.isActive
              ? section.id || 'section'
              : '';
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
