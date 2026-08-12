'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

function RotatingTechMesh() {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.25;
      meshRef.current.rotation.x += delta * 0.15;
    }
  });

  return (
    <group ref={meshRef}>
      {/* Outer Wireframe Low-Poly Icosahedron (Tech Gear/Bulb aesthetic) */}
      <mesh scale={1.8}>
        <icosahedronGeometry args={[1, 1]} />
        <meshStandardMaterial
          color="#1d5796"
          wireframe
          transparent
          opacity={0.65}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>

      {/* Inner Distorted Core */}
      <mesh scale={1.0}>
        <sphereGeometry args={[1, 32, 32]} />
        <MeshDistortMaterial
          color="#c59b27"
          attach="material"
          distort={0.3}
          speed={1.5}
          roughness={0.3}
          metalness={0.6}
        />
      </mesh>
    </group>
  );
}

export default function Hero3DObject() {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  if (!isClient) {
    return <StaticFallback3D />;
  }

  if (reducedMotion) {
    return <StaticFallback3D />;
  }

  return (
    <div className="relative w-full h-[300px] sm:h-[360px] md:h-[420px] flex items-center justify-center">
      <Canvas
        camera={{ position: [0, 0, 4.5], fov: 50 }}
        style={{ background: 'transparent' }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[10, 10, 5]} intensity={1.2} color="#ffffff" />
        <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#c59b27" />
        <pointLight position={[0, 0, 2]} intensity={0.8} color="#1d5796" />
        <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.6}>
          <RotatingTechMesh />
        </Float>
      </Canvas>
    </div>
  );
}

function StaticFallback3D() {
  return (
    <div className="w-full h-[300px] sm:h-[360px] md:h-[420px] flex items-center justify-center">
      <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-full border-2 border-dashed border-college-gold/40 flex items-center justify-center animate-pulse">
        <div className="w-36 h-36 rounded-full bg-gradient-to-tr from-college-blue via-college-navy to-college-dark border border-college-gold shadow-lg flex items-center justify-center">
          <svg className="w-20 h-20 text-college-gold opacity-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
      </div>
    </div>
  );
}
