'use client';

import { useRef, useState, useCallback, useMemo } from 'react';
import { useFrame, ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';
import type { PlanetData } from '@/types';
import { useSolarSystemStore } from '@/stores/solarSystemStore';

import {
  ROCKY_VERTEX,
  MERCURY_FRAGMENT,
  MARS_FRAGMENT,
  PLUTO_FRAGMENT,
  createRockyPlanetUniforms,
} from '@/shaders/rockyPlanet';
import { VENUS_VERTEX, VENUS_FRAGMENT, createVenusUniforms } from '@/shaders/venus';
import { EARTH_VERTEX, EARTH_FRAGMENT, createEarthUniforms } from '@/shaders/earth';
import {
  GAS_GIANT_VERTEX,
  JUPITER_FRAGMENT,
  SATURN_FRAGMENT,
  URANUS_FRAGMENT,
  NEPTUNE_FRAGMENT,
  createGasGiantUniforms,
} from '@/shaders/gasGiant';

interface PlanetProps {
  planetData: PlanetData;
  position: [number, number, number];
}

// The Sun is always at the world origin, so sunPosition is always vec3(0,0,0).
const SUN_POSITION: [number, number, number] = [0, 0, 0];

interface PlanetShaderSetup {
  material: THREE.ShaderMaterial;
  updateTime: (time: number) => void;
}

/**
 * Builds the appropriate ShaderMaterial for a given planet ID.
 * All uniform interfaces extend Record<string, THREE.IUniform>, so they are
 * directly compatible with THREE.ShaderMaterial's uniforms parameter.
 */
function usePlanetMaterial(planetId: string): PlanetShaderSetup {
  return useMemo<PlanetShaderSetup>(() => {
    let vertexShader: string;
    let fragmentShader: string;
    let uniforms: Record<string, THREE.IUniform>;
    let timeUniform: THREE.IUniform<number>;

    switch (planetId) {
      case 'mercury': {
        const u = createRockyPlanetUniforms();
        u.sunPosition.value = SUN_POSITION;
        vertexShader = ROCKY_VERTEX;
        fragmentShader = MERCURY_FRAGMENT;
        uniforms = u;
        timeUniform = u.time;
        break;
      }
      case 'venus': {
        const u = createVenusUniforms();
        u.sunPosition.value = SUN_POSITION;
        vertexShader = VENUS_VERTEX;
        fragmentShader = VENUS_FRAGMENT;
        uniforms = u;
        timeUniform = u.time;
        break;
      }
      case 'earth': {
        const u = createEarthUniforms();
        u.sunPosition.value = SUN_POSITION;
        vertexShader = EARTH_VERTEX;
        fragmentShader = EARTH_FRAGMENT;
        uniforms = u;
        timeUniform = u.time;
        break;
      }
      case 'mars': {
        const u = createRockyPlanetUniforms();
        u.sunPosition.value = SUN_POSITION;
        vertexShader = ROCKY_VERTEX;
        fragmentShader = MARS_FRAGMENT;
        uniforms = u;
        timeUniform = u.time;
        break;
      }
      case 'jupiter': {
        const u = createGasGiantUniforms();
        u.sunPosition.value = SUN_POSITION;
        vertexShader = GAS_GIANT_VERTEX;
        fragmentShader = JUPITER_FRAGMENT;
        uniforms = u;
        timeUniform = u.time;
        break;
      }
      case 'saturn': {
        const u = createGasGiantUniforms();
        u.sunPosition.value = SUN_POSITION;
        vertexShader = GAS_GIANT_VERTEX;
        fragmentShader = SATURN_FRAGMENT;
        uniforms = u;
        timeUniform = u.time;
        break;
      }
      case 'uranus': {
        const u = createGasGiantUniforms();
        u.sunPosition.value = SUN_POSITION;
        vertexShader = GAS_GIANT_VERTEX;
        fragmentShader = URANUS_FRAGMENT;
        uniforms = u;
        timeUniform = u.time;
        break;
      }
      case 'neptune': {
        const u = createGasGiantUniforms();
        u.sunPosition.value = SUN_POSITION;
        vertexShader = GAS_GIANT_VERTEX;
        fragmentShader = NEPTUNE_FRAGMENT;
        uniforms = u;
        timeUniform = u.time;
        break;
      }
      case 'pluto': {
        const u = createRockyPlanetUniforms();
        u.sunPosition.value = SUN_POSITION;
        vertexShader = ROCKY_VERTEX;
        fragmentShader = PLUTO_FRAGMENT;
        uniforms = u;
        timeUniform = u.time;
        break;
      }
      default: {
        // Fallback: lit grey minimal shader
        const u = createRockyPlanetUniforms();
        u.sunPosition.value = SUN_POSITION;
        vertexShader = `
          varying vec3 vWorldNormal;
          varying vec3 vWorldPosition;
          void main() {
            vWorldNormal = normalize((modelMatrix * vec4(normal, 0.0)).xyz);
            vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `;
        fragmentShader = `
          uniform vec3 sunPosition;
          varying vec3 vWorldNormal;
          varying vec3 vWorldPosition;
          void main() {
            vec3 norm = normalize(vWorldNormal);
            vec3 sunDir = normalize(sunPosition - vWorldPosition);
            float NdotL = max(0.0, dot(norm, sunDir));
            vec3 color = vec3(0.5, 0.5, 0.5) * (0.02 + NdotL);
            gl_FragColor = vec4(color, 1.0);
          }
        `;
        uniforms = u;
        timeUniform = u.time;
        break;
      }
    }

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
    });

    function updateTime(elapsed: number): void {
      timeUniform.value = elapsed;
    }

    return { material, updateTime };
  }, [planetId]);
}

export default function Planet({ planetData, position }: PlanetProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const { material, updateTime } = usePlanetMaterial(planetData.id);

  const handleClick = useCallback(
    (e: ThreeEvent<MouseEvent>) => {
      e.stopPropagation();
      useSolarSystemStore.getState().selectPlanet(planetData.id);
    },
    [planetData.id],
  );

  const handlePointerOver = useCallback((e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setHovered(true);
    document.body.style.cursor = 'pointer';
  }, []);

  const handlePointerOut = useCallback(() => {
    setHovered(false);
    document.body.style.cursor = 'auto';
  }, []);

  // Self-rotation: faster for shorter rotation periods.
  // Cap at a reasonable visual speed to avoid spinning blur.
  const rotationSpeed = Math.min(
    Math.abs(1 / (planetData.rotationPeriod / 24)),
    2,
  );
  const rotationDirection = planetData.rotationPeriod < 0 ? -1 : 1;

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y +=
        delta * rotationSpeed * 0.3 * rotationDirection;
    }
    updateTime(state.clock.elapsedTime);
  });

  // Axial tilt (convert degrees to radians)
  const axialTiltRad = (planetData.axialTilt * Math.PI) / 180;

  // Scale factor for hover
  const scale = hovered ? 1.15 : 1.0;

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        rotation={[axialTiltRad, 0, 0]}
        scale={scale}
        material={material}
      >
        <sphereGeometry args={[planetData.sceneRadius, 64, 64]} />
      </mesh>

      {/* Ring system for Saturn and Uranus */}
      {(planetData.id === 'saturn' || planetData.ringTexture) && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} scale={scale}>
          <ringGeometry
            args={[
              planetData.sceneRadius * 1.2,
              planetData.sceneRadius * 2.2,
              64,
            ]}
          />
          <meshStandardMaterial
            color={planetData.accentColor}
            transparent
            opacity={0.6}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
    </group>
  );
}
