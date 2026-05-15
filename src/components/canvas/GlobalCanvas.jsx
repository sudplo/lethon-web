'use client';

import { Canvas } from '@react-three/fiber';
import { Preload } from '@react-three/drei';
import BackgroundGrid from './BackgroundGrid';
import WakuMeshScene from './WakuMeshScene';

export default function GlobalCanvas() {
  return (
    <div id="canvas-container">
      <Canvas
        camera={{ position: [0, 0, 500], fov: 45, near: 0.1, far: 2000 }}
        dpr={[1, 2]} // Support retina screens but cap at 2x for performance
        gl={{ alpha: true, antialias: false }} // antialias false is fine for simple points/lines, better perf
      >
        <BackgroundGrid />
        <WakuMeshScene />
        
        <Preload all />
      </Canvas>
    </div>
  );
}
