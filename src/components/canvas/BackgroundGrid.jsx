'use client';

import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';

export default function BackgroundGrid() {
  const pointsRef = useRef();
  const materialRef = useRef();
  const { size, viewport } = useThree();

  // Mouse tracking
  const mouse = useRef(new THREE.Vector2(-1000, -1000)); // Start offscreen

  // Grid params
  const spacing = 40; // 40px grid

  const { positions, uvs } = useMemo(() => {
    // Determine how many points fit in screen + some buffer
    // Since camera is at z=500, we need to map pixel coordinates to world coords.
    // An easy way for a fixed background is to just use a very large plane,
    // or perfectly match the frustum to pixel sizes.
    // Let's use an Orthographic approach conceptually within Perspective,
    // or just make it large enough to cover any standard screen.
    
    // We'll cover 4000x4000 area which covers most screens at z=0 with camera at z=500
    const width = 4000;
    const height = 4000;
    const cols = Math.ceil(width / spacing);
    const rows = Math.ceil(height / spacing);
    
    const numPoints = cols * rows;
    const positions = new Float32Array(numPoints * 3);
    const uvs = new Float32Array(numPoints * 2);

    let index = 0;
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        // Centered around 0,0
        const x = (i - cols / 2) * spacing;
        const y = (j - rows / 2) * spacing;
        
        positions[index * 3] = x;
        positions[index * 3 + 1] = y;
        positions[index * 3 + 2] = 0;
        
        uvs[index * 2] = i / cols;
        uvs[index * 2 + 1] = j / rows;
        
        index++;
      }
    }

    return { positions, uvs };
  }, [spacing]);

  const hasFinePointer = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  }, []);

  useFrame((state) => {
    if (hasFinePointer) {
      // Update mouse position mapped to our viewport scale (frustum space at z=0)
      mouse.current.x = state.pointer.x * (viewport.width / 2);
      mouse.current.y = state.pointer.y * (viewport.height / 2);
    } else {
      // Keep offscreen on touch devices
      mouse.current.set(-10000, -10000);
    }

    if (materialRef.current) {
      materialRef.current.uniforms.uMouse.value.copy(mouse.current);
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;

      // Dynamic theme morphing based on active section
      const activeSection = (typeof document !== 'undefined' && document.documentElement.dataset.activeSection) || 'hero';
      const activeArchStep = (typeof document !== 'undefined' && document.documentElement.dataset.activeArchStep) || '0';

      let targetColorStr = '#00f5a0';
      let targetOpacity = 0.12;
      let targetMaxDistMult = 1.0;

      switch(activeSection) {
        case 'hero':
          targetColorStr = '#00f5a0';
          targetOpacity = 0.12;
          targetMaxDistMult = 1.0;
          break;
        case 'statement':
          targetColorStr = '#1e293b';
          targetOpacity = 0.04;
          targetMaxDistMult = 0.5;
          break;
        case 'surveillance':
          targetColorStr = '#f59e0b';
          targetOpacity = 0.08;
          targetMaxDistMult = 1.3;
          break;
        case 'metadata':
          targetColorStr = '#00e5ff';
          targetOpacity = 0.15;
          targetMaxDistMult = 0.8;
          break;
        case 'architecture':
          if (activeArchStep === '0') {
            targetColorStr = '#f59e0b';
          } else if (activeArchStep === '1') {
            targetColorStr = '#7b2fff';
          } else if (activeArchStep === '2') {
            targetColorStr = '#1d9e75';
          } else {
            targetColorStr = '#52c41a';
          }
          targetOpacity = 0.12;
          targetMaxDistMult = 1.0;
          break;
        case 'voice':
          targetColorStr = '#00f5a0';
          targetOpacity = 0.10;
          targetMaxDistMult = 1.0;
          break;
        case 'communities':
          targetColorStr = '#7b2fff';
          targetOpacity = 0.08;
          targetMaxDistMult = 1.0;
          break;
        case 'journey':
          targetColorStr = '#00f5a0';
          targetOpacity = 0.08;
          targetMaxDistMult = 0.8;
          break;
        case 'compare':
          targetColorStr = '#334155';
          targetOpacity = 0.05;
          targetMaxDistMult = 0.6;
          break;
        case 'manifesto':
          targetColorStr = '#00f5a0';
          targetOpacity = 0.12;
          targetMaxDistMult = 1.0;
          break;
      }

      const targetColor = new THREE.Color(targetColorStr);
      materialRef.current.uniforms.uColor.value.lerp(targetColor, 0.04);
      
      materialRef.current.uniforms.uBaseOpacity.value = THREE.MathUtils.lerp(
        materialRef.current.uniforms.uBaseOpacity.value,
        targetOpacity,
        0.04
      );

      const targetMaxDist = viewport.height * 0.15 * targetMaxDistMult;
      materialRef.current.uniforms.uMaxDist.value = THREE.MathUtils.lerp(
        materialRef.current.uniforms.uMaxDist.value,
        targetMaxDist,
        0.04
      );
    }
  });

  // Custom shader for points to handle cursor repulsion
  const shaderArgs = useMemo(() => ({
    uniforms: {
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(-1000, -1000) },
      uMaxDist: { value: 60.0 },
      uColor: { value: new THREE.Color('#00f5a0') },
      uBaseOpacity: { value: 0.12 },
    },
    vertexShader: `
      uniform float uTime;
      uniform vec2 uMouse;
      uniform float uMaxDist;
      
      varying vec2 vUv;
      varying float vScanGlow;
      varying float vMouseActive;
      
      void main() {
        vUv = uv;
        vec3 pos = position;
        
        // Repulsion logic
        float dist = distance(pos.xy, uMouse);
        if(dist < uMaxDist) {
          float force = (uMaxDist - dist) / uMaxDist;
          vec2 dir = normalize(pos.xy - uMouse);
          pos.xy += dir * force * (uMaxDist * 0.1); 
        }
        
        // Pulse breathing effect (4s cycle)
        pos.z += sin(pos.x * 0.01 + uTime * 1.5) * 5.0;
        
        // Scanline sweep wave (slow radar ping travelling down)
        float scanSpeed = 180.0;
        float scanPeriod = 3600.0;
        float yScan = mod(uTime * scanSpeed, scanPeriod) - 1800.0;
        
        float distToScan = abs(pos.y - yScan);
        float scanGlow = 0.0;
        if(distToScan < 250.0) {
          scanGlow = (250.0 - distToScan) / 250.0;
          scanGlow = pow(scanGlow, 3.0);
        }
        vScanGlow = scanGlow;
        
        // Mouse activity
        float mouseActive = 0.0;
        if(dist < uMaxDist) {
          mouseActive = (uMaxDist - dist) / uMaxDist;
        }
        vMouseActive = mouseActive;
        
        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_Position = projectionMatrix * mvPosition;
        
        // Dynamically scale point sizes
        gl_PointSize = 1.3 + (scanGlow * 1.5) + (mouseActive * 1.5);
        gl_PointSize *= (500.0 / -mvPosition.z);
      }
    `,
    fragmentShader: `
      uniform vec3 uColor;
      uniform float uBaseOpacity;
      uniform float uTime;
      
      varying vec2 vUv;
      varying float vScanGlow;
      varying float vMouseActive;
      
      void main() {
        float dist = distance(gl_PointCoord, vec2(0.5));
        if(dist > 0.5) discard;
        
        // Slate blue-grey base, signature green active
        vec3 baseColor = vec3(0.12, 0.15, 0.19);
        vec3 activeColor = vec3(0.0, 0.96, 0.63);
        
        float blendFactor = max(vMouseActive, vScanGlow * 0.7);
        vec3 finalColor = mix(baseColor, activeColor, blendFactor);
        
        float pulse = sin(uTime * 1.2) * 0.02;
        float alpha = uBaseOpacity + pulse + (vScanGlow * 0.16) + (vMouseActive * 0.4);
        
        gl_FragColor = vec4(finalColor, alpha);
      }
    `,
    transparent: true,
    depthWrite: false,
  }), []);

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-uv"
          count={uvs.length / 2}
          array={uvs}
          itemSize={2}
        />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        args={[shaderArgs]}
      />
    </points>
  );
}
