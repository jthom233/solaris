'use client';

import { Stars } from '@react-three/drei';

export default function StarField() {
  return (
    <Stars
      radius={300}
      depth={100}
      count={5000}
      factor={4}
      saturation={0}
      fade
      speed={1}
    />
  );
}
