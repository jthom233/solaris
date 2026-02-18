'use client';

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSolarSystemStore } from '@/stores/solarSystemStore';

/** Duration (ms) before the intro auto-dismisses */
const INTRO_DURATION_MS = 3000;

export default function IntroOverlay() {
  const isIntroComplete = useSolarSystemStore((s) => s.isIntroComplete);
  const completeIntro = useSolarSystemStore((s) => s.completeIntro);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!isIntroComplete) {
      timerRef.current = setTimeout(() => {
        completeIntro();
      }, INTRO_DURATION_MS);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isIntroComplete, completeIntro]);

  return (
    <AnimatePresence>
      {!isIntroComplete && (
        <motion.div
          key="intro-overlay"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: 'easeInOut' }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(3,0,20,0.85) 0%, rgba(3,0,20,0.95) 60%, rgba(3,0,20,1) 100%)',
          }}
          aria-live="polite"
          role="status"
        >
          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="text-6xl md:text-8xl font-display font-bold tracking-wider text-[var(--text-primary)] select-none"
            style={{
              textShadow:
                '0 0 40px rgba(124, 58, 237, 0.6), 0 0 80px rgba(124, 58, 237, 0.3), 0 0 120px rgba(124, 58, 237, 0.15)',
            }}
          >
            SOLARIS
          </motion.h1>

          {/* Tagline — fades in 0.5s after the title */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.5 }}
            className="mt-4 text-lg text-[var(--text-secondary)] font-body tracking-wide select-none"
          >
            Explore Our Solar System
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
