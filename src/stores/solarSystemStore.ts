import { create } from 'zustand';
import type { SolarSystemState } from '@/types';

export const useSolarSystemStore = create<SolarSystemState>((set) => ({
  selectedPlanet: null,
  scaleMode: 'navigable',
  isIntroComplete: false,
  isPanelOpen: false,

  selectPlanet: (id) => set({ selectedPlanet: id, isPanelOpen: id !== null }),
  goHome: () => set({ selectedPlanet: null, isPanelOpen: false }),
  toggleScale: () =>
    set((state) => ({
      scaleMode: state.scaleMode === 'navigable' ? 'true' : 'navigable',
    })),
  completeIntro: () => set({ isIntroComplete: true }),
  togglePanel: () => set((state) => ({ isPanelOpen: !state.isPanelOpen })),
}));
