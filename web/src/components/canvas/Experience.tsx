"use client";

import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { Environment, OrbitControls, Center, ContactShadows, Backdrop } from "@react-three/drei";
import { ArrowRight } from "lucide-react";
import { Suspense } from "react";
import ShirtModel from "./ShirtModel";
import { useCustomizationStore } from "@/lib/store/customizationStore";

export default function Experience() {
    const { draggingDecal } = useCustomizationStore();

    return (
        <div className="w-full h-full relative z-0 bg-transparent">
            {/* Top Navigation Overlay */}
            <div className="absolute top-24 left-8 z-50 pointer-events-auto">
                <button
                    onClick={() => window.location.href = '/customize'}
                    className="flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 px-6 py-3 rounded-full text-white text-[10px] font-black uppercase tracking-[0.3em] hover:bg-white/20 transition-all active:scale-95 group"
                >
                    <ArrowRight className="rotate-180 w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Change Canvas
                </button>
            </div>

            <Canvas
                shadows
                camera={{ position: [0, 0, 5.0], fov: 30 }}
                gl={{ preserveDrawingBuffer: true, antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.2 }}
                className="w-full h-full"
            >
                <ambientLight intensity={0.7} />
                <spotLight position={[10, 10, 10]} angle={0.2} penumbra={1} intensity={0.8} castShadow />

                {/* Premium Studio Lights */}
                <directionalLight position={[-5, 5, 5]} intensity={1.5} color="#ffffff" />
                <directionalLight position={[5, 5, 5]} intensity={1.5} color="#ffffff" />
                <directionalLight position={[0, -5, -5]} intensity={0.5} color="#ffffff" />

                <Suspense fallback={null}>
                    <Environment preset="city" blur={0.8} />

                    <group position={[0, 0, 0]}>
                        <group position={[0, 0, 0]}>
                            <ShirtModel />

                            <ContactShadows
                                position={[0, -2.5, 0]}
                                opacity={0.5}
                                scale={12}
                                blur={2.0}
                                far={0.8}
                            />
                        </group>
                    </group>
                </Suspense>

                <OrbitControls
                    makeDefault
                    enabled={!draggingDecal} // Lock camera movement during active drag operations
                    minPolarAngle={Math.PI / 4}
                    maxPolarAngle={Math.PI / 1.5}
                    enablePan={false}
                    minDistance={3}
                    maxDistance={8}
                />
            </Canvas>

            {/* Instruction Footer */}
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 pointer-events-none">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 px-8 py-4 rounded-full text-white text-[10px] uppercase font-black tracking-[0.4em] shadow-2xl flex items-center gap-6">
                    <span className="opacity-60">Drag to Rotate</span>
                    <div className="w-1 h-1 bg-accent rounded-full" />
                    <span className="text-accent animate-pulse">Click Design to Move</span>
                    <div className="w-1 h-1 bg-accent rounded-full" />
                    <span className="opacity-60">Scroll to Zoom</span>
                </div>
            </div>
        </div>
    );
}
