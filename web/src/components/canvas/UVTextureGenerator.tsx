import { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { useCustomizationStore } from '@/lib/store/customizationStore';

export function useUVTexture() {
    const { shirtColor, decals } = useCustomizationStore();

    // Create canvas and texture once
    const { canvas, ctx, texture } = useMemo(() => {
        const canvas = document.createElement('canvas');
        canvas.width = 2048; // High res for crisp decals
        canvas.height = 2048;
        const ctx = canvas.getContext('2d');
        const texture = new THREE.CanvasTexture(canvas);
        texture.anisotropy = 16;
        texture.colorSpace = THREE.SRGBColorSpace;
        // glTF models usually require flipY = false
        texture.flipY = false;
        return { canvas, ctx, texture };
    }, []);

    useEffect(() => {
        if (!ctx) return;

        // 1. Fill background with shirt color
        ctx.fillStyle = shirtColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // 2. Draw decals sequentially
        const drawDecals = async () => {
            for (const decal of decals) {
                if (decal.texture) {
                    const img = new Image();
                    img.crossOrigin = 'anonymous';

                    // Wait for image to load
                    await new Promise((resolve, reject) => {
                        img.onload = resolve;
                        img.onerror = reject;
                        img.src = decal.texture;
                    }).catch(e => console.error("Failed to load decal texture:", e));

                    if (!img.complete || img.naturalWidth === 0) continue;

                    // Decal position [x, y] represents UV [u, v] (0.0 to 1.0)
                    const u = decal.position[0];
                    const v = decal.position[1];
                    const scaleX = decal.scale[0];

                    const aspect = img.height / img.width;
                    const w = canvas.width * scaleX;
                    const h = w * aspect; // Preserve aspect ratio

                    // Canvas Y is top-down (0 at top).
                    // glTF UV V is bottom-up (0 at bottom). 
                    // Since texture.flipY = false, we invert the V coordinate to map correctly to canvas space.
                    const canvasX = u * canvas.width;
                    const canvasY = (1 - v) * canvas.height;

                    // Support rotation around center (Z-axis rotation translates to 2D rotation)
                    ctx.save();
                    ctx.translate(canvasX, canvasY);
                    ctx.rotate(decal.rotation[2] || 0);
                    ctx.drawImage(img, -w / 2, -h / 2, w, h);
                    ctx.restore();
                }
            }

            // Crucial: tell Three.js to update the GPU texture
            texture.needsUpdate = true;
        };

        drawDecals();

    }, [shirtColor, decals, canvas, ctx, texture]);

    return texture;
}
