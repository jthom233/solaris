'use client';

import { useMemo } from 'react';
import type { OrbitalElements } from '@/types';
import { calculatePlanetPosition } from '@/lib/orbital';

/**
 * Compute a planet's current orbital position in scene units.
 *
 * The position is recalculated whenever the minute changes (positions
 * barely shift at frame granularity, so per-minute is more than sufficient).
 */
export function useOrbitalPosition(
  orbitalElements: OrbitalElements,
  scaleMultiplier: number,
): [number, number, number] {
  // Truncate Date to the current minute so the memo only updates ~once/minute
  const now = new Date();
  const minuteKey = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}-${now.getHours()}-${now.getMinutes()}`;

  return useMemo(() => {
    const pos = calculatePlanetPosition(orbitalElements, new Date());
    return [
      pos.x * scaleMultiplier,
      pos.y * scaleMultiplier,
      pos.z * scaleMultiplier,
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orbitalElements, scaleMultiplier, minuteKey]);
}
