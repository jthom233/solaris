import type * as THREE from 'three';
import { NOISE_GLSL } from './noise';

/**
 * Venus vertex shader.
 */
export const VENUS_VERTEX = /* glsl */ `
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
 * Venus fragment shader:
 * Thick-atmosphere look with subtle yellow-orange cloud swirl noise.
 * Mostly uniform due to dense cloud cover — just gentle variation.
 */
export const VENUS_FRAGMENT = /* glsl */ `
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

  // Slow-moving cloud swirl using FBM on latitude-stretched coords.
  // Venus rotates very slowly and retrograde -- animate extremely slowly.
  vec3 cloudPos = vec3(objNorm.x + time * 0.003, objNorm.y, objNorm.z + time * 0.002);
  float cloud1 = fbm(cloudPos * 2.5, 5, 2.0, 0.55) * 0.5 + 0.5;
  float cloud2 = snoise(cloudPos * 5.0 + vec3(0.5, 0.5, 0.5)) * 0.5 + 0.5;

  float combined = cloud1 * 0.7 + cloud2 * 0.3;

  // Venus color palette: yellow-orange haze
  vec3 c0 = vec3(0.831, 0.659, 0.263); // #d4a843 -- golden yellow
  vec3 c1 = vec3(0.769, 0.573, 0.227); // #c4923a -- deeper orange
  vec3 c2 = vec3(0.910, 0.753, 0.388); // #e8c063 -- bright gold

  float t = clamp(combined, 0.0, 1.0);
  vec3 surfaceColor;
  if (t < 0.5) {
    surfaceColor = mix(c1, c0, t / 0.5);
  } else {
    surfaceColor = mix(c0, c2, (t - 0.5) / 0.5);
  }

  // Thick atmosphere: soften the terminator with extra ambient-like scattering
  vec3 sunDir = normalize(sunPosition - vWorldPosition);
  float NdotL = max(0.0, dot(norm, sunDir));
  // Venus has significant scattering -- raise ambient slightly
  float ambient = 0.08;

  // Soft edge: thick atmosphere diffuses the limb
  vec3 viewDir = normalize(cameraPosition - vWorldPosition);
  float rim = 1.0 - max(0.0, dot(norm, viewDir));
  float fresnelBright = pow(rim, 3.0) * 0.25;

  vec3 litColor = surfaceColor * (ambient + NdotL * 0.9) + vec3(0.85, 0.72, 0.35) * fresnelBright;

  gl_FragColor = vec4(litColor, 1.0);
}
`;

export interface VenusUniforms extends Record<string, THREE.IUniform> {
  time: THREE.IUniform<number>;
  sunPosition: THREE.IUniform<[number, number, number]>;
}

export function createVenusUniforms(): VenusUniforms {
  return {
    time: { value: 0.0 },
    sunPosition: { value: [0, 0, 0] },
  };
}
