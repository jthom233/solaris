'use client';

import { useRef, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useScaleBlend, lerpScale } from './SolarSystem';
import { SUN_VERTEX, SUN_FRAGMENT, createSunUniforms } from '@/shaders/sun';

interface SunProps {
  navigableSunSize: number;
  trueSunSize: number;
}

export default function Sun({ navigableSunSize, trueSunSize }: SunProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const blendRef = useScaleBlend();

  const uniforms = useMemo(() => createSunUniforms(), []);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: SUN_VERTEX,
        fragmentShader: SUN_FRAGMENT,
        uniforms,
      }),
    [uniforms],
  );

  // Enable bloom layer (layer 1) so post-processing picks it up
  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.layers.enable(1);
    }
  }, []);

  // Slow rotation + animated size transition + update time uniform
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.05;

      // Animate the Sun's scale based on the blend factor
      const currentSize = lerpScale(navigableSunSize, trueSunSize, blendRef.current ?? 0);
      const baseSize = navigableSunSize; // geometry is created at navigable size
      const scaleFactor = currentSize / baseSize;
      meshRef.current.scale.setScalar(scaleFactor);
    }

    // Update time uniform for animated shader
    uniforms.time.value = state.clock.elapsedTime;
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]} material={material}>
      <sphereGeometry args={[navigableSunSize, 64, 64]} />
    </mesh>
  );
}
