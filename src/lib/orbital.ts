import type { OrbitalElements } from '@/types';
import { J2000 } from './constants';

/** Degrees to radians */
const DEG_TO_RAD = Math.PI / 180;

/** Milliseconds per Julian century */
const MS_PER_JULIAN_CENTURY = 36525 * 24 * 60 * 60 * 1000;

/**
 * Normalize an angle to the range [0, 360).
 */
function normalizeDegrees(deg: number): number {
  const result = deg % 360;
  return result < 0 ? result + 360 : result;
}

/**
 * Solve Kepler's equation  M = E - e * sin(E)  for the eccentric anomaly E
 * using Newton-Raphson iteration.
 *
 * @param M  Mean anomaly in radians
 * @param e  Eccentricity (0 <= e < 1)
 * @returns  Eccentric anomaly in radians
 */
function solveKepler(M: number, e: number): number {
  // Initial guess
  let E = M + e * Math.sin(M) * (1 + e * Math.cos(M));

  // 6 Newton-Raphson iterations (converges quickly for e < ~0.3;
  // even Pluto's e ≈ 0.25 converges well)
  for (let i = 0; i < 6; i++) {
    const dE = (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E));
    E -= dE;
  }

  return E;
}

/**
 * Calculate the 3-D heliocentric position of a planet (in AU) for a given date.
 *
 * Uses the standard two-body Keplerian orbital elements from the JPL
 * "approximate positions of the major planets" dataset.
 */
export function calculatePlanetPosition(
  elements: OrbitalElements,
  date: Date,
): { x: number; y: number; z: number } {
  // Centuries since J2000
  const T = (date.getTime() - J2000.getTime()) / MS_PER_JULIAN_CENTURY;

  // Current elements (base + rate * T)
  const a = elements.semiMajorAxis + elements.rates.semiMajorAxis * T;
  const e = elements.eccentricity + elements.rates.eccentricity * T;
  const I = (elements.inclination + elements.rates.inclination * T) * DEG_TO_RAD;
  const Omega =
    (elements.longitudeOfAscendingNode +
      elements.rates.longitudeOfAscendingNode * T) *
    DEG_TO_RAD;
  const omega =
    (elements.argumentOfPerihelion + elements.rates.argumentOfPerihelion * T) *
    DEG_TO_RAD;
  const L = normalizeDegrees(
    elements.meanLongitude + elements.rates.meanLongitude * T,
  );

  // Mean anomaly  M = L - (omega + Omega)  (all in degrees, then convert)
  const lonPeriDeg =
    elements.argumentOfPerihelion +
    elements.rates.argumentOfPerihelion * T +
    (elements.longitudeOfAscendingNode +
      elements.rates.longitudeOfAscendingNode * T);
  const M = normalizeDegrees(L - lonPeriDeg) * DEG_TO_RAD;

  // Eccentric anomaly
  const E = solveKepler(M, e);

  // True anomaly
  const sinV = (Math.sqrt(1 - e * e) * Math.sin(E)) / (1 - e * Math.cos(E));
  const cosV = (Math.cos(E) - e) / (1 - e * Math.cos(E));
  const v = Math.atan2(sinV, cosV);

  // Heliocentric distance
  const r = a * (1 - e * Math.cos(E));

  // Position in the orbital plane
  const xOrbital = r * Math.cos(v);
  const yOrbital = r * Math.sin(v);

  // Rotate to ecliptic coordinates:
  //   x_ecl =  cos(omega)*cos(Omega) - sin(omega)*sin(Omega)*cos(I)
  //   y_ecl =  cos(omega)*sin(Omega) + sin(omega)*cos(Omega)*cos(I)
  //   z_ecl =  sin(omega)*sin(I)
  // Applied to (xOrbital, yOrbital):

  const cosOmega = Math.cos(Omega);
  const sinOmega = Math.sin(Omega);
  const cosw = Math.cos(omega);
  const sinw = Math.sin(omega);
  const cosI = Math.cos(I);
  const sinI = Math.sin(I);

  const x =
    (cosw * cosOmega - sinw * sinOmega * cosI) * xOrbital +
    (-sinw * cosOmega - cosw * sinOmega * cosI) * yOrbital;

  const y =
    (cosw * sinOmega + sinw * cosOmega * cosI) * xOrbital +
    (-sinw * sinOmega + cosw * cosOmega * cosI) * yOrbital;

  const z = (sinw * sinI) * xOrbital + (cosw * sinI) * yOrbital;

  return { x, y, z };
}

/**
 * Calculate an array of points tracing the full orbital ellipse.
 *
 * @param elements  Keplerian orbital elements
 * @param segments  Number of line segments (default 128)
 * @returns         Array of [x, y, z] tuples in AU
 */
export function calculateOrbitalPath(
  elements: OrbitalElements,
  segments = 128,
): [number, number, number][] {
  const a = elements.semiMajorAxis;
  const e = elements.eccentricity;
  const I = elements.inclination * DEG_TO_RAD;
  const Omega = elements.longitudeOfAscendingNode * DEG_TO_RAD;
  const omega = elements.argumentOfPerihelion * DEG_TO_RAD;

  const cosOmega = Math.cos(Omega);
  const sinOmega = Math.sin(Omega);
  const cosw = Math.cos(omega);
  const sinw = Math.sin(omega);
  const cosI = Math.cos(I);
  const sinI = Math.sin(I);

  const points: [number, number, number][] = [];

  for (let i = 0; i <= segments; i++) {
    // Parametrise by true anomaly from 0 to 2*PI
    const v = (i / segments) * 2 * Math.PI;

    // Distance at this true anomaly
    const r = (a * (1 - e * e)) / (1 + e * Math.cos(v));

    // Position in the orbital plane
    const xOrbital = r * Math.cos(v);
    const yOrbital = r * Math.sin(v);

    // Rotate to ecliptic coordinates
    const x =
      (cosw * cosOmega - sinw * sinOmega * cosI) * xOrbital +
      (-sinw * cosOmega - cosw * sinOmega * cosI) * yOrbital;

    const y =
      (cosw * sinOmega + sinw * cosOmega * cosI) * xOrbital +
      (-sinw * sinOmega + cosw * cosOmega * cosI) * yOrbital;

    const z = (sinw * sinI) * xOrbital + (cosw * sinI) * yOrbital;

    points.push([x, y, z]);
  }

  return points;
}
