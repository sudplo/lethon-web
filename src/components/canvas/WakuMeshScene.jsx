'use client';

import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const seededRandom = (seed) => {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};

export default function WakuMeshScene() {
  const pointsRef = useRef();
  const linesRef = useRef();
  const groupRef = useRef();
  const pointsMaterialRef = useRef();
  const lineMaterialRef = useRef();
  
  const { size, viewport } = useThree();

  // Responsive node count (lower on mobile to reduce collision/line calculation overhead by 75%)
  const nodeCount = size.width <= 768 ? 25 : 50;
  
  const { positions, velocities } = useMemo(() => {
    const positions = new Float32Array(nodeCount * 3);
    const velocities = [];
    
    // Distribute uniformly across the current viewport boundaries
    const spreadX = viewport.width + 100;
    const spreadY = viewport.height + 100;
    
    for(let i=0; i<nodeCount; i++) {
      positions[i*3] = (seededRandom(i + 1) - 0.5) * spreadX;
      positions[i*3+1] = (seededRandom(i + 101) - 0.5) * spreadY;
      positions[i*3+2] = (seededRandom(i + 201) - 0.5) * 200 - 100;
      
      velocities.push(new THREE.Vector3(
        (seededRandom(i + 301) - 0.5) * 0.5,
        (seededRandom(i + 401) - 0.5) * 0.5,
        (seededRandom(i + 501) - 0.5) * 0.2
      ));
    }
    
    return { positions, velocities };
  }, [nodeCount, viewport.width, viewport.height]);

  // For lines (we'll generate them dynamically based on distance)
  const maxLines = nodeCount * 4;
  const initialLinePositions = useMemo(() => new Float32Array(maxLines * 6), [maxLines]);
  const initialLineOpacities = useMemo(() => new Float32Array(maxLines * 2), [maxLines]);

  // Static lineUvs: 0.0 for start of segment, 1.0 for end of segment, repeating
  const lineUvs = useMemo(() => {
    const arr = new Float32Array(maxLines * 2);
    for (let i = 0; i < maxLines; i++) {
      arr[i * 2] = 0.0;
      arr[i * 2 + 1] = 1.0;
    }
    return arr;
  }, [maxLines]);

  // Points Shader Configuration
  const pointsShaderArgs = useMemo(() => ({
    uniforms: {
      uTime: { value: 0 },
    },
    vertexShader: `
      uniform float uTime;
      varying float vOpacity;
      
      void main() {
        vec3 pos = position;
        
        // Dynamic pulse animation offset by position to make it organic/irregular
        float pulse = sin(pos.x * 0.05 + pos.y * 0.05 + uTime * 2.0) * 0.5 + 0.5;
        vOpacity = 0.45 + pulse * 0.55;
        
        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_Position = projectionMatrix * mvPosition;
        
        // Point size scales with camera distance and dynamic pulse breathing
        gl_PointSize = (11.0 + pulse * 4.0) * (300.0 / -mvPosition.z);
      }
    `,
    fragmentShader: `
      varying float vOpacity;
      
      void main() {
        // Draw circular point with soft glow and bright core
        vec2 coord = gl_PointCoord - vec2(0.5);
        float dist = length(coord);
        
        if (dist > 0.5) discard;
        
        // Sigmoid/smoothstep for soft volumetric glow
        float glow = smoothstep(0.5, 0.05, dist);
        float core = smoothstep(0.18, 0.0, dist);
        
        vec3 baseColor = vec3(0.0, 0.96, 0.63); // Signature green
        vec3 coreColor = vec3(0.7, 1.0, 0.9); // Mint/bright core
        
        vec3 finalColor = mix(baseColor, coreColor, core * 0.65);
        float alpha = (glow * 0.75 + core * 0.25) * vOpacity;
        
        gl_FragColor = vec4(finalColor, alpha);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  }), []);

  // Lines Shader Configuration
  const lineShaderArgs = useMemo(() => ({
    uniforms: {
      uTime: { value: 0 },
    },
    vertexShader: `
      attribute float aOpacity;
      attribute float aLineUv;
      
      varying float vOpacity;
      varying float vLineUv;
      
      void main() {
        vOpacity = aOpacity;
        vLineUv = aLineUv;
        
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      uniform float uTime;
      
      varying float vOpacity;
      varying float vLineUv;
      
      void main() {
        if (vOpacity <= 0.0) discard;
        
        // Running signal pulse along the connection
        float pulseSpeed = 1.2;
        // Smooth continuous repeating waves
        float pulse = fract(vLineUv - uTime * pulseSpeed);
        float pulseGlow = smoothstep(0.2, 0.0, abs(pulse - 0.5));
        
        vec3 baseColor = vec3(0.12, 0.15, 0.19); // Slate grey-blue
        vec3 activeColor = vec3(0.0, 0.96, 0.63); // Signature green
        
        vec3 finalColor = mix(baseColor, activeColor, pulseGlow * 0.7);
        
        // Fade lines near the nodes at start (0.0) and end (1.0)
        float edgeFade = smoothstep(0.0, 0.15, vLineUv) * smoothstep(1.0, 0.85, vLineUv);
        
        float alpha = vOpacity * 0.28 * (1.0 + pulseGlow * 1.5) * edgeFade;
        
        gl_FragColor = vec4(finalColor, alpha);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  }), []);

  useFrame((state) => {
    if (!pointsRef.current || !linesRef.current) return;
    if (!linesRef.current.geometry.attributes.aOpacity || !linesRef.current.geometry.attributes.aLineUv) return;

    const posAttr = pointsRef.current.geometry.attributes.position;
    
    // Safeguard: Ensure the buffer size matches the current nodeCount before updating
    if (posAttr.count !== nodeCount) return;

    const scrollY = window.scrollY;
    groupRef.current.position.y = scrollY * 0.24;

    // Viewport-aware wrapping limits (plus padding)
    const boundaryX = viewport.width / 2 + 50;
    const boundaryY = viewport.height / 2 + 50;

    // Update node positions (drift)
    for(let i=0; i<nodeCount; i++) {
      posAttr.array[i*3] += velocities[i].x;
      posAttr.array[i*3+1] += velocities[i].y;
      posAttr.array[i*3+2] += velocities[i].z;

      // Wrap around screen boundaries
      if(posAttr.array[i*3] > boundaryX) posAttr.array[i*3] = -boundaryX;
      if(posAttr.array[i*3] < -boundaryX) posAttr.array[i*3] = boundaryX;
      if(posAttr.array[i*3+1] > boundaryY) posAttr.array[i*3+1] = -boundaryY;
      if(posAttr.array[i*3+1] < -boundaryY) posAttr.array[i*3+1] = boundaryY;
    }
    posAttr.needsUpdate = true;

    // Update Shader Material Time Uniforms
    if (pointsMaterialRef.current) {
      pointsMaterialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
    if (lineMaterialRef.current) {
      lineMaterialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }

    // Build connections
    let lineIdx = 0;
    const connectDist = 130;
    const connectDistSq = connectDist * connectDist;
    const linePositions = linesRef.current.geometry.attributes.position.array;
    const lineOpacities = linesRef.current.geometry.attributes.aOpacity.array;

    for(let i=0; i<nodeCount; i++) {
      for(let j=i+1; j<nodeCount; j++) {
        const dx = posAttr.array[i*3] - posAttr.array[j*3];
        const dy = posAttr.array[i*3+1] - posAttr.array[j*3+1];
        const dz = posAttr.array[i*3+2] - posAttr.array[j*3+2];
        const distSq = dx*dx + dy*dy + dz*dz;

        // Connect if close enough
        if(distSq < connectDistSq && lineIdx < maxLines) {
          const dist = Math.sqrt(distSq);
          const opacity = 1.0 - dist / connectDist;

          linePositions[lineIdx*6] = posAttr.array[i*3];
          linePositions[lineIdx*6+1] = posAttr.array[i*3+1];
          linePositions[lineIdx*6+2] = posAttr.array[i*3+2];
          linePositions[lineIdx*6+3] = posAttr.array[j*3];
          linePositions[lineIdx*6+4] = posAttr.array[j*3+1];
          linePositions[lineIdx*6+5] = posAttr.array[j*3+2];
          
          lineOpacities[lineIdx*2] = opacity;
          lineOpacities[lineIdx*2+1] = opacity;
          lineIdx++;
        }
      }
    }
    
    // Fill the rest with 0s to hide unused lines
    for(let i=lineIdx; i<maxLines; i++) {
      linePositions[i*6] = linePositions[i*6+1] = linePositions[i*6+2] = linePositions[i*6+3] = linePositions[i*6+4] = linePositions[i*6+5] = 0;
      lineOpacities[i*2] = lineOpacities[i*2+1] = 0.0;
    }

    linesRef.current.geometry.attributes.position.needsUpdate = true;
    linesRef.current.geometry.attributes.aOpacity.needsUpdate = true;
  });

  return (
    <group ref={groupRef}>
      <points ref={pointsRef}>
        <bufferGeometry key={nodeCount}>
          <bufferAttribute
            attach="attributes-position"
            count={nodeCount}
            array={positions}
            itemSize={3}
          />
        </bufferGeometry>
        <shaderMaterial
          ref={pointsMaterialRef}
          args={[pointsShaderArgs]}
        />
      </points>

      <lineSegments ref={linesRef}>
        <bufferGeometry key={maxLines}>
          <bufferAttribute
            attach="attributes-position"
            count={maxLines * 2}
            array={initialLinePositions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-aOpacity"
            count={maxLines * 2}
            array={initialLineOpacities}
            itemSize={1}
          />
          <bufferAttribute
            attach="attributes-aLineUv"
            count={maxLines * 2}
            array={lineUvs}
            itemSize={1}
          />
        </bufferGeometry>
        <shaderMaterial
          ref={lineMaterialRef}
          args={[lineShaderArgs]}
        />
      </lineSegments>
    </group>
  );
}
