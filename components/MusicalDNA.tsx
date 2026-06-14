"use client";

import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useMemo } from "react";
import type { GenreCount } from "@/lib/types";
import { SectionReveal } from "@/components/SectionReveal";

const COLORS = ["#1ED760", "#00E5FF", "#7F77DD", "#D4537E", "#FAC775"];

function Helix({ genres }: { genres: GenreCount[] }) {
  const rungs = useMemo(
    () =>
      genres.map((genre, index) => {
        const y = (index - genres.length / 2) * 0.36;
        const angle = index * 0.72;
        const left = [Math.cos(angle) * 1.4, y, Math.sin(angle) * 1.4] as [number, number, number];
        const right = [Math.cos(angle + Math.PI) * 1.4, y, Math.sin(angle + Math.PI) * 1.4] as [
          number,
          number,
          number
        ];

        return { genre, left, right, color: COLORS[index % COLORS.length] };
      }),
    [genres]
  );

  return (
    <group rotation={[0.3, 0, 0]}>
      {rungs.map((rung) => (
        <group key={rung.genre.genre}>
          <mesh position={rung.left}>
            <sphereGeometry args={[0.11 + rung.genre.percentage / 300, 24, 24]} />
            <meshStandardMaterial color={rung.color} emissive={rung.color} emissiveIntensity={1.5} />
          </mesh>
          <mesh position={rung.right}>
            <sphereGeometry args={[0.11 + rung.genre.percentage / 300, 24, 24]} />
            <meshStandardMaterial color={rung.color} emissive={rung.color} emissiveIntensity={1.5} />
          </mesh>
          <mesh position={[0, rung.left[1], 0]}>
            <boxGeometry args={[2.8, 0.025, 0.025]} />
            <meshStandardMaterial color={rung.color} emissive={rung.color} emissiveIntensity={1.1} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

export function MusicalDNA({ genres }: { genres: GenreCount[] }) {
  return (
    <SectionReveal
      eyebrow="06 / musical dna"
      title="genre code spiraling upward"
      description="Each rung is a top genre, color-coded into a slow rotating double helix."
    >
      <div className="panel h-[620px] overflow-hidden">
        <Canvas camera={{ position: [0, 0, 6], fov: 55 }}>
          <color attach="background" args={["#000000"]} />
          <ambientLight intensity={0.35} />
          <pointLight position={[2, 3, 4]} intensity={18} color="#1ED760" />
          <pointLight position={[-3, -2, 3]} intensity={14} color="#D4537E" />
          <Helix genres={genres} />
          <OrbitControls enablePan={false} autoRotate autoRotateSpeed={1.2} />
        </Canvas>
      </div>
    </SectionReveal>
  );
}
