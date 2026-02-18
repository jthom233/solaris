'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { useSolarSystemStore } from '@/stores/solarSystemStore';
import { getPlanetById } from '@/data/planets';
import { orbitalElements } from '@/data/orbitalElements';
import { calculatePlanetPosition } from '@/lib/orbital';
import { NAVIGABLE_SCALE, TRUE_SCALE } from '@/lib/constants';
import { useScaleBlend, lerpScale } from './SolarSystem';

/** Default overview camera position */
const HOME_POSITION = new THREE.Vector3(0, 50, 100);
/** Default overview look-at target */
const HOME_TARGET = new THREE.Vector3(0, 0, 0);

/** Intro camera — starts further away for dramatic pull-in */
const INTRO_POSITION = new THREE.Vector3(0, 120, 250);

/** Lerp speed — higher is snappier */
const LERP_FACTOR = 0.03;
/** Distance threshold to consider the transition "done" */
const ARRIVE_THRESHOLD = 0.5;

export default function CameraController() {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const { camera } = useThree();
  const selectedPlanet = useSolarSystemStore((s) => s.selectedPlanet);
  const isIntroComplete = useSolarSystemStore((s) => s.isIntroComplete);
  const blendRef = useScaleBlend();

  const [isTransitioning, setIsTransitioning] = useState(false);
  const hasInitialized = useRef(false);

  // Target vectors for smooth interpolation
  const targetPosition = useRef(INTRO_POSITION.clone());
  const targetLookAt = useRef(HOME_TARGET.clone());

  // Initialize camera to intro position on first mount
  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      if (!isIntroComplete) {
        camera.position.copy(INTRO_POSITION);
        camera.lookAt(HOME_TARGET);
        // Begin transitioning toward HOME after placement
        targetPosition.current.copy(HOME_POSITION);
        targetLookAt.current.copy(HOME_TARGET);
        setIsTransitioning(true);
      }
    }
  }, [camera, isIntroComplete]);

  // When intro completes, ensure we're heading home
  useEffect(() => {
    if (isIntroComplete && !selectedPlanet) {
      targetPosition.current.copy(HOME_POSITION);
      targetLookAt.current.copy(HOME_TARGET);
      setIsTransitioning(true);
    }
  }, [isIntroComplete, selectedPlanet]);

  /**
   * Compute the desired camera position and look-at for a planet.
   * Uses the current animated scale blend for correct positioning.
   */
  const getPlanetCameraTarget = useCallback(
    (planetId: string): { position: THREE.Vector3; lookAt: THREE.Vector3 } | null => {
      const planet = getPlanetById(planetId);
      if (!planet) return null;

      const elements = orbitalElements[planetId];
      if (!elements) return null;

      const pos = calculatePlanetPosition(elements, new Date());
      const blend = blendRef.current ?? 0;
      const scale = lerpScale(
        NAVIGABLE_SCALE.distanceMultiplier,
        TRUE_SCALE.distanceMultiplier,
        blend,
      );
      const sizeMul = lerpScale(
        NAVIGABLE_SCALE.sizeMultiplier,
        TRUE_SCALE.sizeMultiplier,
        blend,
      );

      const worldPos = new THREE.Vector3(
        pos.x * scale,
        pos.y * scale,
        pos.z * scale,
      );

      // Offset the camera based on planet radius and current size so it frames nicely
      const effectiveRadius = planet.sceneRadius * (sizeMul / NAVIGABLE_SCALE.sizeMultiplier);
      const offset = effectiveRadius * 4 + 2;
      const cameraPos = worldPos
        .clone()
        .add(new THREE.Vector3(offset, offset * 0.5, offset));

      return { position: cameraPos, lookAt: worldPos };
    },
    [blendRef],
  );

  // When selectedPlanet changes, compute new targets and begin transitioning
  useEffect(() => {
    if (selectedPlanet) {
      const result = getPlanetCameraTarget(selectedPlanet);
      if (result) {
        targetPosition.current.copy(result.position);
        targetLookAt.current.copy(result.lookAt);
        setIsTransitioning(true);
      }
    } else if (isIntroComplete) {
      // Go home
      targetPosition.current.copy(HOME_POSITION);
      targetLookAt.current.copy(HOME_TARGET);
      setIsTransitioning(true);
    }
  }, [selectedPlanet, getPlanetCameraTarget, isIntroComplete]);

  // Animate camera during transitions
  useFrame(() => {
    if (!isTransitioning) return;

    // Lerp camera position
    camera.position.lerp(targetPosition.current, LERP_FACTOR);

    // Lerp look-at via a temporary vector
    const currentLookAt = new THREE.Vector3();
    camera.getWorldDirection(currentLookAt);
    currentLookAt.multiplyScalar(10).add(camera.position);
    currentLookAt.lerp(targetLookAt.current, LERP_FACTOR);
    camera.lookAt(currentLookAt);

    // Check if we've arrived
    const distToTarget = camera.position.distanceTo(targetPosition.current);
    if (distToTarget < ARRIVE_THRESHOLD) {
      // Snap to final position
      camera.position.copy(targetPosition.current);
      camera.lookAt(targetLookAt.current);

      // Update OrbitControls target so it takes over smoothly
      if (controlsRef.current) {
        controlsRef.current.target.copy(targetLookAt.current);
        controlsRef.current.update();
      }

      setIsTransitioning(false);
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enabled={!isTransitioning && isIntroComplete}
      enablePan={!selectedPlanet}
      minDistance={2}
      maxDistance={500}
      enableDamping
      dampingFactor={0.05}
    />
  );
}
