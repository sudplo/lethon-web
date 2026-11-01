'use client';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
  // La barra de direcciones del móvil sube y baja: no recalcular en cada cambio.
  ScrollTrigger.config({ ignoreMobileResize: true });
}

// Movimiento completo solo si el lector no ha pedido menos y la pantalla tiene altura útil.
export const FULL_MOTION = '(prefers-reduced-motion: no-preference) and (min-height: 560px)';

export { gsap, ScrollTrigger, useGSAP };
