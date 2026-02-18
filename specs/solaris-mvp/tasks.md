# Implementation Tasks: SOLARIS MVP

## Task Status Legend
- ⏳ Pending
- 🔄 In Progress
- ✅ Completed
- 🔀 Can run in parallel

---

## Phase 1: Project Setup (Sequential)

### T001: Initialize Next.js 15 project with TypeScript
- Create Next.js 15 app with App Router, TypeScript strict mode
- Configure `tsconfig.json` with strict settings and path aliases (`@/`)
- Setup `package.json` scripts (dev, build, lint)
- Verify `npm run dev` works with a blank page
- **Status**: ⏳

### T002: Install and configure dependencies
- Install R3F ecosystem: `@react-three/fiber`, `@react-three/drei`, `@react-three/postprocessing`, `three`, `@types/three`
- Install state management: `zustand`
- Install animation: `framer-motion`
- Install Tailwind CSS v4 and configure
- Install fonts: Space Grotesk, Inter, JetBrains Mono via `next/font/google`
- **Status**: ⏳
- **Depends on**: T001

### T003: Configure Tailwind and global styles
- Setup Tailwind v4 config with custom design tokens (colors, spacing)
- Create glassmorphism utility classes (`.glass-panel`, `.glass-nav`)
- Define CSS custom properties for the SOLARIS color system
- Import fonts in root layout
- Set `html, body` to dark background (#030014)
- **Status**: ⏳
- **Depends on**: T002

### T004: Create project directory structure
- Create all directories per the architecture plan: `components/scene/`, `components/ui/`, `data/`, `hooks/`, `stores/`, `lib/`, `types/`
- Create placeholder `index.ts` barrel exports where needed
- Setup `types/index.ts` with core TypeScript interfaces (PlanetData, OrbitalElements, etc.)
- **Status**: ⏳
- **Depends on**: T002

### T005: Create planetary data files
- Create `data/planets.ts` with complete, scientifically accurate data for Sun + 8 planets + Pluto
- Include: mass, radius, gravity, temperatures, distances, orbital periods, rotation periods, axial tilts, descriptions, atmosphere composition, moon counts, fun facts
- Create `data/orbitalElements.ts` with J2000 Keplerian elements for each planet (from JPL)
- All data sourced from NASA Planetary Fact Sheets and JPL Solar System Dynamics
- **Status**: ⏳
- **Depends on**: T004

### T006: Download and organize planet textures
- Download 2K NASA texture maps for: Sun, Mercury, Venus, Earth (+ clouds), Mars, Jupiter, Saturn (+ rings), Uranus, Neptune, Pluto
- Optimize images for web (compress, ensure reasonable file sizes)
- Place in `public/textures/` with consistent naming (`mercury.jpg`, `saturn-ring.png`, etc.)
- **Status**: ⏳
- **Depends on**: T001

---

## Phase 2: Core 3D Scene (Sequential — each builds on previous)

### T007: Create Zustand store
- Implement `stores/solarSystemStore.ts`
- State: `selectedPlanet`, `cameraTarget`, `scaleMode` ('navigable' | 'true'), `isIntroComplete`, `isPanelOpen`
- Actions: `selectPlanet()`, `goHome()`, `toggleScale()`, `completeIntro()`, `togglePanel()`
- **Status**: ⏳
- **Depends on**: T004

### T008: Create orbital math utilities
- Implement `lib/orbital.ts` with Keplerian orbit calculation
- Function: `calculatePosition(elements, date) → {x, y, z}` in AU
- Function: `auToSceneUnits(au, scaleMode) → number`
- Function: `calculateOrbitalPath(elements, segments) → Vector3[]` for orbit lines
- Use standard astronomical algorithms (mean anomaly → eccentric anomaly → true anomaly → heliocentric coords)
- **Status**: ⏳
- **Depends on**: T004, T005

### T009: Build SolarSystem canvas and scene shell
- Create `components/scene/SolarSystem.tsx` — the main R3F `<Canvas>` wrapper
- Configure: `camera` (PerspectiveCamera, fov: 45), `gl` (antialias, toneMapping, outputColorSpace)
- Add `<Suspense>` boundary with loading fallback
- Add `<Lighting>` component: single PointLight at origin (Sun) + subtle ambient light
- Add `<StarField>` using drei's `<Stars>` with custom parameters (count: 5000, depth: 200)
- Mount in `app/page.tsx` as a full-viewport component
- **Status**: ⏳
- **Depends on**: T002, T007

### T010: Build Sun component
- Create `components/scene/Sun.tsx`
- Sphere mesh with emissive material (color: #FDB813, emissiveIntensity: 2)
- Apply Sun texture map
- Add to bloom layer for glow effect
- Slow rotation animation in useFrame
- **Status**: ⏳
- **Depends on**: T009, T006

### T011: Build Planet component
- Create `components/scene/Planet.tsx` — reusable for all planets
- Props: `planetData: PlanetData`, receives orbital position from parent
- Sphere mesh with NASA texture (loaded via drei `useTexture`)
- Correct axial tilt (rotation.x based on data)
- Self-rotation in useFrame at correct relative speed
- Click handler: dispatches `selectPlanet()` to Zustand store
- Hover effect: subtle scale increase + cursor pointer
- Optional ring system (Saturn, Uranus): torus/ring geometry with transparency
- **Status**: ⏳
- **Depends on**: T009, T006, T008

### T012: Build OrbitLine component
- Create `components/scene/OrbitLine.tsx`
- Renders elliptical orbit path as a line using `<Line>` from drei
- Semi-transparent, subtle glow (added to bloom layer at low intensity)
- Color matches planet's accent color at low opacity
- Generated from orbital elements via `calculateOrbitalPath()`
- **Status**: ⏳
- **Depends on**: T009, T008

### T013: Assemble the solar system
- In `SolarSystem.tsx`, render Sun + all 9 planets with their OrbitLines
- Each Planet positioned using `useOrbitalPosition` hook with current date
- Implement `hooks/useOrbitalPosition.ts` — calls `calculatePosition()` per frame (or on date change)
- Define scene scale constants in `lib/constants.ts` (navigable distances, size multipliers)
- Verify all planets render at correct relative positions and sizes
- **Status**: ⏳
- **Depends on**: T010, T011, T012

### T014: Build CameraController
- Create `components/scene/CameraController.tsx`
- Uses drei `OrbitControls` as base with customizations
- Implements animated fly-to when `selectedPlanet` changes in store
- Smooth camera position + target interpolation using lerp in useFrame
- Overview mode: camera pulls back to see full system
- Focus mode: camera orbits around selected planet at `planetRadius * 4` distance
- Min/max zoom bounds per mode
- **Status**: ⏳
- **Depends on**: T009, T007

### T015: Add post-processing effects
- Create `components/scene/Effects.tsx`
- Selective bloom: Sun on layer 1 with high intensity, orbit lines on layer 1 with low intensity
- Vignette: subtle edge darkening (offset: 0.3, darkness: 0.7)
- Depth of field: disabled by default, subtle bokeh when zoomed into a planet
- Ensure effects don't tank performance below 60fps
- **Status**: ⏳
- **Depends on**: T013

---

## Phase 3: UI Layer (🔀 Parallel — independent UI components)

### T016: Build PlanetPanel component 🔀
- Create `components/ui/PlanetPanel.tsx`
- Glassmorphism card: backdrop-blur, semi-transparent bg, subtle border
- Sections: planet name + classification, key stats grid, description, atmosphere, fun facts
- Per-planet accent color applied to heading and stat highlights
- Framer Motion enter/exit: fade + slide from right (300ms)
- Close button (X) + click-outside-to-close
- Responsive: full-width on smaller screens, fixed-width sidebar on desktop
- Keyboard accessible: Escape to close, tab through stats
- Reads `selectedPlanet` from Zustand store, looks up data from `planets.ts`
- **Status**: ⏳
- **Depends on**: T003, T007, T005

### T017: Build NavigationBar component 🔀
- Create `components/ui/NavigationBar.tsx`
- Fixed bottom bar with glassmorphism styling
- Planet items in Sun-to-Pluto order: small colored dot + name
- Active planet highlighted with its accent color + underline
- Click handler: dispatches `selectPlanet()` + triggers camera transition
- Home button to return to overview
- Responsive: icon-only mode on smaller widths
- Keyboard: arrow keys to move between planets, Enter to select
- **Status**: ⏳
- **Depends on**: T003, T007, T005

### T018: Build ScaleToggle component 🔀
- Create `components/ui/ScaleToggle.tsx`
- Toggle switch in the UI corner: "Navigable" / "True Scale"
- Dispatches `toggleScale()` to Zustand store
- Visual indicator of active mode
- In true scale, shows distance counter overlay: "Distance to [next planet]: X km"
- Glassmorphism styling consistent with other UI
- **Status**: ⏳
- **Depends on**: T003, T007

### T019: Build TimeDisplay component 🔀
- Create `components/ui/TimeDisplay.tsx`
- Shows current date in upper corner
- Subtle label: "Orbital positions as of [date]"
- JetBrains Mono font for the date
- Glassmorphism styling
- **Status**: ⏳
- **Depends on**: T003

---

## Phase 4: Scale System & Intro (Sequential)

### T020: Implement scale transition system
- In `SolarSystem.tsx` / planet positioning: read `scaleMode` from store
- Define two sets of constants: navigable distances/sizes and true-scale distances/sizes
- Animate between scales using lerp over ~1.5s (tracked in useFrame)
- In true scale: planets shrink to tiny dots, distances expand enormously
- Camera auto-adjusts to keep view reasonable during transition
- **Status**: ⏳
- **Depends on**: T013, T018

### T021: Build IntroOverlay and intro camera sequence
- Create `components/ui/IntroOverlay.tsx`
- On first load: "SOLARIS" title with glow animation + "Explore Our Solar System" tagline
- Camera starts far away and sweeps in toward the solar system over ~3s
- After intro completes: overlay fades out, user gains control
- Set `isIntroComplete` in store
- Star field visible behind the overlay text during loading
- **Status**: ⏳
- **Depends on**: T013, T014, T003

---

## Phase 5: Navigation & Interaction Polish (Sequential)

### T022: Implement keyboard navigation
- Create `hooks/useKeyboardNav.ts`
- Number keys 1-9: jump to planets (1=Mercury through 8=Neptune, 9=Pluto)
- 0 or Home: return to overview
- Escape: close panel
- Arrow keys: prev/next planet (when nav bar focused)
- Register globally on mount, cleanup on unmount
- **Status**: ⏳
- **Depends on**: T014, T007

### T023: Implement planet deep-link routes
- Create `app/planet/[slug]/page.tsx`
- SSG with `generateStaticParams()` for all planet slugs
- On load: renders the solar system with that planet pre-selected
- OpenGraph meta tags per planet (title, description, image)
- **Status**: ⏳
- **Depends on**: T013, T016

### T024: WebGL fallback and error boundaries
- Add WebGL detection check on app load
- If WebGL2 not supported: show a beautiful fallback message with browser upgrade instructions
- React error boundary around the Canvas to catch R3F crashes gracefully
- `prefers-reduced-motion` media query: disable camera animations, reduce particle effects
- **Status**: ⏳
- **Depends on**: T013

---

## Phase 6: Quality Assurance & Polish

### T025: Performance optimization
- Profile with R3F `<Perf>` monitor
- Implement LOD for planet textures (lower res when far)
- Ensure draw calls < 50, triangles < 500K
- Optimize star field (instanced mesh if needed)
- Test on integrated GPU (Intel Iris Xe level)
- Verify 60fps on target hardware
- **Status**: ⏳
- **Depends on**: T020, T021

### T026: Visual polish pass
- Fine-tune bloom intensity and threshold
- Adjust camera transition timing and easing
- Polish glassmorphism: border opacity, blur amount, shadow
- Ensure per-planet colors look good across all panels
- Test intro animation timing and feel
- Add subtle hover animations to interactive elements
- **Status**: ⏳
- **Depends on**: T025

### T027: Accessibility audit
- Test keyboard navigation through entire app flow
- Add aria-labels to all interactive elements
- Ensure info panel is screen-reader friendly (proper headings, data tables)
- Verify WCAG AA contrast ratios on all glassmorphism text
- Test with prefers-reduced-motion
- **Status**: ⏳
- **Depends on**: T026

### T028: Cross-browser testing
- Test on Chrome, Firefox, Safari, Edge (latest versions)
- Verify WebGL2 works on all targets
- Test responsive layout on 1024px, 1280px, 1440px, 1920px widths
- Fix any browser-specific rendering issues
- **Status**: ⏳
- **Depends on**: T026

---

## Phase 7: Deployment

### T029: Prepare for deployment
- Create comprehensive README with: project description, tech stack, setup instructions, scripts, architecture overview
- Add `.env.example` with any needed env vars (NASA API key if APOD integrated)
- Configure OpenGraph meta tags and favicon
- Add robots.txt and sitemap
- **Status**: ⏳
- **Depends on**: T027, T028

### T030: Deploy to Vercel
- Connect repository to Vercel
- Configure build settings (Next.js auto-detected)
- Verify production build succeeds
- Test deployed URL end-to-end
- Verify texture loading from CDN
- **Status**: ⏳
- **Depends on**: T029

---

## Parallel Execution Plan

### Workstream A (3D Scene): T007 → T008 → T009 → T010 → T011 → T012 → T013 → T014 → T015
### Workstream B (UI Components): T016, T017, T018, T019 (all parallel after T003+T007)
### Integration Point: T020, T021 merge 3D + UI

### File Boundaries for Parallel Work
- **Workstream A** owns: `components/scene/*`, `hooks/useOrbitalPosition.ts`, `lib/*`
- **Workstream B** owns: `components/ui/*`, `hooks/useKeyboardNav.ts`
- **Shared** (sequential only): `stores/solarSystemStore.ts`, `data/*`, `types/*`, `app/*`
