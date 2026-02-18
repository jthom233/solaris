import type * as THREE from 'three';
import { NOISE_GLSL } from './noise';

/**
 * Sun vertex shader: applies subtle noise-based displacement for a "boiling" surface effect.
 */
export const SUN_VERTEX = /* glsl */ `
${NOISE_GLSL}

uniform float time;

varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 vWorldPosition;

void main() {
  vNormal = normalize(normalMatrix * normal);

  // Animated 3D noise displacement (~2% of radius)
  vec3 noisePos = position * 0.8 + vec3(time * 0.12, time * 0.07, time * 0.09);
  float displacement = snoise(noisePos) * 0.02;
  vec3 displacedPosition = position + normal * displacement;

  vPosition = displacedPosition;
  vec4 worldPos = modelMatrix * vec4(displacedPosition, 1.0);
  vWorldPosition = worldPos.xyz;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(displacedPosition, 1.0);
}
`;

/**
 * Sun fragment shader: multi-layer animated simplex noise mapped to hot color ramp,
 * with limb darkening. Outputs bright emissive color for bloom post-processing.
 */
export const SUN_FRAGMENT = /* glsl */ `
${NOISE_GLSL}

uniform float time;

varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 vWorldPosition;

// Hot color ramp: dark convection cells -> bright granules
vec3 sunColorRamp(float t) {
  // t in [0,1]: 0 = dark, 1 = bright
  vec3 c0 = vec3(0.863, 0.161, 0.000); // #dc2900 -- deep convection
  vec3 c1 = vec3(1.000, 0.349, 0.000); // #ff5900 -- mid orange
  vec3 c2 = vec3(1.000, 0.549, 0.000); // #ff8c00 -- bright orange
  vec3 c3 = vec3(1.000, 0.843, 0.000); // #ffd700 -- gold
  vec3 c4 = vec3(1.000, 0.980, 0.804); // #fffacd -- bright granule

  t = clamp(t, 0.0, 1.0);
  if (t < 0.25) return mix(c0, c1, t / 0.25);
  if (t < 0.50) return mix(c1, c2, (t - 0.25) / 0.25);
  if (t < 0.75) return mix(c2, c3, (t - 0.50) / 0.25);
  return mix(c3, c4, (t - 0.75) / 0.25);
}

void main() {
  vec3 norm = normalize(vNormal);
  vec3 viewDir = normalize(cameraPosition - vWorldPosition);

  // Three layers of animated 3D simplex noise
  vec3 p = normalize(vPosition);
  float n1 = snoise(p * 2.5 + vec3(time * 0.10, 0.0, time * 0.08));
  float n2 = snoise(p * 5.0 + vec3(0.0, time * 0.15, time * 0.06));
  float n3 = snoise(p * 10.0 + vec3(time * 0.20, time * 0.12, 0.0));

  // Combine layers with different weights
  float combined = n1 * 0.55 + n2 * 0.30 + n3 * 0.15;
  // Map from [-1, 1] to [0, 1]
  float noiseVal = combined * 0.5 + 0.5;

  vec3 color = sunColorRamp(noiseVal);

  // Limb darkening: edges appear darker/cooler
  float limbFactor = dot(norm, viewDir);
  float limb = pow(max(limbFactor, 0.0), 0.5);
  // Darken limb: mix toward a darker orange at the edge
  vec3 limbColor = vec3(0.7, 0.2, 0.0);
  color = mix(limbColor, color, limb);

  // Boost emission so bloom picks it up
  gl_FragColor = vec4(color * 1.8, 1.0);
}
`;

export interface SunUniforms extends Record<string, THREE.IUniform> {
  time: THREE.IUniform<number>;
}

export function createSunUniforms(): SunUniforms {
  return {
    time: { value: 0.0 },
  };
}
