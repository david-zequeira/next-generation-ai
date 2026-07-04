"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";
import { cn } from "@/lib/utils";

/** Orbiting particle halo around the core. */
function ParticleField({ count = 900 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 2.3 + Math.random() * 2.4;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, [count]);

  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.045;
    ref.current.rotation.x += delta * 0.012;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.022}
        color="#38d4ff"
        transparent
        opacity={0.65}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

/** The living core: a distorted metallic sphere with wireframe shell and orbit rings. */
function Core() {
  const group = useRef<THREE.Group>(null);
  const pointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame((_, delta) => {
    const g = group.current;
    if (!g) return;
    g.rotation.y += delta * 0.12;
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, -pointer.current.y * 0.3, 0.04);
    g.position.x = THREE.MathUtils.lerp(g.position.x, pointer.current.x * 0.45, 0.03);
    g.position.y = THREE.MathUtils.lerp(g.position.y, pointer.current.y * 0.25, 0.03);
  });

  return (
    <group ref={group}>
      <mesh>
        <icosahedronGeometry args={[1.05, 24]} />
        <MeshDistortMaterial
          color="#12369e"
          emissive="#0a2f96"
          emissiveIntensity={0.6}
          roughness={0.16}
          metalness={0.9}
          distort={0.38}
          speed={2}
        />
      </mesh>
      <mesh scale={1.45}>
        <icosahedronGeometry args={[1, 2]} />
        <meshBasicMaterial color="#2e6bff" wireframe transparent opacity={0.13} />
      </mesh>
      <mesh rotation={[Math.PI / 2.4, 0, 0]}>
        <torusGeometry args={[1.9, 0.006, 8, 160]} />
        <meshBasicMaterial color="#38d4ff" transparent opacity={0.35} />
      </mesh>
      <mesh rotation={[Math.PI / 1.8, 0.6, 0]}>
        <torusGeometry args={[2.25, 0.004, 8, 160]} />
        <meshBasicMaterial color="#7c5cff" transparent opacity={0.22} />
      </mesh>
    </group>
  );
}

type AICoreProps = {
  className?: string;
  particles?: number;
};

/**
 * The glowing 3D AI Core. Rendered on a transparent canvas so it floats
 * over any background. Pointer-transparent — mouse parallax is tracked
 * globally so content above stays clickable.
 */
export default function AICore({ className, particles = 900 }: AICoreProps) {
  return (
    <div className={cn("pointer-events-none absolute inset-0", className)} aria-hidden>
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        dpr={[1, 1.8]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <ambientLight intensity={0.35} />
        <pointLight position={[6, 4, 8]} intensity={90} color="#5f8dff" />
        <pointLight position={[-6, -3, 4]} intensity={40} color="#38d4ff" />
        <Float speed={1.4} rotationIntensity={0.25} floatIntensity={0.9}>
          <Core />
        </Float>
        <ParticleField count={particles} />
      </Canvas>
    </div>
  );
}
