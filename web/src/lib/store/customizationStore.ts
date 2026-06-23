import { create } from 'zustand';

type DecalData = {
    id: string;
    texture: string; // URL
    position: [number, number, number];
    rotation: [number, number, number];
    scale: [number, number, number];
};

interface CustomizationState {
    shirtColor: string;
    setShirtColor: (color: string) => void;

    decals: DecalData[];
    addDecal: (texture: string) => void;
    updateDecal: (id: string, data: Partial<DecalData>) => void;
    removeDecal: (id: string) => void;
    previewImage: string | null;
    setPreviewImage: (url: string) => void;
    currentModelPath: string | null;
    setModelPath: (path: string) => void;
    activeDecal: string | null;
    setActiveDecal: (id: string | null) => void;
    draggingDecal: string | null;
    setDraggingDecal: (id: string | null) => void;
    transformMode: 'translate' | 'rotate' | 'scale';
    setTransformMode: (mode: 'translate' | 'rotate' | 'scale') => void;
}

export const useCustomizationStore = create<CustomizationState>((set) => ({
    shirtColor: '#ffffff',
    setShirtColor: (color) => set({ shirtColor: color }),

    decals: [],
    activeDecal: null,
    setActiveDecal: (id) => set({ activeDecal: id }),
    draggingDecal: null,
    setDraggingDecal: (id) => set({ draggingDecal: id }),
    transformMode: 'translate',
    setTransformMode: (mode) => set({ transformMode: mode }),

    addDecal: (texture) => set((state) => {
        const id = Math.random().toString(36).substring(7);
        return {
            decals: [...state.decals, {
                id,
                texture,
                position: [0, 0, 0.5], // Normalized projection distance
                rotation: [0, 0, 0],
                scale: [0.3, 0.3, 0.3]
            }],
            activeDecal: id
        };
    }),
    updateDecal: (id, data) => set((state) => ({
        decals: state.decals.map((d) => (d.id === id ? { ...d, ...data } : d)),
    })),
    removeDecal: (id) => set((state) => ({
        decals: state.decals.filter((d) => d.id !== id),
        activeDecal: state.activeDecal === id ? null : state.activeDecal
    })),
    previewImage: null,
    setPreviewImage: (url) => set({ previewImage: url }),
    currentModelPath: null,
    setModelPath: (path) => set({ currentModelPath: path }),
}));
