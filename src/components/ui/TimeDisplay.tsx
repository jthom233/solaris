'use client';

import { useState, useEffect } from 'react';

/**
 * Displays the current date and time in UTC.
 *
 * Shows "Orbital positions as of" label with a formatted date/time string
 * that updates every minute. Positioned in the top-right corner.
 */

function formatDateTime(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'UTC',
    timeZoneName: 'short',
  }).format(date);
}

export default function TimeDisplay() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    // Set initial time on client only to avoid hydration mismatch
    setNow(new Date());

    const interval = setInterval(() => {
      setNow(new Date());
    }, 60_000);

    return () => clearInterval(interval);
  }, []);

  // During SSR / before hydration, render an invisible placeholder
  // to avoid layout shifts while preventing hydration mismatches
  if (now === null) {
    return (
      <div
        className="fixed top-4 right-4 z-40 glass-panel px-3 py-2 opacity-0"
        aria-hidden="true"
      >
        <div className="text-xs">&nbsp;</div>
        <div className="text-sm font-mono">&nbsp;</div>
      </div>
    );
  }

  return (
    <div className="fixed top-4 right-4 z-40 glass-panel px-3 py-2 opacity-70 hover:opacity-100 transition-opacity duration-300">
      <div className="text-xs text-[var(--text-secondary)]/60 leading-tight">
        Orbital positions as of
      </div>
      <div className="text-sm font-mono text-[var(--text-secondary)] leading-tight mt-0.5">
        {formatDateTime(now)}
      </div>
    </div>
  );
}
