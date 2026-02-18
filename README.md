# SOLARIS

An interactive 3D solar system explorer built with WebGL. Every planet is rendered with hand-crafted GLSL shaders — no external textures required. Switch between a navigable view and true astronomical scale to see just how vast the solar system really is.

---

## Features

- **Procedural GLSL shaders** — each body has unique, animated shaders written from scratch. The Sun has a multi-layer simplex noise surface with limb darkening and a "boiling" vertex displacement. Earth has continent and terrain noise, an elevation color ramp, polar ice caps, and ocean specularity.
- **Scientifically accurate orbital mechanics** — planet positions are computed from J2000 Keplerian orbital elements sourced from JPL/Caltech, valid for 1800–2050 AD.
- **Dual-scale mode** — toggle between *Navigable* (compressed distances for exploration) and *True Scale* (astronomically proportional) with a smooth animated transition.
- **Interactive camera** — orbit, pan, and zoom freely. Click any planet to fly the camera to it.
- **Planet info panel** — surface data, atmospheric composition, fun facts, and scientifically sourced statistics displayed per body.
- **Keyboard navigation** — press `1`–`9` to jump to Mercury through Pluto; `0` to return home; `Escape` to dismiss.
- **Post-processing** — HDR bloom on the Sun and vignette framing via `@react-three/postprocessing`.
- **Optional NASA textures** — drop 2K equirectangular maps into `public/textures/` for photorealistic mode; the app renders fully without them.
- **WebGL fallback** — graceful degradation if WebGL is unavailable.

---

## Tech Stack

| Layer | Library / Tool |
|---|---|
| Framework | Next.js 15 (App Router) |
| UI | React 19 |
| 3D rendering | Three.js 0.183, React Three Fiber 9 |
| Helpers | @react-three/drei 10 |
| Post-processing | @react-three/postprocessing 3 |
| Animation | Framer Motion 12 |
| State | Zustand 5 |
| Styling | Tailwind CSS 4 |
| Language | TypeScript 5.7 |

---

## Getting Started

**Prerequisites:** Node.js 18 or later.

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

```bash
# Production build
npm run build
npm start
```

---

## Project Structure

```
src/
├── app/                  # Next.js App Router entry point
├── components/
│   ├── scene/            # Three.js scene graph (SolarSystem, Sun, PlanetInOrbit,
│   │                     #   CameraController, StarField, Lighting, Effects)
│   └── ui/               # Overlay components (PlanetPanel, NavigationBar,
│                         #   ScaleToggle, TimeDisplay, IntroOverlay, WebGLFallback)
├── data/
│   ├── planets.ts        # Full physical/descriptive data for all bodies (NASA sources)
│   └── orbitalElements.ts# J2000 Keplerian elements (JPL/Caltech)
├── hooks/                # useKeyboardNav, and other custom hooks
├── lib/
│   └── constants.ts      # Scale factors, AU conversion, J2000 epoch
├── shaders/
│   ├── noise.ts          # Shared GLSL: 3D simplex noise, FBM, ridged noise
│   ├── sun.ts            # Sun vertex + fragment shaders
│   ├── earth.ts          # Earth vertex + fragment shaders
│   └── ...               # Per-planet shader modules
├── stores/
│   └── solarSystemStore.ts # Zustand store (selected planet, scale mode, time)
└── types/                # Shared TypeScript interfaces
```

---

## Planet Shaders

Each planet's appearance is driven entirely by GLSL code — no image textures are shipped with the application.

The shared `noise.ts` module provides 3D simplex noise, fractal Brownian motion (FBM), and ridged noise functions that planet shaders compose together. A few examples:

- **Sun** — three layers of animated simplex noise drive a hot color ramp (deep convection cells to bright granules), with vertex displacement for a subtle surface "boil" and physically-based limb darkening.
- **Earth** — low-frequency continental noise combined with high-frequency terrain detail feeds an elevation color ramp (deep ocean → coast → lowland → highland → snow peaks), with polar ice caps blended by latitude and ocean specularity computed per fragment.
- **Other planets** — each has its own shader tuned to its character: gas giant banding for Jupiter, ring geometry for Saturn and Uranus, dusty rust tones for Mars, and so on.

Shaders are authored as TypeScript-hosted GLSL string constants and compiled at runtime into `THREE.ShaderMaterial` instances.

---

## Optional Textures

The application ships and runs without any image textures. If you want photorealistic surfaces, you can layer 2K equirectangular maps on top of the procedural shaders.

See **[public/textures/README.md](public/textures/README.md)** for the full file list and recommended sources (Solar System Scope CC-BY 4.0, NASA Visible Earth public domain, JHT's Planetary Pixel Emporium).

Place downloaded files in `public/textures/` and the planet components will prefer them over procedural rendering automatically.

---

## License

MIT
