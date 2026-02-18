'use client';

import dynamic from 'next/dynamic';
import PlanetPanel from '@/components/ui/PlanetPanel';
import NavigationBar from '@/components/ui/NavigationBar';
import ScaleToggle from '@/components/ui/ScaleToggle';
import TimeDisplay from '@/components/ui/TimeDisplay';
import IntroOverlay from '@/components/ui/IntroOverlay';
import WebGLFallback from '@/components/ui/WebGLFallback';
import { useKeyboardNav } from '@/hooks/useKeyboardNav';

const SolarSystem = dynamic(
  () => import('@/components/scene/SolarSystem'),
  { ssr: false },
);

export default function Home() {
  useKeyboardNav();

  return (
    <main className="h-screen w-screen overflow-hidden bg-[var(--bg-space)]">
      <WebGLFallback>
        <SolarSystem />
      </WebGLFallback>
      <IntroOverlay />
      <PlanetPanel />
      <NavigationBar />
      <ScaleToggle />
      <TimeDisplay />
    </main>
  );
}
