'use client';

export default function Lighting() {
  return (
    <>
      {/* Sun light at origin */}
      <pointLight position={[0, 0, 0]} intensity={2} color="#FDB813" />
      {/* Very dim ambient fill so the dark side isn't fully black */}
      <ambientLight intensity={0.02} />
    </>
  );
}
