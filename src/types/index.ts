export interface PlanetData {
  id: string;
  name: string;
  slug: string;
  classification:
    | "Star"
    | "Terrestrial"
    | "Gas Giant"
    | "Ice Giant"
    | "Dwarf Planet";
  accentColor: string;

  // Physical properties
  mass: number; // kg
  radius: number; // km
  gravity: number; // m/s²
  temperature: { min: number; max: number; mean: number }; // Celsius

  // Orbital properties
  distanceFromSun: { min: number; max: number; mean: number }; // million km
  orbitalPeriod: number; // Earth days
  rotationPeriod: number; // Earth hours (negative = retrograde)
  axialTilt: number; // degrees
  eccentricity: number;

  // Descriptive
  description: string;
  atmosphere: string[];
  moons: number;
  funFacts: string[];

  // 3D rendering
  textureMap: string;
  normalMap?: string;
  ringTexture?: string;
  sceneRadius: number;
  sceneOrbitRadius: number;
}

export interface OrbitalElements {
  semiMajorAxis: number; // AU
  eccentricity: number;
  inclination: number; // degrees
  longitudeOfAscendingNode: number; // degrees
  argumentOfPerihelion: number; // degrees
  meanLongitude: number; // degrees at J2000

  rates: {
    semiMajorAxis: number; // AU per century
    eccentricity: number; // per century
    inclination: number; // degrees per century
    longitudeOfAscendingNode: number; // degrees per century
    argumentOfPerihelion: number; // degrees per century
    meanLongitude: number; // degrees per century
  };
}

export type ScaleMode = "navigable" | "true";

export interface SolarSystemState {
  selectedPlanet: string | null;
  scaleMode: ScaleMode;
  isIntroComplete: boolean;
  isPanelOpen: boolean;

  selectPlanet: (id: string | null) => void;
  goHome: () => void;
  toggleScale: () => void;
  completeIntro: () => void;
  togglePanel: () => void;
}
