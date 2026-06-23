"use client";

import { useRef, useMemo, useEffect, Suspense, useState } from "react";
import * as THREE from "three";
import { useGLTF } from "@react-three/drei";
import { createPortal } from "@react-three/fiber";

import { useCustomizationStore } from "@/lib/store/customizationStore";
import * as BufferGeometryUtils from "three/examples/jsm/utils/BufferGeometryUtils.js";
import DecalLayer from "./DecalLayer";

export default function ShirtModel() {
    const groupRef = useRef<THREE.Group>(null);
    const { shirtColor, decals, currentModelPath, setActiveDecal, draggingDecal, setDraggingDecal, updateDecal } = useCustomizationStore();

    // Default to Regular tshirt if null (for initial load)
    const modelUrl = currentModelPath || "/Regular tshirt.glb";

    const { nodes, materials, scene } = useGLTF(modelUrl) as any;

    useEffect(() => {
        if (nodes) {
            console.log(`Nodes for ${modelUrl}:`, Object.keys(nodes));
        }
        if (materials) {
            console.log(`Materials for ${modelUrl}:`, Object.keys(materials));
        }
    }, [nodes, materials, modelUrl]);

    // Apply realistic fabric material properties and handle color updates
    useEffect(() => {
        if (!scene) return;

        scene.traverse((child: any) => {
            if (child.isMesh) {
                // 1. CLEAR VERTEX COLORS: This is critical for models with baked-in colors like the Hoodie
                // We use the safe 'deleteAttribute' method to avoid interleaved buffer errors
                if (child.geometry.attributes.color) {
                    child.geometry.deleteAttribute('color');
                }

                // Handle both single and multi-material meshes
                const meshMaterials = Array.isArray(child.material) ? child.material : [child.material];

                meshMaterials.forEach((m: any, index: number) => {
                    // Check if we need to convert to PhysicalMaterial or just update existing
                    // We check for type 'MeshPhysicalMaterial' or if we've already tagged it
                    if (m.type !== 'MeshPhysicalMaterial' || !m.isCustomized) {
                        const newMaterial = new THREE.MeshPhysicalMaterial({
                            color: new THREE.Color(shirtColor),
                            roughness: 0.85,
                            metalness: 0,
                            sheen: 0.4,
                            sheenRoughness: 1,
                            sheenColor: new THREE.Color(0xffffff),
                            envMapIntensity: 1.2, // Slightly higher for better studio feel
                            // We keep textures that add detail but might remove diffuse maps if they block color
                            // If the model looks flat with the new color, we might need to investigate the 'map'
                            map: m.map, // Purely Native GLB Mapping
                            normalMap: m.normalMap,
                            roughnessMap: m.roughnessMap,
                            aoMap: m.aoMap,
                            transparent: m.transparent,
                            opacity: m.opacity,
                            //@ts-ignore
                            vertexColors: false,
                        });

                        // Tag it so we don't keep recreating it every frame, only update color
                        (newMaterial as any).isCustomized = true;

                        if (Array.isArray(child.material)) {
                            child.material[index] = newMaterial;
                        } else {
                            child.material = newMaterial;
                        }
                    } else {
                        // Material is already our physical material, just update the color
                        m.color.set(shirtColor);
                        m.vertexColors = false;
                    }

                    // Force update for the material
                    const currentMat = Array.isArray(child.material) ? child.material[index] : child.material;
                    if (currentMat) {
                        currentMat.needsUpdate = true;
                    }
                });

                child.castShadow = true;
                child.receiveShadow = true;
            }
        });
    }, [scene, shirtColor]);

    if (!scene) return null;

    // Find all primary meshes to attach the decal to (to support multi-mesh garments)
    const { targetMeshes, garmentMaxDim, garmentCenter } = useMemo(() => {
        const meshes: THREE.Mesh[] = [];
        let box = new THREE.Box3();

        // Force a matrix update to ensure world matrices are populated
        scene.updateMatrixWorld(true);

        scene.traverse((child: any) => {
            if (child.isMesh) {
                const vertexCount = child.geometry.attributes.position?.count || 0;

                // Grab any substantial mesh to act as a decal receiver
                // This prevents issues with garments modeled out of many unnamed patterns
                if (vertexCount > 300) {
                    meshes.push(child);
                    // Expand bounding box to include this mesh
                    child.geometry.computeBoundingBox();
                    if (child.geometry.boundingBox) {
                        const childBox = child.geometry.boundingBox.clone();
                        childBox.applyMatrix4(child.matrixWorld);
                        box.union(childBox);
                    }
                }
            }
        });

        // If no specifically named meshes found, grab the largest meshes
        if (meshes.length === 0) {
            let maxVertices = 0;
            let bestChild = null;
            scene.traverse((child: any) => {
                if (child.isMesh) {
                    const vertexCount = child.geometry.attributes.position?.count || 0;
                    if (vertexCount > maxVertices) {
                        maxVertices = vertexCount;
                        bestChild = child;
                    }
                }
            });
            if (bestChild) {
                meshes.push(bestChild);
                (bestChild as THREE.Mesh).geometry.computeBoundingBox();
                if ((bestChild as THREE.Mesh).geometry.boundingBox) {
                    const childBox = (bestChild as THREE.Mesh).geometry.boundingBox!.clone();
                    childBox.applyMatrix4((bestChild as THREE.Mesh).matrixWorld);
                    box.union(childBox);
                }
            }
        }

        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);

        return { targetMeshes: meshes, garmentMaxDim: maxDim || 1, garmentCenter: center };
    }, [scene]);

    const [sceneScale, setSceneScale] = useState(1);
    const [sceneCenter, setSceneCenter] = useState<[number, number, number]>([0, 0, 0]);

    // Center and Normalize the model safely
    useEffect(() => {
        if (!scene) return;

        // Temporarily reset scene transforms to get pure bounding box
        scene.position.set(0, 0, 0);
        scene.scale.set(1, 1, 1);
        scene.updateMatrixWorld(true);

        const box = new THREE.Box3().setFromObject(scene);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        const maxDim = Math.max(size.x, size.y, size.z);
        if (maxDim > 0) {
            setSceneScale(2.0 / maxDim);
            setSceneCenter([-center.x, -center.y, -center.z]);
        }
    }, [scene, modelUrl]);

    // Global pointer move handler for dragging decals
    const handlePointerMove = (e: any) => {
        if (draggingDecal && targetMeshes.length > 0 && groupRef.current) {
            e.stopPropagation();

            const hits = e.intersections.filter((i: any) => targetMeshes.includes(i.object));
            const hit = hits.length > 0 ? hits[0] : e.intersections[0];

            if (hit && targetMeshes.includes(hit.object)) {
                const point = hit.point;
                // Important: Convert world point to our normalized stable container group space!
                // This ensures size/position is identical across all possible GLTF assets.
                const localPoint = groupRef.current.worldToLocal(point.clone());
                // Shift to account for the sceneCenter offset so it sticks exactly to mouse
                localPoint.sub(new THREE.Vector3(...sceneCenter));

                updateDecal(draggingDecal, {
                    position: [localPoint.x, localPoint.y, localPoint.z]
                });
            }
        }
    };

    const handlePointerUp = () => {
        if (draggingDecal) {
            setDraggingDecal(null);
        }
    };

    return (
        <group ref={groupRef} dispose={null} scale={sceneScale}>
            <group position={sceneCenter}>
                <primitive
                    object={scene}
                    onPointerMissed={() => {
                        setActiveDecal(null);
                        setDraggingDecal(null);
                    }}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    onPointerLeave={handlePointerUp}
                />
                {targetMeshes.length > 0 && targetMeshes.map((mesh, mIndex) => (
                    <Suspense fallback={null} key={`portal-${mesh.uuid || mIndex}`}>
                        {createPortal(
                            <group>
                                {decals.map((decal) => (
                                    <DecalLayer
                                        key={`${mesh.uuid}-${decal.id}`}
                                        id={decal.id}
                                        textureUrl={decal.texture}
                                        position={decal.position}
                                        rotation={decal.rotation}
                                        scale={decal.scale}
                                        mesh={mesh}
                                        garmentMaxDim={garmentMaxDim}
                                        garmentCenter={garmentCenter}
                                        garmentScene={scene}
                                    />
                                ))}
                            </group>,
                            mesh
                        )}
                    </Suspense>
                ))}
            </group>
        </group>
    );
}

// Preload all models
[
    "/Female tshirt.glb",
    "/Hoodie.glb",
    "/Oversized tshirt.glb",
    "/Polo tshirt.glb",
    "/Regular tshirt.glb"
].forEach(url => useGLTF.preload(url));
