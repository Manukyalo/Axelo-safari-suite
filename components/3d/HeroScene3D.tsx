'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

const ParticleTerrain = () => {
  const ref = useRef<THREE.Points>(null);
  const { mouse, viewport } = useThree();

  // Generate grid points for the terrain
  const positions = useMemo(() => {
    const count = 3000;
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      // Create a large flat plane
      const x = (Math.random() - 0.5) * 20;
      const z = (Math.random() - 0.5) * 20;
      // Y will be updated in useFrame
      const y = 0;
      
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
    }

    return positions;
  }, []);

  useFrame((state) => {
    if (!ref.current) return;
    const time = state.clock.getElapsedTime();
    const positions = ref.current.geometry.attributes.position.array as Float32Array;

    for (let i = 0; i < positions.length / 3; i++) {
      const x = positions[i * 3];
      const z = positions[i * 3 + 2];

      // Create flowing wave effect
      const waveX = Math.sin(x * 0.5 + time * 0.5) * 0.5;
      const waveZ = Math.cos(z * 0.5 + time * 0.3) * 0.5;
      
      positions[i * 3 + 1] = waveX + waveZ;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;

    // Gentle parallax based on mouse
    const targetX = (mouse.x * viewport.width) / 20;
    const targetY = (mouse.y * viewport.height) / 20;
    
    ref.current.rotation.x += (targetY * 0.1 - ref.current.rotation.x) * 0.05;
    ref.current.rotation.y += (targetX * 0.1 - ref.current.rotation.y) * 0.05;
  });

  return (
    <group rotation={[Math.PI / 3, 0, 0]} position={[0, -2, -5]}>
      <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#C4882C"
          size={0.03}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.6}
        />
      </Points>
    </group>
  );
};

export default function HeroScene3D() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
        <fog attach="fog" args={['#0C0906', 3, 10]} />
        <ParticleTerrain />
      </Canvas>
    </div>
  );
}
