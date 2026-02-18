'use client';

import { Suspense, useRef, createContext, useContext } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { getPlanetsOnly } from '@/data/planets';
import { orbitalElements } from '@/data/orbitalElements';
import { NAVIGABLE_SCALE, TRUE_SCALE } from '@/lib/constants';
import { useSolarSystemStore } from '@/stores/solarSystemStore';
import Lighting from './Lighting';
import StarField from './StarField';
import CameraController from './CameraController';
import Sun from './Sun';
import PlanetInOrbit from './PlanetInOrbit';
import Effects from './Effects';

/** All planets excluding the Sun (the Sun is rendered separately at origin). */
const planetList = getPlanetsOnly();

/**
 * Context that provides the animated scale blend factor (0 = navigable, 1 = true).
 * Components inside the Canvas can read this to interpolate between scale modes.
 */
interface ScaleBlendContextValue {
  /** Ref containing the current blend factor: 0 = navigable, 1 = true scale */
  blendRef: React.RefObject<number>;
}

const ScaleBlendContext = createContext<ScaleBlendContextValue>({
  blendRef: { current: 0 },
});

export function useScaleBlend(): React.RefObject<number> {
  return useContext(ScaleBlendContext).blendRef;
}

/**
 * Inner component that runs inside the Canvas and drives the
 * scale blend animation via useFrame. It provides the animated
 * blend value through context to all scene children.
 */
function ScaleAnimator({ children }: { children: React.ReactNode }) {
  const scaleMode = useSolarSystemStore((s) => s.scaleMode);
  const blendRef = useRef<number>(scaleMode === 'navigable' ? 0 : 1);

  useFrame((_state, delta) => {
    const target = scaleMode === 'navigable' ? 0 : 1;
    const current = blendRef.current;
    if (Math.abs(current - target) > 0.001) {
      // Lerp toward the target; ~1.5s transition at 60fps
      // Using a speed-based lerp: move 3 * delta toward target per second
      const speed = 2.0;
      blendRef.current = THREE.MathUtils.lerp(current, target, 1 - Math.exp(-speed * delta));
    } else {
      blendRef.current = target;
    }
  });

  return (
    <ScaleBlendContext.Provider value={{ blendRef }}>
      {children}
    </ScaleBlendContext.Provider>
  );
}

/**
 * Interpolate a scale value between navigable and true scale using the blend factor.
 */
export function lerpScale(navigableValue: number, trueValue: number, blend: number): number {
  return navigableValue + (trueValue - navigableValue) * blend;
}

export default function SolarSystem() {
  return (
    <Canvas
      camera={{
        fov: 45,
        near: 0.1,
        far: 10000,
        position: [0, 50, 100],
      }}
      gl={{
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
      }}
      style={{
        width: '100vw',
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
      }}
    >
      <Suspense fallback={null}>
        <ScaleAnimator>
          <Lighting />
          <StarField />
          <CameraController />
          <Sun
            navigableSunSize={NAVIGABLE_SCALE.sunSize}
            trueSunSize={TRUE_SCALE.sunSize}
          />

          {planetList.map((planet) => {
            const elements = orbitalElements[planet.id];
            if (!elements) return null;
            return (
              <PlanetInOrbit
                key={planet.id}
                planetData={planet}
                orbitalElements={elements}
                navigableDistanceMultiplier={NAVIGABLE_SCALE.distanceMultiplier}
                trueDistanceMultiplier={TRUE_SCALE.distanceMultiplier}
                navigableSizeMultiplier={NAVIGABLE_SCALE.sizeMultiplier}
                trueSizeMultiplier={TRUE_SCALE.sizeMultiplier}
              />
            );
          })}

          <Effects />
        </ScaleAnimator>
      </Suspense>
    </Canvas>
  );
}
