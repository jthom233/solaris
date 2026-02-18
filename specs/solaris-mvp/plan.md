# Technical Implementation Plan: SOLARIS MVP

## Technology Stack

### Frontend Framework
- **Next.js 15** (App Router) with TypeScript strict mode
- Rationale: Best-in-class React framework with file-based routing, SSG support for planet pages, and excellent DX. App Router enables RSC for data-heavy planet pages.

### 3D Rendering
- **React Three Fiber (R3F)** v9+ — React renderer for Three.js
- **@react-three/drei** — Helper components (OrbitControls, Stars, useTexture, Html, Float)
- **@react-three/postprocessing** — Bloom, depth-of-field, vignette effects
- Rationale: R3F is the de facto standard for 3D in React. Drei provides battle-tested utilities. Postprocessing enables the cinematic look with minimal custom code.

### State Management
- **Zustand** — Lightweight store for global state
- Stores: `useSolarSystemStore` (selectedPlanet, cameraTarget, scaleMode, timeContext, uiState)
- Rationale: Minimal boilerplate, performant (no re-render cascading), perfect for R3F integration.

### Styling & Animation
- **Tailwind CSS v4** — Utility-first CSS with custom design tokens for glassmorphism
- **Framer Motion** — 2D UI animations (panel enter/exit, nav highlights)
- **R3F useFrame/useSpring** — 3D camera transitions and planet animations
- Rationale: Tailwind for rapid UI iteration. Framer Motion for polished 2D transitions. R3F spring animations for smooth 3D camera movement.

### Data
- **Static planet data** — Hardcoded JSON dataset with all planetary facts, descriptions, and stats. Sourced from NASA/JPL and verified for accuracy. No API dependency for core experience.
- **Orbital position calculation** — Client-side Keplerian orbital elements calculation using standard astronomical algorithms. No external API needed for current positions.
- **NASA APOD API** (optional enhancement) — Daily image via `api.nasa.gov`
- Rationale: Static data ensures zero-latency, offline-capable core experience. Orbital positions calculable client-side from known orbital elements.

### Fonts
- **Space Grotesk** — Display/headlines (variable weight, Google Fonts)
- **Inter** — Body text (variable weight, Google Fonts)  
- **JetBrains Mono** — Data/numbers (Google Fonts)

## Architecture

### Directory Structure
```
src/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout with fonts, metadata
│   ├── page.tsx                  # Main solar system page
│   └── planet/
│       └── [slug]/
│           └── page.tsx          # Planet deep-link pages (SSG)
├── components/
│   ├── scene/                    # 3D scene components
│   │   ├── SolarSystem.tsx       # Main R3F Canvas + scene setup
│   │   ├── Sun.tsx               # Sun mesh with emissive glow
│   │   ├── Planet.tsx            # Reusable planet component (mesh + orbit)
│   │   ├── OrbitLine.tsx         # Elliptical orbit path visualization
│   │   ├── StarField.tsx         # Background stars
│   │   ├── CameraController.tsx  # Animated camera transitions
│   │   ├── Lighting.tsx          # Scene lighting setup
│   │   └── Effects.tsx           # Post-processing pipeline (bloom, DOF)
│   └── ui/                       # 2D UI overlay components
│       ├── PlanetPanel.tsx       # Glassmorphism info panel
│       ├── NavigationBar.tsx     # Bottom planet navigation
│       ├── ScaleToggle.tsx       # Navigable/True scale switch
│       ├── TimeDisplay.tsx       # Current date/time display
│       ├── IntroOverlay.tsx      # First-load intro animation
│       └── LoadingScreen.tsx     # Star-field loading state
├── data/
│   ├── planets.ts                # Complete planetary dataset
│   ├── orbitalElements.ts        # Keplerian orbital elements per planet
│   └── funFacts.ts               # Fun facts per planet
├── hooks/
│   ├── useOrbitalPosition.ts     # Calculate planet position from orbital elements
│   ├── useCameraTransition.ts    # Smooth camera fly-to logic
│   └── useKeyboardNav.ts         # Keyboard shortcut handler
├── stores/
│   └── solarSystemStore.ts       # Zustand global state
├── lib/
│   ├── orbital.ts                # Keplerian orbit math utilities
│   └── constants.ts              # Scale factors, distances, sizes
├── styles/
│   └── globals.css               # Tailwind base + glassmorphism utilities
└── types/
    └── index.ts                  # Shared TypeScript interfaces
```

### Data Model

#### Planet Data Interface
```typescript
interface PlanetData {
  id: string;                    // e.g., "mars"
  name: string;                  // e.g., "Mars"
  slug: string;                  // URL slug
  classification: string;        // "Terrestrial" | "Gas Giant" | "Ice Giant" | "Dwarf Planet"
  accentColor: string;           // Hex color for theming
  
  // Physical properties
  mass: number;                  // kg
  radius: number;                // km
  gravity: number;               // m/s²
  temperature: { min: number; max: number; mean: number }; // °C
  
  // Orbital properties
  distanceFromSun: { min: number; max: number; mean: number }; // km
  orbitalPeriod: number;         // Earth days
  rotationPeriod: number;        // Earth hours
  axialTilt: number;             // degrees
  eccentricity: number;
  
  // Descriptive
  description: string;           // 2-3 paragraphs
  atmosphere: string[];          // Composition list
  moons: number;
  funFacts: string[];            // 3-5 facts
  
  // 3D rendering
  textureMap: string;            // Path to texture image
  normalMap?: string;            // Optional normal map
  ringTexture?: string;          // For Saturn, Uranus
  sceneRadius: number;           // Radius in scene units (navigable scale)
  sceneOrbitRadius: number;      // Orbit radius in scene units (navigable scale)
}
```

#### Orbital Elements Interface
```typescript
interface OrbitalElements {
  semiMajorAxis: number;         // AU
  eccentricity: number;
  inclination: number;           // degrees
  longitudeOfAscendingNode: number; // degrees
  argumentOfPerihelion: number;  // degrees
  meanLongitude: number;         // degrees at J2000
  rates: {                       // Per-century rates
    semiMajorAxis: number;
    eccentricity: number;
    inclination: number;
    longitudeOfAscendingNode: number;
    argumentOfPerihelion: number;
    meanLongitude: number;
  };
}
```

### Camera System
- **Focused mode**: Camera orbits around a selected planet at a calculated distance based on planet radius
- **Overview mode**: Camera positioned to see entire solar system (home view)
- **Transitions**: Animated using R3F spring physics (damping: 30, stiffness: 80) for smooth, cinematic feel
- **Controls**: Modified OrbitControls — rotation around focus point, scroll zoom with min/max bounds, pan disabled in focused mode

### Scale System
- **Navigable scale**: Distances compressed logarithmically so planets are reachable by clicking. Planet sizes slightly exaggerated for visibility.
- **True scale**: Real proportional distances (1 AU = fixed scene units). Planet sizes to real proportions. Most planets become sub-pixel — this is the point.
- **Transition**: Animated interpolation between the two scale systems over 1.5s using lerp in useFrame.

### Post-Processing Pipeline
1. **Bloom** — Applied to Sun (high intensity) and orbit lines (low intensity). Selective bloom via layers.
2. **Depth of Field** — Subtle bokeh blur on planets far from camera focus. Disabled in overview mode.
3. **Vignette** — Subtle edge darkening for cinematic framing.

### Texture Strategy
- Source: NASA/USGS Astrogeology Science Center planetary texture maps
- Format: JPEG for color maps (good compression, acceptable quality), PNG for maps needing transparency
- Resolution: 2K (2048x1024) for the main view, with 4K available for close-up zoom
- Loading: Lazy-loaded with useTexture from drei, with placeholder color while loading
- Storage: Static assets in `/public/textures/`

### Performance Budget
- **Bundle size**: < 500KB JS (gzipped), excluding textures
- **Texture budget**: ~20MB total (lazy-loaded, so initial load is ~2MB)
- **Draw calls**: < 50 per frame
- **Triangle count**: < 500K total scene
- **Target FPS**: 60fps on GTX 1060 / Intel Iris Xe

### Deployment
- **Platform**: Vercel (optimal for Next.js, free tier sufficient for MVP)
- **CDN**: Vercel Edge Network for static assets and textures
- **Domain**: configurable, works on Vercel preview URLs during development
