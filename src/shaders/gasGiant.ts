import type * as THREE from 'three';
import { NOISE_GLSL } from './noise';

/**
 * Shared vertex shader for gas giants (Jupiter, Saturn, Uranus, Neptune).
 * Passes object-space position so fragment shaders can compute latitude bands.
 */
export const GAS_GIANT_VERTEX = /* glsl */ `
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

// ---------------------------------------------------------------------------
// Jupiter
// ---------------------------------------------------------------------------

/**
 * Jupiter fragment shader:
 * Animated horizontal band structure with noise displacement,
 * a simulated Great Red Spot, and standard planet lighting.
 */
export const JUPITER_FRAGMENT = /* glsl */ `
${NOISE_GLSL}

uniform float time;
uniform vec3 sunPosition;

varying vec3 vNormal;
varying vec3 vWorldNormal;
varying vec3 vWorldPosition;
varying vec3 vObjectPosition;

// Jupiter color ramp from a latitude and noise value
vec3 jupiterBandColor(float latitude, float bandNoise) {
  // Alternate between warm belt and white zone colors with noise displacement
  float bandFreq = 14.0;
  float rawBand = sin(latitude * bandFreq + bandNoise * 1.8);
  float band = rawBand * 0.5 + 0.5; // [0, 1]

  // Belt colors (warm orange-brown)
  vec3 belt0 = vec3(0.769, 0.584, 0.416); // #c4956a
  vec3 belt1 = vec3(0.545, 0.435, 0.306); // #8b6f4e
  // Zone colors (creamy white)
  vec3 zone0 = vec3(0.831, 0.655, 0.416); // #d4a76a
  vec3 zone1 = vec3(0.910, 0.863, 0.784); // #e8dcc8

  vec3 beltColor = mix(belt0, belt1, clamp(bandNoise * 0.5 + 0.5, 0.0, 1.0));
  vec3 zoneColor = mix(zone0, zone1, clamp(bandNoise * 0.5 + 0.5, 0.0, 1.0));
  return mix(beltColor, zoneColor, band);
}

// Great Red Spot: approximate as smoothstep ellipse near 23S latitude
float greatRedSpot(vec3 objNorm, float t) {
  // GRS sits at ~23S latitude (y ~= -0.39) with some longitudinal drift
  float grsLat = -0.39;
  float grsLon = 0.5 + t * 0.008; // slow drift

  // Convert objNorm to latitude/longitude coordinates
  float lat = objNorm.y;
  float lon = atan(objNorm.z, objNorm.x) / (2.0 * 3.14159265) + 0.5;

  float latDist = abs(lat - grsLat);
  float lonDist = min(abs(lon - grsLon), 1.0 - abs(lon - grsLon));

  // Ellipse mask: wider in longitude than latitude
  float ellipse = latDist * latDist / (0.07 * 0.07) + lonDist * lonDist / (0.12 * 0.12);
  return smoothstep(1.2, 0.6, ellipse);
}

void main() {
  vec3 norm = normalize(vWorldNormal);
  vec3 objNorm = normalize(vObjectPosition);

  float latitude = objNorm.y; // -1 south pole, +1 north pole

  // Band noise: displaces band boundaries and adds texture.
  // Animate slowly -- bands drift over time.
  vec3 bandNoisePos = vec3(objNorm.x + time * 0.004, objNorm.y, objNorm.z + time * 0.003);
  float bandNoise = snoise(bandNoisePos * 4.0);
  // Add fine detail turbulence
  float detailNoise = snoise(vec3(objNorm.x + time * 0.012, objNorm.y * 3.0, objNorm.z + time * 0.009) * 8.0) * 0.3;
  float totalNoise = bandNoise + detailNoise;

  vec3 surfaceColor = jupiterBandColor(latitude, totalNoise);

  // Great Red Spot
  float grs = greatRedSpot(objNorm, time);
  // GRS swirling noise
  float grsNoise = snoise(objNorm * 12.0 + vec3(time * 0.05)) * 0.5 + 0.5;
  vec3 grsColor = mix(vec3(0.800, 0.300, 0.150), vec3(0.700, 0.200, 0.100), grsNoise);
  surfaceColor = mix(surfaceColor, grsColor, grs);

  // Lighting
  vec3 sunDir = normalize(sunPosition - vWorldPosition);
  float NdotL = max(0.0, dot(norm, sunDir));
  float ambient = 0.02;

  vec3 litColor = surfaceColor * (ambient + NdotL);

  gl_FragColor = vec4(litColor, 1.0);
}
`;

// ---------------------------------------------------------------------------
// Saturn
// ---------------------------------------------------------------------------

/**
 * Saturn fragment shader:
 * Similar band structure to Jupiter, more muted and golden, softer transitions.
 */
export const SATURN_FRAGMENT = /* glsl */ `
${NOISE_GLSL}

uniform float time;
uniform vec3 sunPosition;

varying vec3 vNormal;
varying vec3 vWorldNormal;
varying vec3 vWorldPosition;
varying vec3 vObjectPosition;

vec3 saturnBandColor(float latitude, float bandNoise) {
  float bandFreq = 10.0;
  float rawBand = sin(latitude * bandFreq + bandNoise * 1.2);
  float band = rawBand * 0.5 + 0.5;

  // Saturn palette: muted golden tones
  vec3 belt  = vec3(0.769, 0.659, 0.431); // #c4a86c
  vec3 zone  = vec3(0.910, 0.835, 0.639); // #e8d5a3
  vec3 dark  = vec3(0.627, 0.541, 0.369); // #a08a5e

  float noise01 = clamp(bandNoise * 0.5 + 0.5, 0.0, 1.0);
  vec3 beltColor = mix(dark, belt, noise01);
  vec3 zoneColor = mix(belt, zone, noise01);
  // Soft transition between belt and zone
  return mix(beltColor, zoneColor, smoothstep(0.35, 0.65, band));
}

void main() {
  vec3 norm = normalize(vWorldNormal);
  vec3 objNorm = normalize(vObjectPosition);

  float latitude = objNorm.y;

  vec3 bandNoisePos = vec3(objNorm.x + time * 0.003, objNorm.y, objNorm.z + time * 0.002);
  float bandNoise = snoise(bandNoisePos * 3.5);
  float detailNoise = snoise(vec3(objNorm.x + time * 0.008, objNorm.y * 2.5, objNorm.z) * 7.0) * 0.25;
  float totalNoise = bandNoise + detailNoise;

  vec3 surfaceColor = saturnBandColor(latitude, totalNoise);

  // Lighting
  vec3 sunDir = normalize(sunPosition - vWorldPosition);
  float NdotL = max(0.0, dot(norm, sunDir));
  float ambient = 0.02;

  vec3 litColor = surfaceColor * (ambient + NdotL);

  gl_FragColor = vec4(litColor, 1.0);
}
`;

// ---------------------------------------------------------------------------
// Uranus
// ---------------------------------------------------------------------------

/**
 * Uranus fragment shader:
 * Nearly uniform pale cyan-blue with very subtle banding.
 */
export const URANUS_FRAGMENT = /* glsl */ `
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

  float latitude = objNorm.y;

  // Very subtle banding
  float bandNoise = snoise(vec3(objNorm.x + time * 0.002, objNorm.y, objNorm.z) * 3.0);
  float band = sin(latitude * 6.0 + bandNoise * 0.8) * 0.5 + 0.5;

  // Uranus palette: pale cyan-blue
  vec3 c0 = vec3(0.494, 0.784, 0.890); // #7ec8e3 -- primary cyan
  vec3 c1 = vec3(0.659, 0.863, 0.910); // #a8dce8 -- lighter
  vec3 c2 = vec3(0.369, 0.702, 0.816); // #5eb3d0 -- slightly deeper

  float noise01 = clamp(bandNoise * 0.5 + 0.5, 0.0, 1.0);
  vec3 surfaceColor = mix(c2, mix(c0, c1, band), noise01 * 0.4 + 0.6);

  // Lighting
  vec3 sunDir = normalize(sunPosition - vWorldPosition);
  float NdotL = max(0.0, dot(norm, sunDir));
  float ambient = 0.02;

  vec3 litColor = surfaceColor * (ambient + NdotL);

  gl_FragColor = vec4(litColor, 1.0);
}
`;

// ---------------------------------------------------------------------------
// Neptune
// ---------------------------------------------------------------------------

/**
 * Neptune fragment shader:
 * Deep vivid blue with visible cloud streaks and bright storm spots.
 */
export const NEPTUNE_FRAGMENT = /* glsl */ `
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

  // Fast-moving cloud streaks -- Neptune has the strongest winds
  vec3 streakPos = vec3(objNorm.x + time * 0.025, objNorm.y * 0.5, objNorm.z + time * 0.018);
  float streakNoise = fbm(streakPos * 5.0, 4, 2.0, 0.5);

  // Deep base color variation
  float baseNoise = snoise(objNorm * 2.5 + vec3(time * 0.005)) * 0.5 + 0.5;

  // Neptune palette: deep vivid blue
  vec3 c0 = vec3(0.180, 0.314, 0.565); // #2e5090 -- deep blue
  vec3 c1 = vec3(0.239, 0.416, 0.710); // #3d6ab5 -- mid blue
  vec3 c2 = vec3(0.314, 0.502, 0.753); // #5080c0 -- lighter blue

  float t = clamp(streakNoise * 0.5 + 0.5, 0.0, 1.0);
  vec3 surfaceColor;
  if (t < 0.5) {
    surfaceColor = mix(c0, c1, t / 0.5);
  } else {
    surfaceColor = mix(c1, c2, (t - 0.5) / 0.5);
  }

  // Blend in base variation
  surfaceColor = mix(surfaceColor, c0, (1.0 - baseNoise) * 0.3);

  // Bright storm spots: localized bright regions
  float stormNoise = ridgedNoise(objNorm * 8.0 + vec3(time * 0.015), 3);
  vec3 brightColor = vec3(0.541, 0.722, 0.878); // #8ab8e0
  float stormMask = smoothstep(0.75, 0.90, stormNoise);
  surfaceColor = mix(surfaceColor, brightColor, stormMask * 0.6);

  // Lighting
  vec3 sunDir = normalize(sunPosition - vWorldPosition);
  float NdotL = max(0.0, dot(norm, sunDir));
  float ambient = 0.02;

  vec3 litColor = surfaceColor * (ambient + NdotL);

  gl_FragColor = vec4(litColor, 1.0);
}
`;

export interface GasGiantUniforms extends Record<string, THREE.IUniform> {
  time: THREE.IUniform<number>;
  sunPosition: THREE.IUniform<[number, number, number]>;
}

export function createGasGiantUniforms(): GasGiantUniforms {
  return {
    time: { value: 0.0 },
    sunPosition: { value: [0, 0, 0] },
  };
}
