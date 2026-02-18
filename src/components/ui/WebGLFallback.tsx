'use client';

import { useState, useEffect, type ReactNode } from 'react';

interface WebGLFallbackProps {
  children: ReactNode;
}

/**
 * Check if the current browser supports WebGL2 (required by Three.js / R3F).
 * Falls back gracefully if running on the server (SSR).
 */
function checkWebGL2Support(): boolean {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    // During SSR, assume support — the real check happens on the client.
    return true;
  }

  try {
    const canvas = document.createElement('canvas');
    const gl =
      canvas.getContext('webgl2') ||
      canvas.getContext('webgl') ||
      canvas.getContext('experimental-webgl');
    return gl !== null;
  } catch {
    return false;
  }
}

/**
 * Wraps its children with a WebGL2 capability check.
 * If WebGL is not available, renders a user-friendly fallback message.
 */
export default function WebGLFallback({ children }: WebGLFallbackProps) {
  const [isSupported, setIsSupported] = useState<boolean | null>(null);

  useEffect(() => {
    setIsSupported(checkWebGL2Support());
  }, []);

  // During the initial client render / SSR, show nothing (Canvas is ssr: false anyway)
  if (isSupported === null) {
    return null;
  }

  if (!isSupported) {
    return (
      <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-[var(--bg-space)] px-8 text-center">
        <div className="max-w-md space-y-6">
          {/* Icon */}
          <div
            className="mx-auto flex h-20 w-20 items-center justify-center rounded-full"
            style={{
              background:
                'radial-gradient(circle, rgba(124,58,237,0.2) 0%, transparent 70%)',
            }}
          >
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--accent-primary)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>

          {/* Title */}
          <h1
            className="text-3xl font-display font-bold text-[var(--text-primary)]"
            style={{
              textShadow: '0 0 30px rgba(124, 58, 237, 0.4)',
            }}
          >
            WebGL Required
          </h1>

          {/* Description */}
          <p className="text-base leading-relaxed text-[var(--text-secondary)]">
            SOLARIS requires WebGL to render the interactive 3D solar system.
            Your browser or device does not appear to support WebGL.
          </p>

          {/* Suggestions */}
          <div className="glass-panel px-5 py-4 text-left text-sm text-[var(--text-secondary)] space-y-2">
            <p className="font-semibold text-[var(--text-primary)]">
              Try the following:
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>Update your browser to the latest version</li>
              <li>Enable hardware acceleration in your browser settings</li>
              <li>Try a different browser (Chrome, Firefox, or Edge)</li>
              <li>Update your graphics drivers</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
