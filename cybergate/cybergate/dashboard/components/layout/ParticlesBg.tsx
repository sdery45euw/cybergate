"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import * as THREE from "three";

function Points() {
  const ref = useRef<THREE.Points>(null);
  const count = 1200;
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i=0;i<count*3;i++) arr[i] = (Math.random() - 0.5) * 22;
    return arr;
  }, []);
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y += 0.0005;
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.15) * 0.1;
    }
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.025} color="#00f5ff" sizeAttenuation transparent opacity={0.72} />
    </points>
  );
}

export default function ParticlesBg() {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas camera={{ position: [0,0,6], fov: 75 }}>
        <Points />
      </Canvas>
      <div className="absolute inset-0 cyber-grid opacity-[0.35]" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#06080f]" />
    </div>
  )
}
