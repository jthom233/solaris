'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { PlanetData, OrbitalElements } from '@/types';
import Planet from './Planet';
import OrbitLine from './OrbitLine';
import { calculatePlanetPosition } from '@/lib/orbital';
import { useScaleBlend, lerpScale } from './SolarSystem';

interface PlanetInOrbitProps {
  planetData: PlanetData;
  orbitalElements: OrbitalElements;
  navigableDistanceMultiplier: number;
  trueDistanceMultiplier: number;
  navigableSizeMultiplier: number;
  trueSizeMultiplier: number;
}

/**
 * Wraps a Planet and its OrbitLine, computing the orbital position and
 * animating between navigable and true scale modes using the shared blend ref.
 */
export default function PlanetInOrbit({
  planetData,
  orbitalElements,
  navigableDistanceMultiplier,
  trueDistanceMultiplier,
  navigableSizeMultiplier,
  trueSizeMultiplier,
}: PlanetInOrbitProps) {
  const groupRef = useRef<THREE.Group>(null);
  const blendRef = useScaleBlend();

  // Compute the raw orbital position in AU (recalculated per minute)
  const now = new Date();
  const minuteKey = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}-${now.getHours()}-${now.getMinutes()}`;

  const rawPosition = useMemo(() => {
    const pos = calculatePlanetPosition(orbitalElements, new Date());
    return new THREE.Vector3(pos.x, pos.y, pos.z);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orbitalElements, minuteKey]);

  // Animate position and scale every frame based on blend factor
  useFrame(() => {
    if (!groupRef.current) return;

    const blend = blendRef.current ?? 0;
    const distMul = lerpScale(navigableDistanceMultiplier, trueDistanceMultiplier, blend);
    const sizeMul = lerpScale(navigableSizeMultiplier, trueSizeMultiplier, blend);

    // Position: AU * distanceMultiplier
    groupRef.current.position.set(
      rawPosition.x * distMul,
      rawPosition.y * distMul,
      rawPosition.z * distMul,
    );

    // Size: interpolate the size multiplier. The base sceneRadius is designed for
    // navigable mode (sizeMultiplier = 0.3). Compute a relative scale factor.
    const sizeScale = sizeMul / navigableSizeMultiplier;
    groupRef.current.scale.setScalar(sizeScale);
  });

  // For the orbit line, pass the current navigable distance multiplier as the
  // "base" and let OrbitLine animate with the blend ref too
  return (
    <>
      <group ref={groupRef}>
        <Planet planetData={planetData} position={[0, 0, 0]} />
      </group>
      <OrbitLine
        orbitalElements={orbitalElements}
        color={planetData.accentColor}
        navigableDistanceMultiplier={navigableDistanceMultiplier}
        trueDistanceMultiplier={trueDistanceMultiplier}
      />
    </>
  );
}
