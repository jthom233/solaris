import type * as THREE from 'three';
import { NOISE_GLSL } from './noise';

/**
 * Earth vertex shader: passes world position and object-space position for
 * latitude-based effects (polar ice) and lighting.
 */
export const EARTH_VERTEX = /* glsl */ `
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
 * Earth fragment shader:
 * - Two-layer noise: continents (low freq) + terrain detail (high freq)
 * - Elevation-based color ramp: ocean -> coast -> lowland -> highland -> peaks
 * - Polar ice caps blended in above +-65 degrees latitude
 * - Ocean specular highlight from sun direction
 * - Standard planet lighting model (ambient 0.02 + diffuse)
 */
export const EARTH_FRAGMENT = /* glsl */ `
${NOISE_GLSL}

uniform float time;
uniform vec3 sunPosition;

varying vec3 vNormal;
varying vec3 vWorldNormal;
varying vec3 vWorldPosition;
varying vec3 vObjectPosition;

// Earth elevation color ramp
vec3 earthColorRamp(float elevation, float waterMask) {
  // Deep ocean
  vec3 deepOcean    = vec3(0.102, 0.290, 0.478); // #1a4a7a
  // Shallow coast
  vec3 coast        = vec3(0.824, 0.784, 0.588); // #d2c896
  // Green lowland
  vec3 lowland      = vec3(0.239, 0.478, 0.239); // #3d7a3d
  // Brown highland
  vec3 highland     = vec3(0.545, 0.431, 0.239); // #8b6e3d
  // Snow peaks
  vec3 peaks        = vec3(0.941, 0.941, 0.941); // #f0f0f0

  if (waterMask > 0.5) {
    // Ocean: interpolate depth by elevation (inverted for water)
    float oceanDepth = clamp(1.0 - elevation * 1.5, 0.0, 1.0);
    return mix(vec3(0.196, 0.490, 0.706), deepOcean, oceanDepth); // lighter to deeper
  }

  // Land elevation ramp
  float t = clamp(elevation, 0.0, 1.0);
  if (t < 0.15) return mix(coast, coast, t / 0.15);
  if (t < 0.45) return mix(coast, lowland, (t - 0.15) / 0.30);
  if (t < 0.70) return mix(lowland, highland, (t - 0.45) / 0.25);
  return mix(highland, peaks, (t - 0.70) / 0.30);
}

void main() {
  vec3 norm = normalize(vWorldNormal);
  vec3 objNorm = normalize(vObjectPosition);

  // Latitude: dot with up axis in object space (before rotation)
  float latitude = abs(objNorm.y);

  // Continental noise (low frequency)
  vec3 p = objNorm;
  float continentNoise = fbm(p * 2.2, 5, 2.0, 0.5);
  // Terrain detail (high frequency)
  float detailNoise = fbm(p * 8.0, 4, 2.0, 0.5);

  // Combine: continent shape dominates, detail adds texture
  float elevation = continentNoise * 0.65 + detailNoise * 0.35;
  // Normalize to [0, 1]
  elevation = elevation * 0.5 + 0.5;

  // Water mask: below threshold is ocean
  float waterThreshold = 0.52;
  float waterMask = step(waterThreshold, elevation);
  // Remap land elevation to [0, 1] for color ramp
  float landElevation = (elevation - waterThreshold) / (1.0 - waterThreshold);

  vec3 surfaceColor = earthColorRamp(landElevation, waterMask);

  // Polar ice caps: blend to white above +-65 degrees latitude
  float polarBlend = smoothstep(0.62, 0.80, latitude);
  vec3 polarColor = vec3(0.941, 0.953, 0.965); // slightly blue-white
  surfaceColor = mix(surfaceColor, polarColor, polarBlend);

  // Lighting
  vec3 sunDir = normalize(sunPosition - vWorldPosition);
  float NdotL = max(0.0, dot(norm, sunDir));
  float ambient = 0.02;
  vec3 litColor = surfaceColor * (ambient + NdotL);

  // Ocean specular: smooth highlight on water faces
  if (waterMask < 0.5) {
    vec3 viewDir = normalize(cameraPosition - vWorldPosition);
    vec3 halfVec = normalize(sunDir + viewDir);
    float spec = pow(max(0.0, dot(norm, halfVec)), 64.0);
    litColor += spec * 0.4 * NdotL;
  }

  gl_FragColor = vec4(litColor, 1.0);
}
`;

export interface EarthUniforms extends Record<string, THREE.IUniform> {
  time: THREE.IUniform<number>;
  sunPosition: THREE.IUniform<[number, number, number]>;
}

export function createEarthUniforms(): EarthUniforms {
  return {
    time: { value: 0.0 },
    sunPosition: { value: [0, 0, 0] },
  };
}
