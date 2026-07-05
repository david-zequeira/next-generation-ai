"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";
import type { MotionValue } from "framer-motion";
import { cn } from "@/lib/utils";

type DistortMat = React.ComponentRef<typeof MeshDistortMaterial>;

/**
 * Halo de partículas orbitando el núcleo. Con `dissolve` > 0 las partículas
 * se expanden y toman el protagonismo: son la materia en la que el núcleo
 * se convierte.
 */
function ParticleField({
  count = 900,
  dissolve,
}: {
  count?: number;
  dissolve?: MotionValue<number>;
}) {
  const ref = useRef<THREE.Points>(null);
  const mat = useRef<THREE.PointsMaterial>(null);

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
    const d = dissolve?.get() ?? 0;
    ref.current.rotation.y += delta * 0.045 * (1 + d * 2.5);
    ref.current.rotation.x += delta * 0.012;
    ref.current.scale.setScalar(1 + d * 1.9);
    if (mat.current) {
      mat.current.opacity = 0.65 + d * 0.25;
      mat.current.size = 0.022 + d * 0.02;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        ref={mat}
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

/**
 * El núcleo vivo: esfera metálica distorsionada, caparazón de alambre y
 * anillos orbitales. Con `dissolve` (0→1 con el scroll) el núcleo se
 * desestabiliza, brilla, pierde masa y se disuelve en sus partículas —
 * el momento-objeto de la marca.
 */
function Core({ dissolve }: { dissolve?: MotionValue<number> }) {
  const group = useRef<THREE.Group>(null);
  const coreMesh = useRef<THREE.Mesh>(null);
  const coreMat = useRef<DistortMat>(null);
  const wireMesh = useRef<THREE.Mesh>(null);
  const wireMat = useRef<THREE.MeshBasicMaterial>(null);
  const ringMatA = useRef<THREE.MeshBasicMaterial>(null);
  const ringMatB = useRef<THREE.MeshBasicMaterial>(null);
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
    const d = dissolve?.get() ?? 0;

    g.rotation.y += delta * 0.12 * (1 + d * 1.5);
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, -pointer.current.y * 0.3, 0.04);
    g.position.x = THREE.MathUtils.lerp(g.position.x, pointer.current.x * 0.45, 0.03);
    g.position.y = THREE.MathUtils.lerp(g.position.y, pointer.current.y * 0.25, 0.03);

    // Disolución: el núcleo encoge y se apaga; el caparazón se expande
    if (coreMesh.current) coreMesh.current.scale.setScalar(Math.max(0.001, 1 - d * 0.6));
    if (coreMat.current) {
      coreMat.current.distort = 0.38 + d * 0.55;
      coreMat.current.emissiveIntensity = 0.6 + d * 1.1;
      coreMat.current.opacity = Math.max(0, 1 - d * 1.15);
    }
    if (wireMesh.current) wireMesh.current.scale.setScalar(1.45 + d * 1.1);
    if (wireMat.current) wireMat.current.opacity = 0.13 * Math.max(0, 1 - d * 0.9);
    if (ringMatA.current) ringMatA.current.opacity = 0.35 * Math.max(0, 1 - d);
    if (ringMatB.current) ringMatB.current.opacity = 0.22 * Math.max(0, 1 - d);
  });

  return (
    <group ref={group}>
      <mesh ref={coreMesh}>
        <icosahedronGeometry args={[1.05, 24]} />
        <MeshDistortMaterial
          ref={coreMat}
          color="#12369e"
          emissive="#0a2f96"
          emissiveIntensity={0.6}
          roughness={0.16}
          metalness={0.9}
          distort={0.38}
          speed={2}
          transparent
        />
      </mesh>
      <mesh ref={wireMesh} scale={1.45}>
        <icosahedronGeometry args={[1, 2]} />
        <meshBasicMaterial
          ref={wireMat}
          color="#2e6bff"
          wireframe
          transparent
          opacity={0.13}
        />
      </mesh>
      <mesh rotation={[Math.PI / 2.4, 0, 0]}>
        <torusGeometry args={[1.9, 0.006, 8, 160]} />
        <meshBasicMaterial ref={ringMatA} color="#38d4ff" transparent opacity={0.35} />
      </mesh>
      <mesh rotation={[Math.PI / 1.8, 0.6, 0]}>
        <torusGeometry args={[2.25, 0.004, 8, 160]} />
        <meshBasicMaterial ref={ringMatB} color="#7c5cff" transparent opacity={0.22} />
      </mesh>
    </group>
  );
}

type AICoreProps = {
  className?: string;
  particles?: number;
  /** 0→1: disuelve el núcleo en partículas (se conecta al scroll del hero) */
  dissolve?: MotionValue<number>;
};

/**
 * The glowing 3D AI Core. Rendered on a transparent canvas so it floats
 * over any background. Pointer-transparent — mouse parallax is tracked
 * globally so content above stays clickable.
 */
export default function AICore({ className, particles = 900, dissolve }: AICoreProps) {
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
          <Core dissolve={dissolve} />
        </Float>
        <ParticleField count={particles} dissolve={dissolve} />
      </Canvas>
    </div>
  );
}
