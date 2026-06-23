"use client";

import { Decal, useTexture } from "@react-three/drei";
import { useMemo, useEffect, useRef } from "react";
import * as THREE from "three";
import { useCustomizationStore } from "@/lib/store/customizationStore";

type DecalLayerProps = {
    id: string;
    textureUrl: string;
    position: [number, number, number];
    rotation: [number, number, number];
    scale: [number, number, number];
    mesh: THREE.Mesh;
    garmentMaxDim: number;
    garmentCenter: THREE.Vector3;
    garmentScene: THREE.Object3D;
};

export default function DecalLayer({ id, textureUrl, position, rotation, scale, mesh, garmentMaxDim, garmentCenter, garmentScene }: DecalLayerProps) {
    const texture = useTexture(textureUrl);

    useEffect(() => {
        if (texture) {
            texture.anisotropy = 16;
            texture.needsUpdate = true;
            texture.colorSpace = THREE.SRGBColorSpace;
        }
    }, [texture]);

    const { activeDecal, draggingDecal, setActiveDecal, setDraggingDecal } = useCustomizationStore();
    const isActive = activeDecal === id;
    const isDragging = draggingDecal === id;

    const meshRef = useRef<THREE.Mesh>(mesh);

    useEffect(() => {
        if (mesh) meshRef.current = mesh;
    }, [mesh]);

    if (!mesh || !garmentScene) return null;

    // 1. Transform Position from Scene Local to Mesh Local
    const localPosition = useMemo<[number, number, number]>(() => {
        const p = new THREE.Vector3(position[0], position[1], position[2]);
        const worldP = garmentScene.localToWorld(p);
        const localP = mesh.worldToLocal(worldP);
        return [localP.x, localP.y, localP.z];
    }, [position, mesh, garmentScene]);

    // 2. Transform Scale to account for Mesh internal scaling
    const localScale = useMemo<[number, number, number]>(() => {
        const sceneScale = garmentScene.getWorldScale(new THREE.Vector3());
        const mScale = mesh.getWorldScale(new THREE.Vector3());

        const targetSceneSizeX = scale[0] * garmentMaxDim;
        const targetSceneSizeY = scale[1] * garmentMaxDim;
        // Depth needs to be deep enough to pierce through chest folds, but shallow enough
        // to not punch through to the inner back lining. 10% of garment width is a safe bet.
        const targetSceneSizeZ = Math.max(garmentMaxDim * 0.1, 0.1);

        return [
            (targetSceneSizeX * sceneScale.x) / mScale.x,
            (targetSceneSizeY * sceneScale.y) / mScale.y,
            (targetSceneSizeZ * sceneScale.z) / mScale.z
        ];
    }, [scale, garmentMaxDim, mesh, garmentScene]);

    // 3. Transform Rotation to account for Mesh internal rotation
    const localRotation = useMemo<[number, number, number]>(() => {
        const sceneQuat = garmentScene.getWorldQuaternion(new THREE.Quaternion());
        const userEuler = new THREE.Euler(rotation[0], rotation[1], 0);
        const userQuat = new THREE.Quaternion().setFromEuler(userEuler);

        const targetWorldQuat = sceneQuat.multiply(userQuat);

        const meshQuat = mesh.getWorldQuaternion(new THREE.Quaternion());
        const meshInvQuat = meshQuat.invert();

        const localQuat = meshInvQuat.multiply(targetWorldQuat);
        const finalEuler = new THREE.Euler().setFromQuaternion(localQuat);

        return [finalEuler.x, finalEuler.y, finalEuler.z];
    }, [rotation, garmentScene, mesh]);

    const { updateDecal } = useCustomizationStore();

    // Handle initialization projection. If position is exactly [0,0,0.5] (the default from store),
    // we need to move it to the physical center of THIS specific garment's bounds
    useEffect(() => {
        // [0, 0, 0.5] was the hardcoded store default.
        if (position[0] === 0 && position[1] === 0 && position[2] === 0.5) {
            // Project onto the upper-middle front of the bounding box relative to its natural origin
            const targetX = garmentCenter.x;
            const targetZ = garmentCenter.z + garmentMaxDim * 0.4; // Push forward to guarantee hitting front-face
            const targetY = garmentCenter.y + garmentMaxDim * 0.1; // slightly high on chest

            updateDecal(id, { position: [targetX, targetY, targetZ] });
        }
    }, [id, position, garmentMaxDim, garmentCenter, updateDecal]);

    return (
        <group>
            <Decal
                //@ts-ignore
                mesh={meshRef}
                position={localPosition}
                rotation={localRotation}
                scale={localScale}
                onPointerDown={(e) => {
                    e.stopPropagation();
                    setActiveDecal(id);
                    setDraggingDecal(id);
                }}
                onPointerOver={(e) => {
                    e.stopPropagation();
                    document.body.style.cursor = "grab";
                }}
                onPointerOut={(e) => {
                    document.body.style.cursor = "auto";
                }}
            >
                <meshStandardMaterial
                    map={texture}
                    transparent
                    polygonOffset
                    polygonOffsetFactor={-10}
                    roughness={0.8}
                    metalness={0.1}
                    depthTest={true}
                    depthWrite={false}
                    side={THREE.DoubleSide}
                />
            </Decal>

            {isActive && !isDragging && (
                <mesh position={localPosition} rotation={localRotation} scale={[localScale[0] * 1.05, localScale[1] * 1.05, 0.01]}>
                    <planeGeometry />
                    <meshBasicMaterial color="#ccff00" transparent opacity={0.15} depthTest={false} />
                </mesh>
            )}
        </group>
    );
}
