'use client';

import { useRef, useCallback } from 'react';
import { useSolarSystemStore } from '@/stores/solarSystemStore';
import { planets } from '@/data/planets';

/**
 * Bottom navigation bar for the solar system explorer.
 *
 * Displays the Sun (home) and all planets as navigable items.
 * Supports keyboard navigation with arrow keys.
 */

interface NavItemProps {
  id: string;
  name: string;
  accentColor: string;
  isActive: boolean;
  onClick: () => void;
  onKeyDown: (e: React.KeyboardEvent, index: number) => void;
  index: number;
  itemRef: (el: HTMLButtonElement | null) => void;
}

function NavItem({
  id,
  name,
  accentColor,
  isActive,
  onClick,
  onKeyDown,
  index,
  itemRef,
}: NavItemProps) {
  const isHome = id === 'sun';

  return (
    <button
      ref={itemRef}
      onClick={onClick}
      onKeyDown={(e) => onKeyDown(e, index)}
      className={`
        relative flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200
        focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30
        ${
          isActive
            ? 'bg-white/10 text-[var(--text-primary)]'
            : 'text-[var(--text-secondary)] hover:bg-white/5 hover:text-[var(--text-primary)]'
        }
      `}
      role="tab"
      aria-selected={isActive}
      tabIndex={isActive ? 0 : -1}
      aria-label={isHome ? 'Home (Sun)' : name}
    >
      {/* Colored dot or home icon */}
      {isHome ? (
        <span className="text-base" style={{ color: accentColor }}>
          {'\u2609'}
        </span>
      ) : (
        <span
          className="inline-block w-2 h-2 rounded-full flex-shrink-0"
          style={{ backgroundColor: accentColor }}
        />
      )}

      {/* Planet name — hidden on smaller screens for non-home items */}
      <span
        className={`text-sm font-body whitespace-nowrap ${
          isHome ? '' : 'hidden lg:inline'
        }`}
      >
        {isHome ? 'Home' : name}
      </span>

      {/* Active indicator underline */}
      {isActive && (
        <span
          className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-6 rounded-full"
          style={{ backgroundColor: accentColor }}
        />
      )}
    </button>
  );
}

export default function NavigationBar() {
  const selectedPlanet = useSolarSystemStore((s) => s.selectedPlanet);
  const selectPlanet = useSolarSystemStore((s) => s.selectPlanet);
  const goHome = useSolarSystemStore((s) => s.goHome);

  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const navItems = planets;

  const handleItemClick = useCallback(
    (id: string) => {
      if (id === 'sun') {
        goHome();
      } else {
        selectPlanet(id);
      }
    },
    [goHome, selectPlanet],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, index: number) => {
      let nextIndex: number | null = null;

      if (e.key === 'ArrowRight') {
        e.preventDefault();
        nextIndex = (index + 1) % navItems.length;
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        nextIndex = (index - 1 + navItems.length) % navItems.length;
      } else if (e.key === 'Home') {
        e.preventDefault();
        nextIndex = 0;
      } else if (e.key === 'End') {
        e.preventDefault();
        nextIndex = navItems.length - 1;
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const currentItem = navItems[index];
        if (currentItem) {
          handleItemClick(currentItem.id);
        }
        return;
      }

      if (nextIndex !== null) {
        const nextItem = itemRefs.current[nextIndex];
        const nextNavItem = navItems[nextIndex];
        if (nextItem && nextNavItem) {
          nextItem.focus();
          handleItemClick(nextNavItem.id);
        }
      }
    },
    [navItems, handleItemClick],
  );

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 glass-nav"
      role="navigation"
      aria-label="Solar system navigation"
    >
      <div
        className="flex items-center justify-center gap-1 px-4 py-2 overflow-x-auto custom-scrollbar"
        role="tablist"
        aria-label="Planets"
        style={{ minHeight: '56px' }}
      >
        {navItems.map((planet, index) => (
          <NavItem
            key={planet.id}
            id={planet.id}
            name={planet.name}
            accentColor={planet.accentColor}
            isActive={
              planet.id === 'sun'
                ? selectedPlanet === null
                : selectedPlanet === planet.id
            }
            onClick={() => handleItemClick(planet.id)}
            onKeyDown={handleKeyDown}
            index={index}
            itemRef={(el) => {
              itemRefs.current[index] = el;
            }}
          />
        ))}
      </div>
    </nav>
  );
}
