// Scale factors for navigable mode
export const NAVIGABLE_SCALE = {
  distanceMultiplier: 10, // 1 AU = 10 scene units
  sizeMultiplier: 0.3, // Planet sizes relative to scene
  sunSize: 2.5,
};

// Scale factors for true scale mode
export const TRUE_SCALE = {
  distanceMultiplier: 50, // 1 AU = 50 scene units
  sizeMultiplier: 0.01, // Planets become tiny dots
  sunSize: 0.5,
};

// Convenience
export const AU_TO_KM = 149_597_870.7;
export const J2000 = new Date('2000-01-01T12:00:00Z');
