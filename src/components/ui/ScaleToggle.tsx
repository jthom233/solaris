'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useSolarSystemStore } from '@/stores/solarSystemStore';
import type { ScaleMode } from '@/types';

/**
 * Toggle switch between "Navigable" and "True Scale" display modes.
 *
 * In true-scale mode, an informational overlay shows the AU/km relationship.
 */

interface ToggleOptionProps {
  label: string;
  icon: string;
  isActive: boolean;
  onClick: () => void;
}

function ToggleOption({ label, icon, isActive, onClick }: ToggleOptionProps) {
  return (
    <button
      onClick={onClick}
      className={`
        relative px-3 py-1.5 text-sm font-body rounded-lg transition-all duration-200
        focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30
        ${
          isActive
            ? 'text-[var(--text-primary)] bg-[var(--accent-primary)]/20 border border-white/10'
            : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-transparent'
        }
      `}
      aria-pressed={isActive}
      tabIndex={0}
    >
      <span className="mr-1.5">{icon}</span>
      {label}
    </button>
  );
}

export default function ScaleToggle() {
  const scaleMode = useSolarSystemStore((s) => s.scaleMode);
  const toggleScale = useSolarSystemStore((s) => s.toggleScale);

  const isTrueScale: boolean = scaleMode === ('true' as ScaleMode);

  return (
    <div className="fixed top-4 left-4 z-50 flex flex-col gap-2">
      {/* Toggle buttons */}
      <div className="glass-panel inline-flex items-center gap-1 p-1">
        <ToggleOption
          label="Navigable"
          icon={'\uD83D\uDD2D'}
          isActive={!isTrueScale}
          onClick={() => {
            if (isTrueScale) toggleScale();
          }}
        />
        <ToggleOption
          label="True Scale"
          icon={'\uD83C\uDF0C'}
          isActive={isTrueScale}
          onClick={() => {
            if (!isTrueScale) toggleScale();
          }}
        />
      </div>

      {/* Distance info overlay (true scale only) */}
      <AnimatePresence>
        {isTrueScale && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="glass-panel px-3 py-2 text-xs text-[var(--text-secondary)]"
          >
            <span className="font-mono">Scale: 1 AU</span>
            <span className="mx-1">=</span>
            <span className="font-mono">~150M km</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
