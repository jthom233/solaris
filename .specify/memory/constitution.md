# SOLARIS — Project Constitution

## Vision
The most visually stunning, scientifically accurate, and accessible solar system explorer on the web. SOLARIS fills the gap between accurate-but-ugly institutional tools and beautiful-but-shallow demos by being both accurate AND beautiful with a 2026 design language.

## Architecture Principles
- **Component-driven**: Modular React components with clear separation between 3D scene, UI overlay, and data layers
- **Performance-first**: Target 60fps on mid-range hardware (integrated graphics 2020+). Use LOD, texture compression (KTX2), and on-demand rendering
- **Progressive disclosure**: Show minimal info first, reveal depth on demand. Never overwhelm the user
- **Data accuracy**: All orbital positions from real ephemeris data. Every number sourced and verifiable
- **Offline-capable**: Core 3D experience works without API calls; live data enhances but isn't required

## Technology Stack
- **Framework**: Next.js 15 (App Router) + TypeScript
- **3D Engine**: React Three Fiber + @react-three/drei + @react-three/postprocessing
- **State Management**: Zustand (lightweight, performant, React-friendly)
- **Styling**: Tailwind CSS v4 with custom glassmorphism design tokens
- **Animation**: Framer Motion (2D UI), R3F spring animations (3D)
- **Data Fetching**: TanStack Query for API caching and background refresh
- **APIs**: Solar System OpenData API, NASA APOD API, JPL Horizons (for ephemeris)
- **Fonts**: Space Grotesk (display), Inter (body), JetBrains Mono (data/numbers)

## Quality Standards
- TypeScript strict mode — no `any` types
- All components have clear props interfaces
- 3D scene performance profiled with R3F Perf monitor
- Accessible: keyboard navigation, screen reader support for info panels, reduced-motion support
- Responsive: desktop and tablet (landscape). Mobile gets a simplified 2D fallback
- No placeholder content in production — every texture, fact, and number must be real

## Design Principles
- **Awe first, information second**: The first experience must be cinematic
- **The camera is the interface**: Navigation should feel like flying through space
- **Space should feel like space**: Honor the darkness, glassmorphism panels float in the void
- **Delight in the details**: Correct axial tilts, day/night terminators, ring shadows
- **Respect the data**: Every number accurate and sourced

## Color System
- Background: #030014 (near-black with blue undertone)
- Surface: rgba(255, 255, 255, 0.05) with backdrop-blur
- Accent Primary: #7C3AED (cosmic purple)
- Accent Warm: #F59E0B (solar amber)
- Accent Cool: #06B6D4 (cyan for data)
- Text Primary: #F8FAFC
- Text Secondary: #94A3B8
- Per-planet signature colors for theming

## Development Practices
- Feature branches, atomic commits, PRs for all changes
- Components organized by domain: scene/, ui/, data/, hooks/
- Shared types in a central types/ directory
- Environment variables for API keys (NASA API key)
