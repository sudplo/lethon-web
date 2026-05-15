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

  useFrame((state) => {
    // Update mouse position mapped to our plane scale
    // Pointer is normalized (-1 to 1)
    mouse.current.x = state.pointer.x * (size.width / 2);
    mouse.current.y = state.pointer.y * (size.height / 2);

    if (materialRef.current) {
      materialRef.current.uniforms.uMouse.value.copy(mouse.current);
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
      
      // Update global opacity based on scroll velocity/state (placeholder for now)
      // The spec says: "Malla de puntos microscópicos respiran (pulse 4s ciclo)" initially,
      // and "Zona de scroll activa: se encienden levemente (opacity 0.15 -> 0.35)".
    }
  });

  // Custom shader for points to handle cursor repulsion
  const shaderArgs = useMemo(() => ({
    uniforms: {
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(-1000, -1000) },
      uColor: { value: new THREE.Color('#ffffff') },
      uBaseOpacity: { value: 0.15 },
    },
    vertexShader: `
      uniform float uTime;
      uniform vec2 uMouse;
      
      varying vec2 vUv;
      
      void main() {
        vUv = uv;
        vec3 pos = position;
        
        // Repulsion logic
        float dist = distance(pos.xy, uMouse);
        float maxDist = 150.0;
        if(dist < maxDist) {
          float force = (maxDist - dist) / maxDist;
          // Push away from mouse gently
          vec2 dir = normalize(pos.xy - uMouse);
          pos.xy += dir * force * 15.0; // max displacement 15 units
        }
        
        // Pulse breathing effect (pulse 4s ciclo)
        pos.z += sin(pos.x * 0.01 + uTime * 1.5) * 5.0;
        
        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_Position = projectionMatrix * mvPosition;
        
        // Size of the points (diminutos, imperceptibles)
        gl_PointSize = 1.5;
        // Perspective attenuation
        gl_PointSize *= (500.0 / -mvPosition.z);
      }
    `,
    fragmentShader: `
      uniform vec3 uColor;
      uniform float uBaseOpacity;
      uniform float uTime;
      varying vec2 vUv;
      
      void main() {
        // Circular point
        float dist = distance(gl_PointCoord, vec2(0.5));
        if(dist > 0.5) discard;
        
        // Pulse alpha slightly based on time
        float alpha = uBaseOpacity + sin(uTime * (6.28 / 4.0)) * 0.05; 
        
        gl_FragColor = vec4(uColor, alpha);
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
