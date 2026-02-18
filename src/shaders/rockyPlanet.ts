import type * as THREE from 'three';
import { NOISE_GLSL } from './noise';

/**
 * Shared vertex shader for rocky planets (Mercury, Mars, Pluto).
 * Passes object-space position for latitude-based polar effects.
 */
export const ROCKY_VERTEX = /* glsl */ `
varying vec3 vNormal;
varying vec3 vWorldNormal;
varying vec3 vWorldPosition;
varying vec3 vObjectPosition;

void main() {
  vNormal = normalize(normalMatrix * normal);
  vObjectPosition = position;

  vec4 worldPos = modelMatrix * vec4(position, 1.0);
  vWorldPosition = worldPos.xyz;
  vWorldNormal = normalize((modelMatrix * vec4(normal, 0.0)).xyz);

  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

/**
 * Mercury fragment shader:
 * Grey-tan base with high-frequency crater noise.
 * Hard terminator (no limb softening), no atmosphere.
 */
export const MERCURY_FRAGMENT = /* glsl */ `
${NOISE_GLSL}

uniform float time;
uniform vec3 sunPosition;

varying vec3 vNormal;
varying vec3 vWorldNormal;
varying vec3 vWorldPosition;
varying vec3 vObjectPosition;

void main() {
  vec3 norm = normalize(vWorldNormal);
  vec3 objNorm = normalize(vObjectPosition);

  // Base grey-tan with low-frequency variation
  float baseNoise = fbm(objNorm * 3.0, 4, 2.0, 0.5) * 0.5 + 0.5;
  // High-frequency crater noise
  float craterNoise = ridgedNoise(objNorm * 12.0, 4);

  float combined = baseNoise * 0.6 + craterNoise * 0.4;

  // Mercury color palette
  vec3 c0 = vec3(0.549, 0.494, 0.427); // #8c7e6d -- dark grey-tan
  vec3 c1 = vec3(0.651, 0.596, 0.510); // #a69882 -- mid grey-tan
  vec3 c2 = vec3(0.420, 0.369, 0.314); // #6b5e50 -- dark shadow

  float t = clamp(combined, 0.0, 1.0);
  vec3 surfaceColor;
  if (t < 0.5) {
    surfaceColor = mix(c2, c0, t / 0.5);
  } else {
    surfaceColor = mix(c0, c1, (t - 0.5) / 0.5);
  }

  // Hard terminator: no softening (no atmosphere)
  vec3 sunDir = normalize(sunPosition - vWorldPosition);
  float NdotL = max(0.0, dot(norm, sunDir));
  float ambient = 0.02;

  vec3 litColor = surfaceColor * (ambient + NdotL);

  gl_FragColor = vec4(litColor, 1.0);
}
`;

/**
 * Mars fragment shader:
 * Red-orange base, directional canyon noise, white polar caps above +-75 degrees latitude.
 */
export const MARS_FRAGMENT = /* glsl */ `
${NOISE_GLSL}

uniform float time;
uniform vec3 sunPosition;

varying vec3 vNormal;
varying vec3 vWorldNormal;
varying vec3 vWorldPosition;
varying vec3 vObjectPosition;

void main() {
  vec3 norm = normalize(vWorldNormal);
  vec3 objNorm = normalize(vObjectPosition);

  // Directional noise stretch for canyon-like features (stretch along xz)
  vec3 stretchedPos = vec3(objNorm.x * 2.5, objNorm.y * 0.8, objNorm.z * 2.5);
  float canyonNoise = fbm(stretchedPos * 3.0, 5, 2.0, 0.5);
  float detailNoise = snoise(objNorm * 9.0) * 0.5 + 0.5;

  float combined = canyonNoise * 0.6 + detailNoise * 0.4;
  float t = clamp(combined * 0.5 + 0.5, 0.0, 1.0);

  // Mars color palette
  vec3 c0 = vec3(0.757, 0.267, 0.055); // #c1440e -- bright red-orange
  vec3 c1 = vec3(0.627, 0.322, 0.176); // #a0522d -- dusty sienna
  vec3 c2 = vec3(0.824, 0.412, 0.118); // #d2691e -- lighter orange

  vec3 surfaceColor;
  if (t < 0.5) {
    surfaceColor = mix(c1, c0, t / 0.5);
  } else {
    surfaceColor = mix(c0, c2, (t - 0.5) / 0.5);
  }

  // Polar caps: white above +-75 degrees latitude
  float latitude = abs(objNorm.y);
  float polarBlend = smoothstep(0.72, 0.85, latitude);
  vec3 polarColor = vec3(0.910, 0.878, 0.816); // #e8e0d0
  surfaceColor = mix(surfaceColor, polarColor, polarBlend);

  // Lighting
  vec3 sunDir = normalize(sunPosition - vWorldPosition);
  float NdotL = max(0.0, dot(norm, sunDir));
  float ambient = 0.02;

  vec3 litColor = surfaceColor * (ambient + NdotL);

  gl_FragColor = vec4(litColor, 1.0);
}
`;

/**
 * Pluto fragment shader:
 * Heart-shaped bright region (noise-masked patch), pale tan/salmon palette.
 */
export const PLUTO_FRAGMENT = /* glsl */ `
${NOISE_GLSL}

uniform float time;
uniform vec3 sunPosition;

varying vec3 vNormal;
varying vec3 vWorldNormal;
varying vec3 vWorldPosition;
varying vec3 vObjectPosition;

// Approximate heart-shaped region using signed distance in spherical coords
float heartRegion(vec3 p) {
  // Sputnik Planitia is near the equator, slightly offset to one side.
  // We approximate it as a roughly oval bright patch.
  vec3 center = normalize(vec3(0.7, -0.1, 0.7));
  float dist = dot(p, center);
  // Smooth ellipse: varies in x and y extent
  float dx = dot(p - center * dist, vec3(1.0, 0.0, 0.0));
  float dy = dot(p - center * dist, vec3(0.0, 1.0, 0.0));
  float ellipse = smoothstep(0.35, 0.55, dist) * (1.0 - smoothstep(0.0, 0.12, sqrt(dx*dx*1.8 + dy*dy*0.7)));
  return ellipse;
}

void main() {
  vec3 norm = normalize(vWorldNormal);
  vec3 objNorm = normalize(vObjectPosition);

  float baseNoise = fbm(objNorm * 3.5, 4, 2.0, 0.5) * 0.5 + 0.5;
  float detailNoise = snoise(objNorm * 8.0) * 0.5 + 0.5;
  float t = baseNoise * 0.7 + detailNoise * 0.3;

  // Pluto color palette
  vec3 c0 = vec3(0.831, 0.769, 0.659); // #d4c4a8 -- pale tan
  vec3 c1 = vec3(0.769, 0.659, 0.510); // #c4a882 -- medium tan
  vec3 c2 = vec3(0.910, 0.847, 0.753); // #e8d8c0 -- light cream

  vec3 surfaceColor;
  if (t < 0.5) {
    surfaceColor = mix(c1, c0, t / 0.5);
  } else {
    surfaceColor = mix(c0, c2, (t - 0.5) / 0.5);
  }

  // Heart-shaped bright region (Sputnik Planitia)
  float heart = heartRegion(objNorm);
  vec3 heartColor = vec3(0.953, 0.918, 0.867); // bright nitrogen ice
  surfaceColor = mix(surfaceColor, heartColor, heart * 0.75);

  // Lighting
  vec3 sunDir = normalize(sunPosition - vWorldPosition);
  float NdotL = max(0.0, dot(norm, sunDir));
  float ambient = 0.02;

  vec3 litColor = surfaceColor * (ambient + NdotL);

  gl_FragColor = vec4(litColor, 1.0);
}
`;

export interface RockyPlanetUniforms extends Record<string, THREE.IUniform> {
  time: THREE.IUniform<number>;
  sunPosition: THREE.IUniform<[number, number, number]>;
}

export function createRockyPlanetUniforms(): RockyPlanetUniforms {
  return {
    time: { value: 0.0 },
    sunPosition: { value: [0, 0, 0] },
  };
}
