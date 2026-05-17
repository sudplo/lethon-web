'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const seededRandom = (seed) => {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};

export default function WakuMeshScene() {
  const pointsRef = useRef();
  const linesRef = useRef();
  const groupRef = useRef();

  // Params
  const nodeCount = 50;
  
  const { positions, velocities } = useMemo(() => {
    const positions = new Float32Array(nodeCount * 3);
    const velocities = [];
    
    for(let i=0; i<nodeCount; i++) {
      positions[i*3] = (seededRandom(i + 1) - 0.5) * 800;
      positions[i*3+1] = (seededRandom(i + 101) - 0.5) * 800;
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
  // Max lines = nodeCount * nodeCount / 2, but we only connect close ones
  const maxLines = nodeCount * 4;
  const initialLinePositions = useMemo(() => new Float32Array(maxLines * 6), [maxLines]);

  useFrame((state) => {
    if (!pointsRef.current || !linesRef.current) return;

    const posAttr = pointsRef.current.geometry.attributes.position;
    const scrollY = window.scrollY;
    
    groupRef.current.position.y = scrollY * 0.24;

    // Update node positions (drift)
    for(let i=0; i<nodeCount; i++) {
      posAttr.array[i*3] += velocities[i].x;
      posAttr.array[i*3+1] += velocities[i].y;
      posAttr.array[i*3+2] += velocities[i].z;

      // Wrap around bounds
      if(posAttr.array[i*3] > 400) posAttr.array[i*3] = -400;
      if(posAttr.array[i*3] < -400) posAttr.array[i*3] = 400;
      if(posAttr.array[i*3+1] > 400) posAttr.array[i*3+1] = -400;
      if(posAttr.array[i*3+1] < -400) posAttr.array[i*3+1] = 400;
    }
    posAttr.needsUpdate = true;

    // Build connections
    let lineIdx = 0;
    for(let i=0; i<nodeCount; i++) {
      for(let j=i+1; j<nodeCount; j++) {
        const dx = posAttr.array[i*3] - posAttr.array[j*3];
        const dy = posAttr.array[i*3+1] - posAttr.array[j*3+1];
        const dz = posAttr.array[i*3+2] - posAttr.array[j*3+2];
        const distSq = dx*dx + dy*dy + dz*dz;

        // Connect if close enough (e.g. distance < 150)
        if(distSq < 22500 && lineIdx < maxLines) {
          const linePositions = linesRef.current.geometry.attributes.position.array;
          linePositions[lineIdx*6] = posAttr.array[i*3];
          linePositions[lineIdx*6+1] = posAttr.array[i*3+1];
          linePositions[lineIdx*6+2] = posAttr.array[i*3+2];
          linePositions[lineIdx*6+3] = posAttr.array[j*3];
          linePositions[lineIdx*6+4] = posAttr.array[j*3+1];
          linePositions[lineIdx*6+5] = posAttr.array[j*3+2];
          lineIdx++;
        }
      }
    }
    
    // Fill the rest with 0s to hide unused lines
    const linePositions = linesRef.current.geometry.attributes.position.array;
    for(let i=lineIdx; i<maxLines; i++) {
      linePositions[i*6] = linePositions[i*6+1] = linePositions[i*6+2] = linePositions[i*6+3] = linePositions[i*6+4] = linePositions[i*6+5] = 0;
    }

    linesRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <group ref={groupRef}>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={nodeCount}
            array={positions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial size={3} color="#888888" transparent opacity={0.6} sizeAttenuation={true} />
      </points>

      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={maxLines * 2}
            array={initialLinePositions}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#555555" transparent opacity={0.3} />
      </lineSegments>
    </group>
  );
}
