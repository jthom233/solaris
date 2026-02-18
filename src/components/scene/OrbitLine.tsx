'use client';

import { useMemo, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Line } from '@react-three/drei';
import type { OrbitalElements } from '@/types';
import { calculateOrbitalPath } from '@/lib/orbital';
import { useScaleBlend, lerpScale } from './SolarSystem';

interface OrbitLineProps {
  orbitalElements: OrbitalElements;
  color: string;
  navigableDistanceMultiplier: number;
  trueDistanceMultiplier: number;
}

export default function OrbitLine({
  orbitalElements,
  color,
  navigableDistanceMultiplier,
  trueDistanceMultiplier,
}: OrbitLineProps) {
  const blendRef = useScaleBlend();
  const groupRef = useRef<THREE.Group>(null);

  // Store the last applied scale for incremental scaling
  const lastScaleRef = useRef(navigableDistanceMultiplier);

  // Calculate orbit path points at the navigable scale (base scale = 1 for the group)
  const points = useMemo(() => {
    const path = calculateOrbitalPath(orbitalElements, 128);
    return path.map(
      ([x, y, z]) =>
        [
          x * navigableDistanceMultiplier,
          y * navigableDistanceMultiplier,
          z * navigableDistanceMultiplier,
        ] as [number, number, number],
    );
  }, [orbitalElements, navigableDistanceMultiplier]);

  // Initialize scale on mount
  useEffect(() => {
    lastScaleRef.current = navigableDistanceMultiplier;
  }, [navigableDistanceMultiplier]);

  // Animate the orbit line scale based on blend factor
  useFrame(() => {
    if (!groupRef.current) return;

    const blend = blendRef.current ?? 0;
    const currentDistMul = lerpScale(navigableDistanceMultiplier, trueDistanceMultiplier, blend);
    // Scale the group relative to the navigable base
    const scaleFactor = currentDistMul / navigableDistanceMultiplier;
    groupRef.current.scale.setScalar(scaleFactor);
  });

  return (
    <group ref={groupRef}>
      <Line
        points={points}
        color={color}
        lineWidth={0.5}
        opacity={0.3}
        transparent
      />
    </group>
  );
}
