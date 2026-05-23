'use client';

import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const seededRandom = (seed) => {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};

function getThemeColors(activeSection, activeArchStep) {
  let main = '#00f5a0';
  let core = '#b3ffd6';
  let lineBase = '#080c10';

  switch(activeSection) {
    case 'hero':
      main = '#00f5a0';
      core = '#b3ffd6';
      lineBase = '#080c10';
      break;
    case 'statement':
      main = '#223344';
      core = '#475569';
      lineBase = '#090d13';
      break;
    case 'surveillance':
      main = '#f59e0b';
      core = '#ffe6cc';
      lineBase = '#130e08';
      break;
    case 'metadata':
      main = '#00e5ff';
      core = '#ccf9ff';
      lineBase = '#081116';
      break;
    case 'architecture':
      if (activeArchStep === '0') {
        main = '#f59e0b';
      } else if (activeArchStep === '1') {
        main = '#7b2fff';
      } else if (activeArchStep === '2') {
        main = '#1d9e75';
      } else {
        main = '#52c41a';
      }
      core = '#d9f7be';
      lineBase = '#0a1308';
      break;
    case 'voice':
      main = '#00f5a0';
      core = '#b3ffd6';
      lineBase = '#080c10';
      break;
    case 'communities':
      main = '#7b2fff';
      core = '#e6d6ff';
      lineBase = '#0d0816';
      break;
    case 'journey':
      main = '#00f5a0';
      core = '#b3ffd6';
      lineBase = '#080c10';
      break;
    case 'compare':
      main = '#334155';
      core = '#64748b';
      lineBase = '#0b0f14';
      break;
    case 'manifesto':
      main = '#00f5a0';
      core = '#b3ffd6';
      lineBase = '#080c10';
      break;
  }

  return { main, core, lineBase };
}

export default function WakuMeshScene() {
  const pointsRef = useRef();
  const linesRef = useRef();
  const groupRef = useRef();
  const pointsMaterialRef = useRef();
  const lineMaterialRef = useRef();
  const speedMultiplierRef = useRef(1.0);
  const scrollYRef = useRef(0);
  
  const { size, viewport } = useThree();

  // Responsive node count (lower on mobile to reduce collision/line calculation overhead by 75%)
  const nodeCount = size.width <= 768 ? 25 : 50;
  
  const { positions, velocities } = useMemo(() => {
    const positions = new Float32Array(nodeCount * 3);
    const velocities = [];
    
    // Use fixed reference spread bounds to stabilize nodes and connections on mount
    const spreadX = 1600;
    const spreadY = 1200;
    
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
  }, [nodeCount]);

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
      uColor: { value: new THREE.Color('#00f5a0') },
      uCoreColor: { value: new THREE.Color('#b3ffd6') },
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
      uniform vec3 uColor;
      uniform vec3 uCoreColor;
      varying float vOpacity;
      
      void main() {
        // Draw circular point with soft glow and bright core
        vec2 coord = gl_PointCoord - vec2(0.5);
        float dist = length(coord);
        
        if (dist > 0.5) discard;
        
        // Sigmoid/smoothstep for soft volumetric glow
        float glow = smoothstep(0.5, 0.05, dist);
        float core = smoothstep(0.18, 0.0, dist);
        
        vec3 finalColor = mix(uColor, uCoreColor, core * 0.65);
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
      uBaseColor: { value: new THREE.Color('#0c1017') },
      uActiveColor: { value: new THREE.Color('#00f5a0') },
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
      uniform vec3 uBaseColor;
      uniform vec3 uActiveColor;
      
      varying float vOpacity;
      varying float vLineUv;
      
      void main() {
        if (vOpacity <= 0.0) discard;
        
        // Running signal pulse along the connection
        float pulseSpeed = 1.2;
        // Smooth continuous repeating waves
        float pulse = fract(vLineUv - uTime * pulseSpeed);
        float pulseGlow = smoothstep(0.2, 0.0, abs(pulse - 0.5));
        
        vec3 finalColor = mix(uBaseColor, uActiveColor, pulseGlow * 0.7);
        
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

    // Smoothly lerp scroll translation to prevent jumps
    const targetScrollY = typeof window !== 'undefined' ? window.scrollY : 0;
    scrollYRef.current = THREE.MathUtils.lerp(scrollYRef.current, targetScrollY, 0.05);
    groupRef.current.position.y = scrollYRef.current * 0.24;

    // Read active section & step from document
    const activeSection = (typeof document !== 'undefined' && document.documentElement.dataset.activeSection) || 'hero';
    const activeArchStep = (typeof document !== 'undefined' && document.documentElement.dataset.activeArchStep) || '0';

    // Interpolate drift speed multiplier (slower lerp at 0.02)
    let targetSpeed = 1.0;
    if (activeSection === 'statement' || activeSection === 'compare') {
      targetSpeed = 0.25;
    } else if (activeSection === 'surveillance') {
      targetSpeed = 2.0;
    } else if (activeSection === 'metadata') {
      targetSpeed = 1.5;
    }
    speedMultiplierRef.current = THREE.MathUtils.lerp(speedMultiplierRef.current, targetSpeed, 0.02);

    // Viewport-aware wrapping limits (plus padding)
    const boundaryX = viewport.width / 2 + 50;
    const boundaryY = viewport.height / 2 + 50;

    // Update node positions (drift)
    for(let i=0; i<nodeCount; i++) {
      posAttr.array[i*3] += velocities[i].x * speedMultiplierRef.current;
      posAttr.array[i*3+1] += velocities[i].y * speedMultiplierRef.current;
      posAttr.array[i*3+2] += velocities[i].z * speedMultiplierRef.current;

      // Wrap around screen boundaries
      if(posAttr.array[i*3] > boundaryX) posAttr.array[i*3] = -boundaryX;
      if(posAttr.array[i*3] < -boundaryX) posAttr.array[i*3] = boundaryX;
      if(posAttr.array[i*3+1] > boundaryY) posAttr.array[i*3+1] = -boundaryY;
      if(posAttr.array[i*3+1] < -boundaryY) posAttr.array[i*3+1] = boundaryY;
    }
    posAttr.needsUpdate = true;

    // Interpolate colors based on section themes (slower lerp at 0.02)
    const { main, core, lineBase } = getThemeColors(activeSection, activeArchStep);
    
    const targetMainColor = new THREE.Color(main);
    const targetCoreColor = new THREE.Color(core);
    const targetLineBaseColor = new THREE.Color(lineBase);

    // Update Shader Material Time & Color Uniforms (lerped at 0.02)
    if (pointsMaterialRef.current) {
      pointsMaterialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
      pointsMaterialRef.current.uniforms.uColor.value.lerp(targetMainColor, 0.02);
      pointsMaterialRef.current.uniforms.uCoreColor.value.lerp(targetCoreColor, 0.02);
    }
    if (lineMaterialRef.current) {
      lineMaterialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
      lineMaterialRef.current.uniforms.uBaseColor.value.lerp(targetLineBaseColor, 0.02);
      lineMaterialRef.current.uniforms.uActiveColor.value.lerp(targetMainColor, 0.02);
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
