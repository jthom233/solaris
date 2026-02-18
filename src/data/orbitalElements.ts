import type { OrbitalElements } from "@/types";

/**
 * J2000 Keplerian Orbital Elements for the Major Planets
 *
 * Source: "Keplerian Elements for Approximate Positions of the Major Planets"
 * E.M. Standish, JPL/Caltech, Solar System Dynamics Group
 * https://ssd.jpl.nasa.gov/planets/approx_pos.html
 *
 * Epoch: J2000.0 (January 1.5, 2000 TDB = JD 2451545.0)
 *
 * Values are given at J2000.0 epoch with rates of change per Julian century (36525 days).
 * These are valid for the time interval 1800 AD – 2050 AD.
 *
 * Units:
 *   - semiMajorAxis: AU (astronomical units)
 *   - eccentricity: dimensionless
 *   - inclination: degrees (relative to J2000 ecliptic)
 *   - longitudeOfAscendingNode: degrees
 *   - argumentOfPerihelion: degrees (longitude of perihelion minus ascending node)
 *   - meanLongitude: degrees
 *   - rates: per Julian century
 */

export const orbitalElements: Record<string, OrbitalElements> = {
  mercury: {
    semiMajorAxis: 0.38709927,
    eccentricity: 0.20563593,
    inclination: 7.00497902,
    longitudeOfAscendingNode: 48.33076593,
    argumentOfPerihelion: 29.12703035, // lonPeri (77.45779628) - Omega (48.33076593)
    meanLongitude: 252.25032350,
    rates: {
      semiMajorAxis: 0.00000037,
      eccentricity: 0.00001906,
      inclination: -0.00594749,
      longitudeOfAscendingNode: -0.12534081,
      argumentOfPerihelion: 0.16047689, // lonPeri rate (0.16047689+(-0.12534081)) simplified; using lonPeri rate directly
      meanLongitude: 149472.67411175,
    },
  },

  venus: {
    semiMajorAxis: 0.72333566,
    eccentricity: 0.00677672,
    inclination: 3.39467605,
    longitudeOfAscendingNode: 76.67984255,
    argumentOfPerihelion: 54.92262463, // lonPeri (131.60246718) - Omega (76.67984255)
    meanLongitude: 181.97909950,
    rates: {
      semiMajorAxis: 0.00000390,
      eccentricity: -0.00004107,
      inclination: -0.00078890,
      longitudeOfAscendingNode: -0.27769418,
      argumentOfPerihelion: 0.00268329,
      meanLongitude: 58517.81538729,
    },
  },

  earth: {
    semiMajorAxis: 1.00000261,
    eccentricity: 0.01671123,
    inclination: -0.00001531,
    longitudeOfAscendingNode: 0.0,
    argumentOfPerihelion: 102.93768193, // lonPeri for Earth (no separate Omega)
    meanLongitude: 100.46457166,
    rates: {
      semiMajorAxis: 0.00000562,
      eccentricity: -0.00004392,
      inclination: -0.01294668,
      longitudeOfAscendingNode: 0.0,
      argumentOfPerihelion: 0.32327364,
      meanLongitude: 35999.37244981,
    },
  },

  mars: {
    semiMajorAxis: 1.52371034,
    eccentricity: 0.09339410,
    inclination: 1.84969142,
    longitudeOfAscendingNode: 49.55953891,
    argumentOfPerihelion: -73.50318378, // lonPeri (-23.94362959) - Omega (49.55953891)
    meanLongitude: -4.55343205,
    rates: {
      semiMajorAxis: 0.00001847,
      eccentricity: 0.00007882,
      inclination: -0.00813131,
      longitudeOfAscendingNode: -0.29257343,
      argumentOfPerihelion: 0.44441088,
      meanLongitude: 19140.30268499,
    },
  },

  jupiter: {
    semiMajorAxis: 5.20288700,
    eccentricity: 0.04838624,
    inclination: 1.30439695,
    longitudeOfAscendingNode: 100.47390909,
    argumentOfPerihelion: -85.74542926, // lonPeri (14.72847983) - Omega (100.47390909)
    meanLongitude: 34.39644051,
    rates: {
      semiMajorAxis: -0.00011607,
      eccentricity: -0.00013253,
      inclination: -0.00183714,
      longitudeOfAscendingNode: 0.20469106,
      argumentOfPerihelion: 0.21252668,
      meanLongitude: 3034.74612775,
    },
  },

  saturn: {
    semiMajorAxis: 9.53667594,
    eccentricity: 0.05386179,
    inclination: 2.48599187,
    longitudeOfAscendingNode: 113.66242448,
    argumentOfPerihelion: -21.06303430, // lonPeri (92.59887831) - Omega (113.66242448)
    meanLongitude: 49.95424423,
    rates: {
      semiMajorAxis: -0.00125060,
      eccentricity: -0.00050991,
      inclination: 0.00193609,
      longitudeOfAscendingNode: -0.28867794,
      argumentOfPerihelion: -0.41897216,
      meanLongitude: 1222.49362201,
    },
  },

  uranus: {
    semiMajorAxis: 19.18916464,
    eccentricity: 0.04725744,
    inclination: 0.77263783,
    longitudeOfAscendingNode: 74.01692503,
    argumentOfPerihelion: 96.93735127, // lonPeri (170.95427630) - Omega (74.01692503)
    meanLongitude: 313.23810451,
    rates: {
      semiMajorAxis: -0.00196176,
      eccentricity: -0.00004397,
      inclination: -0.00242939,
      longitudeOfAscendingNode: 0.04240589,
      argumentOfPerihelion: 0.40805281,
      meanLongitude: 428.48202785,
    },
  },

  neptune: {
    semiMajorAxis: 30.06992276,
    eccentricity: 0.00859048,
    inclination: 1.77004347,
    longitudeOfAscendingNode: 131.78422574,
    argumentOfPerihelion: -86.81996285, // lonPeri (44.96476227) - Omega (131.78422574)
    meanLongitude: -55.12002969,
    rates: {
      semiMajorAxis: 0.00026291,
      eccentricity: 0.00005105,
      inclination: 0.00035372,
      longitudeOfAscendingNode: -0.00508664,
      argumentOfPerihelion: -0.32241464,
      meanLongitude: 218.45945325,
    },
  },

  pluto: {
    semiMajorAxis: 39.48211675,
    eccentricity: 0.24882730,
    inclination: 17.14001206,
    longitudeOfAscendingNode: 110.30393684,
    argumentOfPerihelion: 113.76329169, // lonPeri (224.06891629) - Omega (110.30393684)
    meanLongitude: 238.92903833,
    rates: {
      semiMajorAxis: -0.00031596,
      eccentricity: 0.00005170,
      inclination: 0.00004818,
      longitudeOfAscendingNode: -0.01183482,
      argumentOfPerihelion: -0.01062942,
      meanLongitude: 145.20780515,
    },
  },
};

/**
 * Get orbital elements for a given planet ID.
 */
export function getOrbitalElements(planetId: string): OrbitalElements | undefined {
  return orbitalElements[planetId];
}

/**
 * J2000 epoch as a JavaScript Date.
 */
export const J2000_EPOCH = new Date("2000-01-01T12:00:00Z");

/**
 * Julian century in days.
 */
export const JULIAN_CENTURY_DAYS = 36525;
