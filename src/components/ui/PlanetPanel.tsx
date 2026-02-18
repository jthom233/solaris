'use client';

import { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSolarSystemStore } from '@/stores/solarSystemStore';
import { planets } from '@/data/planets';
import type { PlanetData } from '@/types';

/**
 * Format a number in scientific notation as "X.XX x 10^N".
 * Returns JSX with the exponent rendered as a superscript.
 */
function formatScientific(value: number): React.ReactNode {
  if (value === 0) return '0';
  const exponent = Math.floor(Math.log10(Math.abs(value)));
  const mantissa = value / Math.pow(10, exponent);
  const superscriptDigits: Record<string, string> = {
    '0': '\u2070',
    '1': '\u00B9',
    '2': '\u00B2',
    '3': '\u00B3',
    '4': '\u2074',
    '5': '\u2075',
    '6': '\u2076',
    '7': '\u2077',
    '8': '\u2078',
    '9': '\u2079',
    '-': '\u207B',
  };
  const superExp = String(exponent)
    .split('')
    .map((ch) => superscriptDigits[ch] ?? ch)
    .join('');
  return `${mantissa.toFixed(2)} \u00D7 10${superExp}`;
}

/**
 * Format rotation period (in hours) into a human-friendly string.
 * Handles retrograde rotation (negative values).
 */
function formatRotation(hours: number): string {
  const absHours = Math.abs(hours);
  if (absHours < 48) {
    return `${absHours.toFixed(1)}h`;
  }
  const days = absHours / 24;
  return `${days.toFixed(1)}d`;
}

/**
 * Format orbital period (in Earth days) into a human-friendly string.
 */
function formatOrbitalPeriod(days: number): string {
  if (days === 0) return 'N/A';
  if (days < 365.25) {
    return `${days.toFixed(0)}d`;
  }
  const years = days / 365.25;
  return `${years.toFixed(1)}y`;
}

interface StatCardProps {
  label: string;
  value: React.ReactNode;
  unit: string;
  accentColor: string;
}

function StatCard({ label, value, unit, accentColor }: StatCardProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg bg-white/5 px-2 py-3">
      <span
        className="text-xs font-medium uppercase tracking-wider mb-1"
        style={{ color: accentColor }}
      >
        {label}
      </span>
      <span className="text-sm font-semibold text-[var(--text-primary)]">
        {value}
      </span>
      <span className="text-xs text-[var(--text-secondary)]">{unit}</span>
    </div>
  );
}

interface SectionHeaderProps {
  title: string;
  accentColor: string;
}

function SectionHeader({ title, accentColor }: SectionHeaderProps) {
  return (
    <div className="flex items-center gap-3 mt-6 mb-3">
      <div
        className="h-px flex-1"
        style={{ background: `linear-gradient(to right, ${accentColor}60, transparent)` }}
      />
      <span
        className="text-xs font-semibold uppercase tracking-widest"
        style={{ color: accentColor }}
      >
        {title}
      </span>
      <div
        className="h-px flex-1"
        style={{ background: `linear-gradient(to left, ${accentColor}60, transparent)` }}
      />
    </div>
  );
}

function PlanetPanelContent({ planet }: { planet: PlanetData }) {
  const selectPlanet = useSolarSystemStore((s) => s.selectPlanet);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-start justify-between p-5 pb-0">
        <div>
          <h2
            className="text-3xl font-bold font-display tracking-tight"
            style={{ color: planet.accentColor }}
          >
            {planet.name}
          </h2>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            {planet.classification === 'Star'
              ? 'Star'
              : `${planet.classification} Planet`}
          </p>
        </div>
        <button
          onClick={() => selectPlanet(null)}
          className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          aria-label="Close planet panel"
          tabIndex={0}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <line x1="3" y1="3" x2="13" y2="13" />
            <line x1="13" y1="3" x2="3" y2="13" />
          </svg>
        </button>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-5 pb-6">
        {/* Stats Grid — Row 1 */}
        <div className="grid grid-cols-3 gap-2 mt-5">
          <StatCard
            label="Mass"
            value={formatScientific(planet.mass)}
            unit="kg"
            accentColor={planet.accentColor}
          />
          <StatCard
            label="Radius"
            value={planet.radius.toLocaleString()}
            unit="km"
            accentColor={planet.accentColor}
          />
          <StatCard
            label="Gravity"
            value={planet.gravity.toFixed(2)}
            unit="m/s\u00B2"
            accentColor={planet.accentColor}
          />
        </div>

        {/* Stats Grid — Row 2 */}
        <div className="grid grid-cols-3 gap-2 mt-2">
          <StatCard
            label="Temp"
            value={`${planet.temperature.mean}\u00B0C`}
            unit="mean"
            accentColor={planet.accentColor}
          />
          <StatCard
            label="Day"
            value={formatRotation(planet.rotationPeriod)}
            unit={planet.rotationPeriod < 0 ? 'retrograde' : ''}
            accentColor={planet.accentColor}
          />
          <StatCard
            label="Year"
            value={formatOrbitalPeriod(planet.orbitalPeriod)}
            unit=""
            accentColor={planet.accentColor}
          />
        </div>

        {/* Distance & Moons */}
        <div className="mt-4 space-y-1.5">
          {planet.distanceFromSun.mean > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-[var(--text-secondary)]">
                Distance from Sun
              </span>
              <span className="text-[var(--text-primary)] font-mono">
                {planet.distanceFromSun.mean.toLocaleString()} M km
              </span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span className="text-[var(--text-secondary)]">Moons</span>
            <span className="text-[var(--text-primary)] font-mono">
              {planet.moons}
            </span>
          </div>
        </div>

        {/* About */}
        <SectionHeader title="About" accentColor={planet.accentColor} />
        <div className="space-y-3">
          {planet.description.split('\n\n').map((paragraph, i) => (
            <p
              key={i}
              className="text-sm leading-relaxed text-[var(--text-secondary)]"
            >
              {paragraph}
            </p>
          ))}
        </div>

        {/* Atmosphere */}
        {planet.atmosphere.length > 0 && (
          <>
            <SectionHeader
              title="Atmosphere"
              accentColor={planet.accentColor}
            />
            <ul className="space-y-1.5">
              {planet.atmosphere.map((gas, i) => (
                <li
                  key={i}
                  className="flex items-center gap-2 text-sm text-[var(--text-secondary)]"
                >
                  <span
                    className="inline-block w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: planet.accentColor }}
                  />
                  {gas}
                </li>
              ))}
            </ul>
          </>
        )}

        {/* Fun Facts */}
        {planet.funFacts.length > 0 && (
          <>
            <SectionHeader
              title="Fun Facts"
              accentColor={planet.accentColor}
            />
            <ul className="space-y-3">
              {planet.funFacts.map((fact, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2.5 text-sm text-[var(--text-secondary)] leading-relaxed"
                >
                  <span className="flex-shrink-0 mt-0.5 text-base" role="img" aria-label="Fun fact">
                    {'\u{1F4A1}'}
                  </span>
                  {fact}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}

export default function PlanetPanel() {
  const selectedPlanet = useSolarSystemStore((s) => s.selectedPlanet);
  const isPanelOpen = useSolarSystemStore((s) => s.isPanelOpen);
  const selectPlanet = useSolarSystemStore((s) => s.selectPlanet);

  const planet = selectedPlanet
    ? planets.find((p) => p.id === selectedPlanet) ?? null
    : null;

  const isVisible = planet !== null && isPanelOpen;

  // Escape key handler
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isVisible) {
        selectPlanet(null);
      }
    },
    [isVisible, selectPlanet],
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <AnimatePresence mode="wait">
      {isVisible && planet && (
        <motion.aside
          key={planet.id}
          initial={{ x: 420, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 420, opacity: 0 }}
          transition={{
            type: 'tween',
            duration: 0.3,
          }}
          className="fixed top-0 right-0 h-screen w-full sm:w-[420px] z-50 glass-panel rounded-none sm:rounded-l-2xl overflow-hidden"
          role="dialog"
          aria-label={`${planet.name} information panel`}
        >
          <PlanetPanelContent planet={planet} />
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
