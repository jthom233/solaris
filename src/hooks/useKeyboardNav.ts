'use client';

import { useEffect } from 'react';
import { useSolarSystemStore } from '@/stores/solarSystemStore';
import { getPlanetsOnly } from '@/data/planets';

/**
 * Planet list ordered by distance from the Sun.
 * Keys 1-9 map to Mercury(1), Venus(2), Earth(3), Mars(4),
 * Jupiter(5), Saturn(6), Uranus(7), Neptune(8), Pluto(9).
 * Key 0 deselects (go home). Escape closes the panel.
 */
const orderedPlanets = getPlanetsOnly();

/**
 * Hook that binds global keyboard shortcuts for planet navigation.
 *
 * - Number keys 1-9: select the corresponding planet
 * - 0: go home (deselect)
 * - Escape: close the panel / deselect
 */
export function useKeyboardNav(): void {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Skip when user is typing in an input, textarea, or contenteditable
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      const { selectPlanet, goHome } = useSolarSystemStore.getState();

      if (e.key === 'Escape') {
        selectPlanet(null);
        return;
      }

      if (e.key === '0') {
        goHome();
        return;
      }

      // Number keys 1-9
      const num = parseInt(e.key, 10);
      if (num >= 1 && num <= 9 && num <= orderedPlanets.length) {
        const planet = orderedPlanets[num - 1];
        if (planet) {
          selectPlanet(planet.id);
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
}
