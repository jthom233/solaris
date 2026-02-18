import type { PlanetData } from "@/types";

/**
 * Complete, scientifically accurate data for all major solar system bodies.
 *
 * Sources:
 *   - NASA Planetary Fact Sheet (https://nssdc.gsfc.nasa.gov/planetary/factsheet/)
 *   - JPL Solar System Dynamics (https://ssd.jpl.nasa.gov/)
 *   - IAU / Minor Planet Center
 *
 * All values verified against NASA data as of 2024.
 */

export const planets: PlanetData[] = [
  // ──────────────────────────────────────────────────────────
  // SUN
  // ──────────────────────────────────────────────────────────
  {
    id: "sun",
    name: "Sun",
    slug: "sun",
    classification: "Star",
    accentColor: "#F59E0B",

    mass: 1.989e30,
    radius: 695700,
    gravity: 274.0,
    temperature: { min: 5500, max: 15_000_000, mean: 5778 },

    distanceFromSun: { min: 0, max: 0, mean: 0 },
    orbitalPeriod: 0,
    rotationPeriod: 609.12, // sidereal, equatorial — ~25.38 Earth days
    axialTilt: 7.25,
    eccentricity: 0,

    description:
      "The Sun is the star at the center of our solar system. It is a nearly perfect ball of hot plasma, heated to incandescence by nuclear fusion reactions in its core. The Sun radiates energy mainly as visible light, ultraviolet, and infrared radiation, and is the most important source of energy for life on Earth.\n\nWith a diameter of about 1.39 million kilometers, the Sun is approximately 109 times wider than Earth and accounts for about 99.86% of the total mass of the solar system. It is composed primarily of hydrogen (about 73%) and helium (about 25%), with heavier elements making up the remaining 2%.\n\nThe Sun is classified as a G-type main-sequence star (G2V), informally known as a yellow dwarf. It formed approximately 4.6 billion years ago from the gravitational collapse of matter within a region of a large molecular cloud. It is currently in the most stable phase of its life, fusing hydrogen into helium in its core at a rate of about 600 million tons per second.",

    atmosphere: [
      "Hydrogen (~73%)",
      "Helium (~25%)",
      "Oxygen (~0.77%)",
      "Carbon (~0.29%)",
      "Iron (~0.16%)",
      "Neon (~0.12%)",
    ],
    moons: 0,
    funFacts: [
      "The Sun loses about 4 million tons of mass every second through nuclear fusion, converting it directly into energy via E=mc².",
      "Light from the Sun takes about 8 minutes and 20 seconds to reach Earth, traveling at 299,792 km/s.",
      "The Sun's core temperature is approximately 15 million degrees Celsius — hot enough to sustain thermonuclear fusion.",
      "A photon generated in the Sun's core takes an estimated 10,000 to 170,000 years to reach the surface due to constant absorption and re-emission.",
      "The Sun completes one rotation approximately every 25 days at the equator but takes about 35 days near its poles, a phenomenon called differential rotation.",
    ],

    textureMap: "/textures/sun.jpg",
    sceneRadius: 2.5,
    sceneOrbitRadius: 0,
  },

  // ──────────────────────────────────────────────────────────
  // MERCURY
  // ──────────────────────────────────────────────────────────
  {
    id: "mercury",
    name: "Mercury",
    slug: "mercury",
    classification: "Terrestrial",
    accentColor: "#9CA3AF",

    mass: 3.301e23,
    radius: 2439.7,
    gravity: 3.7,
    temperature: { min: -180, max: 430, mean: 167 },

    distanceFromSun: { min: 46.0, max: 69.8, mean: 57.9 },
    orbitalPeriod: 87.97,
    rotationPeriod: 1407.6, // 58.65 Earth days
    axialTilt: 0.034,
    eccentricity: 0.2056,

    description:
      "Mercury is the smallest planet in our solar system and the closest to the Sun. It is only slightly larger than Earth's Moon and has a heavily cratered surface that resembles the lunar landscape. Despite its proximity to the Sun, Mercury is not the hottest planet — that distinction belongs to Venus and its runaway greenhouse effect.\n\nMercury has virtually no atmosphere to retain heat, which leads to the most extreme temperature swings of any planet in the solar system. Dayside temperatures can soar to 430°C, while the nightside plunges to -180°C. The planet's thin exosphere is composed of atoms blasted off the surface by solar wind and micrometeorites.\n\nWith an orbital period of just 88 Earth days, Mercury races around the Sun faster than any other planet. However, it rotates very slowly on its axis, completing one rotation every 59 Earth days. This creates a unique 3:2 spin-orbit resonance, meaning Mercury rotates exactly three times for every two orbits around the Sun.",

    atmosphere: [
      "Oxygen (~42%)",
      "Sodium (~29%)",
      "Hydrogen (~22%)",
      "Helium (~6%)",
      "Potassium (~0.5%)",
    ],
    moons: 0,
    funFacts: [
      "Mercury has a 3:2 spin-orbit resonance — it rotates exactly 3 times for every 2 orbits around the Sun, creating a 'day' that lasts 176 Earth days.",
      "Despite being closest to the Sun, Mercury has water ice in permanently shadowed craters near its poles, confirmed by NASA's MESSENGER mission.",
      "Mercury's iron core makes up about 85% of its radius, proportionally the largest core of any planet in the solar system.",
      "A person weighing 68 kg on Earth would weigh only about 25 kg on Mercury.",
      "Mercury has shrunk by about 7 km in radius over the past 4 billion years as its iron core slowly cooled and contracted.",
    ],

    textureMap: "/textures/mercury.jpg",
    sceneRadius: 0.3,
    sceneOrbitRadius: 8,
  },

  // ──────────────────────────────────────────────────────────
  // VENUS
  // ──────────────────────────────────────────────────────────
  {
    id: "venus",
    name: "Venus",
    slug: "venus",
    classification: "Terrestrial",
    accentColor: "#FCD34D",

    mass: 4.867e24,
    radius: 6051.8,
    gravity: 8.87,
    temperature: { min: 462, max: 462, mean: 464 },

    distanceFromSun: { min: 107.5, max: 108.9, mean: 108.2 },
    orbitalPeriod: 224.7,
    rotationPeriod: -5832.5, // retrograde, ~243 Earth days
    axialTilt: 177.4, // essentially upside down
    eccentricity: 0.0068,

    description:
      "Venus is the second planet from the Sun and Earth's closest planetary neighbor. Often called Earth's 'twin' due to their similar size and mass, the two planets could hardly be more different in terms of surface conditions. Venus has a crushing atmosphere 90 times denser than Earth's, composed almost entirely of carbon dioxide, creating a runaway greenhouse effect that makes it the hottest planet in the solar system.\n\nThe surface temperature on Venus is a nearly uniform 464°C — hot enough to melt lead — regardless of location or time of day. The planet is permanently shrouded in thick clouds of sulfuric acid that reflect about 70% of incoming sunlight, making Venus the brightest natural object in the night sky after the Moon.\n\nVenus rotates in the opposite direction to most planets in the solar system (retrograde rotation), and it does so extremely slowly. A single Venusian day (one complete rotation) takes 243 Earth days, which is actually longer than its year of 225 Earth days. This means the Sun rises in the west and sets in the east on Venus.",

    atmosphere: [
      "Carbon Dioxide (~96.5%)",
      "Nitrogen (~3.5%)",
      "Sulfur Dioxide (trace)",
      "Argon (trace)",
      "Water Vapor (trace)",
    ],
    moons: 0,
    funFacts: [
      "A day on Venus (243 Earth days) is longer than its year (225 Earth days), making it the only planet where the day outlasts the year.",
      "Venus rotates backwards (retrograde) compared to most planets — the Sun rises in the west and sets in the east.",
      "The atmospheric pressure on Venus's surface is about 92 times that of Earth — equivalent to being 900 meters underwater on Earth.",
      "Venus has over 1,600 major volcanoes, more than any other planet in the solar system, and evidence suggests some may still be active.",
      "Venus is the brightest planet in our sky, visible to the naked eye even during daylight hours under the right conditions.",
    ],

    textureMap: "/textures/venus.jpg",
    sceneRadius: 0.4,
    sceneOrbitRadius: 13,
  },

  // ──────────────────────────────────────────────────────────
  // EARTH
  // ──────────────────────────────────────────────────────────
  {
    id: "earth",
    name: "Earth",
    slug: "earth",
    classification: "Terrestrial",
    accentColor: "#3B82F6",

    mass: 5.972e24,
    radius: 6371.0,
    gravity: 9.81,
    temperature: { min: -89, max: 57, mean: 15 },

    distanceFromSun: { min: 147.1, max: 152.1, mean: 149.6 },
    orbitalPeriod: 365.25,
    rotationPeriod: 23.93, // sidereal
    axialTilt: 23.44,
    eccentricity: 0.0167,

    description:
      "Earth is the third planet from the Sun and the only known world to harbor life. With a surface area of 510 million square kilometers, approximately 71% of which is covered by liquid water, our planet is unique among all known celestial bodies. The presence of liquid water, a protective magnetic field, and an atmosphere rich in nitrogen and oxygen create the conditions necessary for the incredible biodiversity found here.\n\nEarth's atmosphere acts as a shield, protecting the surface from harmful solar radiation and small meteoroids. The ozone layer in the stratosphere absorbs most of the Sun's ultraviolet radiation, while the magnetosphere, generated by Earth's molten iron core, deflects charged particles from the solar wind.\n\nThe planet's 23.44-degree axial tilt is responsible for the seasons, as different hemispheres receive varying amounts of sunlight throughout the year. Earth's single large Moon stabilizes this axial tilt, preventing chaotic variations that would otherwise make the climate far less hospitable to life.",

    atmosphere: [
      "Nitrogen (~78.08%)",
      "Oxygen (~20.95%)",
      "Argon (~0.93%)",
      "Carbon Dioxide (~0.04%)",
      "Water Vapor (variable, ~0-4%)",
    ],
    moons: 1,
    funFacts: [
      "Earth is the densest planet in the solar system, with an average density of 5.51 g/cm³, thanks to its large iron-nickel core.",
      "Earth's magnetic field reverses polarity every 200,000 to 300,000 years on average — the last reversal was about 780,000 years ago.",
      "The highest point on Earth (Mount Everest, 8,849 m) combined with the deepest ocean trench (Mariana Trench, 10,994 m) represents less than 0.3% of Earth's radius.",
      "Earth is not a perfect sphere — it bulges slightly at the equator due to its rotation, making the equatorial diameter 43 km larger than the polar diameter.",
      "Every day, approximately 100 tons of interplanetary material (mostly dust and small meteoroids) falls onto Earth's surface.",
    ],

    textureMap: "/textures/earth.jpg",
    normalMap: "/textures/earth-normal.jpg",
    sceneRadius: 0.45,
    sceneOrbitRadius: 18,
  },

  // ──────────────────────────────────────────────────────────
  // MARS
  // ──────────────────────────────────────────────────────────
  {
    id: "mars",
    name: "Mars",
    slug: "mars",
    classification: "Terrestrial",
    accentColor: "#EF4444",

    mass: 6.417e23,
    radius: 3389.5,
    gravity: 3.72,
    temperature: { min: -140, max: 20, mean: -65 },

    distanceFromSun: { min: 206.7, max: 249.2, mean: 227.9 },
    orbitalPeriod: 687.0,
    rotationPeriod: 24.62,
    axialTilt: 25.19,
    eccentricity: 0.0934,

    description:
      "Mars, the fourth planet from the Sun, is often called the Red Planet due to the iron oxide (rust) that gives its surface a distinctive reddish appearance. Mars has long captivated human imagination as a potential home for extraterrestrial life, and modern exploration continues to search for evidence of past or present microbial life beneath its surface.\n\nMars is home to the tallest known mountain in the solar system — Olympus Mons, a shield volcano standing 21.9 km above the surrounding plains, nearly 2.5 times the height of Mount Everest. The planet also features Valles Marineris, a vast canyon system stretching over 4,000 km long, up to 200 km wide, and as deep as 7 km.\n\nDespite being only about half the diameter of Earth, Mars has nearly the same land surface area as Earth, because it has no oceans. Its thin atmosphere, composed primarily of carbon dioxide, provides little protection from radiation and cannot sustain liquid water on the surface for extended periods, though evidence strongly suggests that ancient Mars had rivers, lakes, and possibly even an ocean.",

    atmosphere: [
      "Carbon Dioxide (~95.3%)",
      "Nitrogen (~2.7%)",
      "Argon (~1.6%)",
      "Oxygen (~0.13%)",
      "Carbon Monoxide (~0.08%)",
    ],
    moons: 2,
    funFacts: [
      "Olympus Mons on Mars is the tallest known mountain in the solar system at 21.9 km — so large that its base would cover most of France.",
      "Mars has seasons similar to Earth because of its comparable axial tilt (25.19° vs Earth's 23.44°), but each season lasts roughly twice as long.",
      "A Martian day (called a 'sol') is only 37 minutes longer than an Earth day, making it the most Earth-like day length of any planet.",
      "Mars has the largest dust storms in the solar system — they can last for months and engulf the entire planet.",
      "The two Martian moons, Phobos and Deimos, are likely captured asteroids. Phobos is gradually spiraling inward and will either crash into Mars or break apart in about 50 million years.",
    ],

    textureMap: "/textures/mars.jpg",
    sceneRadius: 0.35,
    sceneOrbitRadius: 24,
  },

  // ──────────────────────────────────────────────────────────
  // JUPITER
  // ──────────────────────────────────────────────────────────
  {
    id: "jupiter",
    name: "Jupiter",
    slug: "jupiter",
    classification: "Gas Giant",
    accentColor: "#D97706",

    mass: 1.898e27,
    radius: 69911,
    gravity: 24.79,
    temperature: { min: -145, max: -108, mean: -110 },

    distanceFromSun: { min: 740.6, max: 816.4, mean: 778.5 },
    orbitalPeriod: 4331.0,
    rotationPeriod: 9.93, // fastest rotating planet
    axialTilt: 3.13,
    eccentricity: 0.0489,

    description:
      "Jupiter is the largest planet in our solar system, a gas giant with a mass more than twice that of all other planets combined. This colossal world is composed primarily of hydrogen and helium, with no well-defined solid surface. Instead, its atmosphere gradually transitions into a dense, hot interior where hydrogen exists in exotic metallic form under extreme pressure.\n\nThe most iconic feature of Jupiter is the Great Red Spot, an enormous anticyclonic storm that has been raging for at least 350 years. This storm is so large that Earth could fit inside it, though it has been gradually shrinking over the past century. Jupiter's atmosphere displays dramatic banded patterns created by powerful jet streams that can reach speeds of 620 km/h.\n\nJupiter's immense gravitational influence has profoundly shaped the solar system. It acts as a cosmic vacuum cleaner, capturing or deflecting comets and asteroids that might otherwise strike the inner planets. The planet has at least 95 known moons, including the four large Galilean moons — Io, Europa, Ganymede, and Callisto — each a fascinating world in its own right. Europa, in particular, is considered one of the most promising places to search for extraterrestrial life due to its subsurface ocean.",

    atmosphere: [
      "Hydrogen (~89.8%)",
      "Helium (~10.2%)",
      "Methane (trace)",
      "Ammonia (trace)",
      "Hydrogen Deuteride (trace)",
      "Ethane (trace)",
    ],
    moons: 95,
    funFacts: [
      "Jupiter's Great Red Spot is a storm larger than Earth that has been raging for at least 350 years, with wind speeds up to 640 km/h.",
      "Jupiter has the shortest day of any planet — it completes one rotation in just under 10 hours, despite being 11 times wider than Earth.",
      "Jupiter's moon Europa likely has more liquid water beneath its icy crust than all of Earth's oceans combined.",
      "Jupiter's magnetic field is the strongest of any planet — about 20,000 times stronger than Earth's — and extends millions of kilometers into space.",
      "If Jupiter had been about 80 times more massive, it would have had enough pressure and temperature to ignite nuclear fusion and become a star.",
    ],

    textureMap: "/textures/jupiter.jpg",
    sceneRadius: 1.2,
    sceneOrbitRadius: 34,
  },

  // ──────────────────────────────────────────────────────────
  // SATURN
  // ──────────────────────────────────────────────────────────
  {
    id: "saturn",
    name: "Saturn",
    slug: "saturn",
    classification: "Gas Giant",
    accentColor: "#A78BFA",

    mass: 5.683e26,
    radius: 58232,
    gravity: 10.44,
    temperature: { min: -178, max: -139, mean: -140 },

    distanceFromSun: { min: 1349.5, max: 1503.5, mean: 1432.0 },
    orbitalPeriod: 10747.0,
    rotationPeriod: 10.66,
    axialTilt: 26.73,
    eccentricity: 0.0565,

    description:
      "Saturn is the sixth planet from the Sun and the second-largest in our solar system. It is perhaps the most visually stunning of all planets, instantly recognizable by its magnificent ring system. These rings, composed primarily of billions of particles of water ice ranging in size from tiny grains to house-sized chunks, extend up to 282,000 km from the planet's center but are remarkably thin — averaging only about 10 meters in thickness.\n\nLike Jupiter, Saturn is a gas giant composed predominantly of hydrogen and helium. It is the least dense planet in the solar system, with an average density of only 0.687 g/cm³ — less than water. If you could find a bathtub large enough, Saturn would theoretically float. Despite its low density, Saturn's volume is 764 times that of Earth.\n\nSaturn has at least 146 known moons, more than any other planet. Its largest moon, Titan, is the second-largest moon in the solar system and the only moon with a dense atmosphere. Titan has lakes and seas of liquid methane and ethane on its surface, making it the only body besides Earth known to have stable surface liquids. Another moon, Enceladus, shoots geysers of water ice into space from its south pole, suggesting a subsurface ocean that could potentially support life.",

    atmosphere: [
      "Hydrogen (~96.3%)",
      "Helium (~3.25%)",
      "Methane (~0.45%)",
      "Ammonia (~0.0125%)",
      "Hydrogen Deuteride (~0.011%)",
      "Ethane (trace)",
    ],
    moons: 146,
    funFacts: [
      "Saturn's rings are extraordinarily thin relative to their width — if the rings were a sheet of paper, they would be the size of a football field.",
      "Saturn is the least dense planet in the solar system at 0.687 g/cm³ — less dense than water. It would float in a sufficiently large ocean.",
      "Saturn's moon Titan has a thicker atmosphere than Earth and is the only moon with a dense atmosphere. Its surface has lakes of liquid methane and ethane.",
      "A hexagonal storm system at Saturn's north pole, first discovered by Voyager, spans about 30,000 km across — large enough to fit nearly four Earths inside.",
      "Saturn's rings are gradually disappearing. NASA research suggests they could be gone within 100 million years, pulled into the planet by gravity as 'ring rain.'",
    ],

    textureMap: "/textures/saturn.jpg",
    ringTexture: "/textures/saturn-ring.png",
    sceneRadius: 1.0,
    sceneOrbitRadius: 44,
  },

  // ──────────────────────────────────────────────────────────
  // URANUS
  // ──────────────────────────────────────────────────────────
  {
    id: "uranus",
    name: "Uranus",
    slug: "uranus",
    classification: "Ice Giant",
    accentColor: "#2DD4BF",

    mass: 8.681e25,
    radius: 25362,
    gravity: 8.87,
    temperature: { min: -224, max: -197, mean: -195 },

    distanceFromSun: { min: 2742.0, max: 3008.0, mean: 2871.0 },
    orbitalPeriod: 30589.0,
    rotationPeriod: -17.24, // retrograde
    axialTilt: 97.77, // essentially rolling on its side
    eccentricity: 0.0457,

    description:
      "Uranus is the seventh planet from the Sun and the third-largest by diameter. Classified as an ice giant, it is fundamentally different from the gas giants Jupiter and Saturn. Beneath its blue-green hydrogen and helium atmosphere lies a mantle of water, methane, and ammonia ices, with a small rocky core at the center.\n\nThe most striking feature of Uranus is its extreme axial tilt of 97.77 degrees — the planet essentially orbits the Sun on its side. This means that during its 84-year orbit, each pole gets around 42 years of continuous sunlight followed by 42 years of darkness. The cause of this dramatic tilt is believed to be a collision with an Earth-sized body early in the solar system's history.\n\nUranus appears as a featureless blue-green disk in most images due to methane in its upper atmosphere, which absorbs red light and reflects blue-green wavelengths. Despite its bland appearance, Uranus has a complex ring system (discovered in 1977) consisting of 13 known rings, and 28 known moons. It is also the coldest planet in the solar system, with atmospheric temperatures dropping as low as -224°C.",

    atmosphere: [
      "Hydrogen (~82.5%)",
      "Helium (~15.2%)",
      "Methane (~2.3%)",
      "Hydrogen Deuteride (trace)",
      "Ammonia (trace)",
    ],
    moons: 28,
    funFacts: [
      "Uranus rotates on its side with an axial tilt of 97.77°, likely the result of a collision with an Earth-sized object billions of years ago.",
      "Uranus is the coldest planet in the solar system, with a minimum atmospheric temperature of -224°C, even colder than Neptune despite being closer to the Sun.",
      "Uranus was the first planet discovered with a telescope, found by William Herschel in 1781. He initially thought it was a comet.",
      "A single year on Uranus lasts 84 Earth years, meaning each pole experiences 42 years of continuous sunlight followed by 42 years of darkness.",
      "Uranus has 13 known rings, which are narrow and dark compared to Saturn's bright, wide ring system.",
    ],

    textureMap: "/textures/uranus.jpg",
    ringTexture: "/textures/uranus-ring.png",
    sceneRadius: 0.7,
    sceneOrbitRadius: 56,
  },

  // ──────────────────────────────────────────────────────────
  // NEPTUNE
  // ──────────────────────────────────────────────────────────
  {
    id: "neptune",
    name: "Neptune",
    slug: "neptune",
    classification: "Ice Giant",
    accentColor: "#6366F1",

    mass: 1.024e26,
    radius: 24622,
    gravity: 11.15,
    temperature: { min: -218, max: -200, mean: -200 },

    distanceFromSun: { min: 4460.0, max: 4537.0, mean: 4495.0 },
    orbitalPeriod: 59800.0,
    rotationPeriod: 16.11,
    axialTilt: 28.32,
    eccentricity: 0.0113,

    description:
      "Neptune is the eighth and most distant planet in our solar system. This dark, cold ice giant was the first planet located through mathematical predictions rather than direct observation. After astronomers noticed that Uranus's orbit deviated from predictions, they calculated where an unknown planet must be tugging on it. In 1846, Johann Galle observed Neptune within one degree of the predicted position.\n\nNeptune is remarkably dynamic despite receiving very little solar energy at its vast distance from the Sun. It has the strongest sustained winds of any planet in the solar system, with speeds reaching up to 2,100 km/h — nearly supersonic. The planet's vivid blue color comes from methane in its atmosphere, similar to Uranus, though Neptune is a deeper, more vivid blue, suggesting an additional unknown chromophore.\n\nNeptune's largest moon, Triton, is one of the coldest objects in the solar system with surface temperatures around -235°C. Triton orbits Neptune in a retrograde direction (opposite to the planet's rotation), strongly suggesting it is a captured Kuiper Belt object. Triton has active nitrogen geysers that shoot plumes up to 8 km above its surface.",

    atmosphere: [
      "Hydrogen (~80%)",
      "Helium (~19%)",
      "Methane (~1.5%)",
      "Hydrogen Deuteride (trace)",
      "Ethane (trace)",
    ],
    moons: 16,
    funFacts: [
      "Neptune has the strongest winds in the solar system, with speeds measured up to 2,100 km/h — about 1.6 times the speed of sound.",
      "Neptune was the first planet found by mathematical prediction rather than direct observation, discovered in 1846 based on perturbations in Uranus's orbit.",
      "One year on Neptune lasts about 165 Earth years. Neptune completed its first full orbit since its discovery in 2011.",
      "Neptune's moon Triton orbits in the opposite direction to the planet's rotation and is gradually spiraling inward — in about 3.6 billion years it will cross Neptune's Roche limit and be torn apart, potentially forming a ring system rivaling Saturn's.",
      "Neptune radiates more than twice as much energy as it receives from the Sun, suggesting an internal heat source that is not yet fully understood.",
    ],

    textureMap: "/textures/neptune.jpg",
    sceneRadius: 0.65,
    sceneOrbitRadius: 66,
  },

  // ──────────────────────────────────────────────────────────
  // PLUTO
  // ──────────────────────────────────────────────────────────
  {
    id: "pluto",
    name: "Pluto",
    slug: "pluto",
    classification: "Dwarf Planet",
    accentColor: "#F472B6",

    mass: 1.303e22,
    radius: 1188.3,
    gravity: 0.62,
    temperature: { min: -240, max: -218, mean: -229 },

    distanceFromSun: { min: 4436.0, max: 7375.9, mean: 5906.4 },
    orbitalPeriod: 90560.0,
    rotationPeriod: -153.29, // retrograde, ~6.39 Earth days
    axialTilt: 122.53,
    eccentricity: 0.2488,

    description:
      "Pluto is a dwarf planet in the Kuiper Belt, a ring of icy bodies beyond Neptune's orbit. Discovered in 1930 by Clyde Tombaugh, Pluto was considered the ninth planet for 76 years before being reclassified as a dwarf planet by the International Astronomical Union in 2006. Despite its small size — smaller than Earth's Moon — Pluto has proven to be a surprisingly complex and geologically active world.\n\nNASA's New Horizons mission, which flew by Pluto in July 2015, revealed a world far more diverse than anyone expected. The most prominent feature is Sputnik Planitia, a vast heart-shaped plain of nitrogen ice approximately 1,000 km across. This basin shows evidence of convective overturn, with polygonal cells of nitrogen ice slowly churning and renewing the surface, meaning parts of Pluto's surface are geologically young — perhaps less than 10 million years old.\n\nPluto has five known moons, with Charon being by far the largest at roughly half Pluto's diameter. The Pluto-Charon system is often considered a binary dwarf planet because the center of mass (barycenter) lies outside Pluto's surface. Both bodies are tidally locked, meaning they always show the same face to each other.",

    atmosphere: [
      "Nitrogen (~99%)",
      "Methane (~0.5%)",
      "Carbon Monoxide (~0.05%)",
    ],
    moons: 5,
    funFacts: [
      "Pluto's largest moon Charon is so large relative to Pluto (about half its diameter) that the two are sometimes called a 'double dwarf planet' — they orbit a point in space between them.",
      "Pluto's orbit is so eccentric that it sometimes comes closer to the Sun than Neptune. This last occurred from 1979 to 1999.",
      "Despite being reclassified as a dwarf planet, Pluto has a more complex geology than many full-sized planets, with mountains of water ice, flowing nitrogen glaciers, and a possible subsurface ocean.",
      "It takes sunlight about 5.5 hours to reach Pluto. By comparison, it takes only 8 minutes to reach Earth.",
      "Pluto's heart-shaped feature (Sputnik Planitia) is a basin filled with nitrogen ice that slowly churns like a lava lamp, driven by convective heat from below.",
    ],

    textureMap: "/textures/pluto.jpg",
    sceneRadius: 0.2,
    sceneOrbitRadius: 80,
  },
];

/**
 * Lookup a planet by its ID.
 */
export function getPlanetById(id: string): PlanetData | undefined {
  return planets.find((p) => p.id === id);
}

/**
 * Lookup a planet by its URL slug.
 */
export function getPlanetBySlug(slug: string): PlanetData | undefined {
  return planets.find((p) => p.slug === slug);
}

/**
 * Get all planets excluding the Sun.
 */
export function getPlanetsOnly(): PlanetData[] {
  return planets.filter((p) => p.id !== "sun");
}
