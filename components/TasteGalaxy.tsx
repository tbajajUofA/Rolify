"use client";

import { OrbitControls, Stars } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useMemo } from "react";
import type { VisualTrack } from "@/lib/types";

function TrackPoints({ tracks }: { tracks: VisualTrack[] }) {
  const points = useMemo(
    () =>
      tracks.map((track, index) => ({
        track,
        position: [
          (track.features.energy - 50) / 9,
          (track.features.valence - 50) / 9,
          (track.features.danceability - 50) / 9 + Math.sin(index) * 0.35
        ] as [number, number, number]
      })),
    [tracks]
  );

  return (
    <>
      {points.map(({ track, position }) => (
        <mesh key={track.id} position={position}>
          <sphereGeometry args={[0.09 + track.popularity / 1200, 24, 24]} />
          <meshStandardMaterial
            color={track.clusterColor}
            emissive={track.clusterColor}
            emissiveIntensity={1.7}
            roughness={0.22}
          />
        </mesh>
      ))}
    </>
  );
}

export function TasteGalaxy({ tracks }: { tracks: VisualTrack[] }) {
  return (
    <section className="relative h-screen overflow-hidden bg-black">
      <div className="absolute left-5 top-24 z-10 max-w-xl sm:left-10">
        <p className="eyebrow">01 / taste galaxy</p>
        <h2 className="mt-4 text-5xl font-black leading-none tracking-normal text-white sm:text-7xl">
          map your sound in 3D
        </h2>
        <p className="mt-5 text-lg leading-8 text-white/68">
          Every point is a top track positioned by synthetic energy, valence, and danceability.
        </p>
      </div>
      <Canvas camera={{ position: [0, 0, 9], fov: 62 }} className="absolute inset-0">
        <color attach="background" args={["#000000"]} />
        <ambientLight intensity={0.24} />
        <pointLight position={[3, 4, 6]} intensity={25} color="#1ED760" />
        <pointLight position={[-4, -2, 4]} intensity={18} color="#00E5FF" />
        <Stars radius={90} depth={45} count={2200} factor={4} saturation={0.8} fade speed={0.8} />
        <TrackPoints tracks={tracks} />
        <OrbitControls enablePan={false} autoRotate autoRotateSpeed={0.7} />
      </Canvas>
    </section>
  );
}
