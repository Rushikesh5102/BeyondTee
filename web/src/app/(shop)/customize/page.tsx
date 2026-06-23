"use client";
/* eslint-disable */

import Experience from "@/components/canvas/Experience";
import { useCustomizationStore } from "@/lib/store/customizationStore";
import { useCartStore } from "@/lib/store/cartStore";
import { Upload, ShoppingBag, Loader2, Move, RotateCw, Maximize, ArrowRight } from "lucide-react";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { API_URL } from "@/lib/api-config";
import { motion } from "framer-motion";

function ModelSelectorScreen() {
    const router = useRouter();
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${API_URL}/products`)
            .then(res => res.json())
            .then(data => {
                setProducts(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Failed to load products:', err);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div className="w-full h-screen bg-background flex flex-col items-center justify-center text-foreground">
                <Loader2 className="w-8 h-8 animate-spin mb-4" />
                <span className="text-xs uppercase tracking-[0.3em] font-black animate-pulse">Scanning Collections</span>
            </div>
        );
    }

    return (
        <main className="w-full min-h-screen bg-bg-secondary pt-32 pb-24 px-4 sm:px-8 flex flex-col items-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-16 max-w-2xl"
            >
                <h1 className="text-4xl md:text-6xl font-black font-outfit uppercase tracking-tighter mb-4 text-foreground leading-[0.9]">
                    Select <br /> <span className="text-muted text-3xl md:text-5xl">Canvas</span>
                </h1>
                <p className="text-muted uppercase tracking-[0.2em] text-[10px] font-bold">
                    Choose your garment before entering the 3D Studio.
                </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl w-full">
                {products.filter(p => p.modelPath).map((product, i) => (
                    <motion.button
                        key={product.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        onClick={() => router.push(`/customize?id=${product.id}`)}
                        className="group relative bg-background rounded-2xl p-6 border border-border hover:border-accent text-left transition-all hover:shadow-2xl hover:-translate-y-1 flex flex-col min-h-[380px] overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-foreground/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />

                        {/* Preview */}
                        <div className="w-full aspect-[4/3] bg-bg-secondary rounded-xl mb-6 overflow-hidden relative border border-border/50 group-hover:border-accent/30 transition-colors">
                            {(() => {
                                let imgUrl = "/placeholder.png";
                                try {
                                    const rawImgs = product.images;
                                    const imgs = typeof rawImgs === 'string'
                                        ? (rawImgs.startsWith('[') ? JSON.parse(rawImgs) : [rawImgs])
                                        : rawImgs;
                                    imgUrl = Array.isArray(imgs) ? imgs[0] : imgs;
                                } catch (e) {
                                    imgUrl = typeof product.images === 'string' ? product.images : "/placeholder.png";
                                }
                                return <img src={imgUrl} alt={product.name} className="object-cover w-full h-full opacity-90 group-hover:opacity-100 transition-all duration-700 group-hover:scale-110" />
                            })()}
                        </div>

                        <div className="relative z-10 flex-1 flex flex-col justify-between">
                            <div>
                                <h3 className="text-xl font-black font-outfit uppercase tracking-tight text-foreground mb-1 group-hover:text-accent transition-colors">
                                    {product.name}
                                </h3>
                                <p className="text-[10px] text-muted uppercase tracking-[0.2em] font-bold">
                                    {product.collection || '3D Studio Edition'}
                                </p>
                            </div>

                            <div className="w-full mt-6 flex items-end justify-between">
                                <div className="text-sm font-mono font-black text-foreground bg-bg-secondary px-3 py-1 rounded-md border border-border">
                                    ₹{product.price}
                                </div>
                                <div className="w-10 h-10 rounded-full bg-accent text-background flex items-center justify-center shadow-[0_0_20px_rgba(204,255,0,0.2)] group-hover:scale-110 transition-all">
                                    <ArrowRight size={18} />
                                </div>
                            </div>
                        </div>
                    </motion.button>
                ))}
            </div>

            {products.filter(p => p.modelPath).length === 0 && !loading && (
                <div className="text-muted text-center py-20 uppercase tracking-widest text-sm font-bold border border-dashed border-border p-12 rounded-3xl">
                    No 3D Models Configured.
                </div>
            )}
        </main>
    );
}

function CustomizeContent() {
    const { shirtColor, decals, setShirtColor, addDecal, removeDecal, setModelPath, activeDecal, transformMode, setTransformMode } = useCustomizationStore();
    const { addItem } = useCartStore();
    const [loading, setLoading] = useState(false);
    const [product, setProduct] = useState<any>(null);
    const [activeTab, setActiveTab] = useState<'color' | 'upload' | 'text' | 'size'>('color');
    const [selectedSize, setSelectedSize] = useState("L");

    const [textInput, setTextInput] = useState("");
    const [textColor, setTextColor] = useState("#000000");
    const [selectedFont, setSelectedFont] = useState("Arial");

    const router = useRouter();
    const searchParams = useSearchParams();
    const productId = searchParams.get('id');

    useEffect(() => {
        if (!productId) return;

        fetch(`${API_URL}/products/${productId}`)
            .then(res => res.json())
            .then(data => {
                setProduct(data);
                if (data.modelPath) {
                    setModelPath(data.modelPath);
                }
            })
            .catch(err => console.error('Error fetching product:', err));
    }, [productId, setModelPath]);

    const [uploading, setUploading] = useState(false);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setUploading(true);
            try {
                const formData = new FormData();
                formData.append('file', file);

                const res = await fetch(`${API_URL}/uploads`, {
                    method: 'POST',
                    body: formData,
                });

                if (!res.ok) throw new Error('Upload failed');
                const data = await res.json();
                addDecal(data.url);
            } catch (err) {
                console.error('Upload error:', err);
                alert('Failed to upload design. Check backend connection.');
            } finally {
                setUploading(false);
            }
        }
    };

    const handleAddText = () => {
        if (!textInput.trim()) return;

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = 1024;
        canvas.height = 1024;

        ctx.clearRect(0, 0, 1024, 1024);
        ctx.fillStyle = textColor;
        ctx.font = `bold 200px ${selectedFont}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(textInput, 512, 512);

        const dataUrl = canvas.toDataURL('image/png');
        addDecal(dataUrl);
        setTextInput("");
        setActiveTab('color');
    };

    const captureScreenshot = () => {
        const canvas = document.querySelector('canvas');
        if (canvas) {
            return canvas.toDataURL('image/png');
        }
        return null;
    };

    const handleAddToBag = async () => {
        setLoading(true);
        const screenshot = captureScreenshot();

        setTimeout(() => {
            addItem({
                id: Math.random().toString(36).substr(2, 9),
                productId: productId || "custom",
                name: product?.name || "Custom Apparel",
                price: product?.price || 2499,
                size: selectedSize,
                color: shirtColor,
                quantity: 1,
                customizationData: decals,
                previewImage: screenshot || "/placeholder-preview.png"
            });
            setLoading(false);
            router.push("/cart");
        }, 800);
    };

    // Show selection screen if no ID is queried
    if (!productId) {
        return <ModelSelectorScreen />;
    }

    return (
        <main className="w-full h-screen flex flex-col bg-background transition-colors relative z-0">
            <div className="flex-1 w-full h-full relative overflow-hidden">
                <Experience />

                {activeDecal && (
                    <div className="absolute top-24 md:top-1/2 md:-translate-y-1/2 right-4 md:right-8 z-50 bg-bg-secondary/80 backdrop-blur-md p-1.5 rounded-2xl border border-border flex flex-col gap-2 shadow-2xl animate-in fade-in zoom-in duration-300 pointer-events-auto">
                        {[
                            { id: 'translate', icon: <Move size={20} />, label: 'Move (T)' },
                            { id: 'scale', icon: <Maximize size={20} />, label: 'Scale (S)' },
                            { id: 'rotate', icon: <RotateCw size={20} />, label: 'Rotate (R)' }
                        ].map((mode) => (
                            <button
                                key={mode.id}
                                onClick={() => setTransformMode(mode.id as any)}
                                className={`p-3 rounded-xl flex items-center justify-center transition-all ${transformMode === mode.id ? 'bg-accent text-black scale-105 shadow-lg' : 'text-muted hover:text-foreground hover:bg-foreground/10 active:scale-95'}`}
                                title={mode.label}
                            >
                                {mode.icon}
                            </button>
                        ))}
                    </div>
                )}

                <div className="absolute top-16 md:top-20 bottom-0 left-0 w-full md:w-[400px] p-4 md:p-8 pointer-events-none flex flex-col justify-end md:justify-center z-20">
                    <div data-lenis-prevent className="bg-glass backdrop-blur-md p-6 rounded-2xl pointer-events-auto border border-border shadow-2xl space-y-6 max-h-[80vh] overflow-y-auto custom-scrollbar transition-all">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold font-outfit text-foreground uppercase tracking-tight">
                                {product ? product.name : "Custom Studio"}
                            </h2>
                            {product && <div className="text-xs font-mono text-accent">₹{product.price}</div>}
                        </div>

                        <div className="flex gap-2 bg-bg-secondary/40 p-1 rounded-lg">
                            {['size', 'color', 'upload', 'text'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab as any)}
                                    // @ts-ignore
                                    className={`flex-1 py-2 rounded-md text-xs font-bold uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-foreground text-background shadow-lg scale-[1.02]' : 'text-muted hover:text-foreground hover:bg-foreground/5'}`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        <div className="space-y-6">
                            {activeTab === 'size' && (
                                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    <label className="text-[10px] text-muted uppercase tracking-[0.2em] mb-4 block font-black">Select Size</label>
                                    <div className="grid grid-cols-4 gap-3">
                                        {['S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                                            <button
                                                key={size}
                                                onClick={() => setSelectedSize(size)}
                                                className={`py-4 rounded-xl border font-bold text-sm transition-all ${selectedSize === size
                                                    ? 'bg-foreground text-background border-foreground scale-105 shadow-xl'
                                                    : 'bg-transparent text-muted border-border hover:border-foreground hover:text-foreground'
                                                    }`}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                    <p className="mt-4 text-[10px] text-muted text-center uppercase tracking-widest">Standard Regular Fit</p>
                                </div>
                            )}

                            {activeTab === 'color' && (
                                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    <label className="text-[10px] text-muted uppercase tracking-[0.2em] mb-4 block font-black">Base Material</label>
                                    <div className="grid grid-cols-5 gap-3">
                                        {[
                                            { name: 'Arctic', hex: '#ffffff' },
                                            { name: 'Midnight', hex: '#000000' },
                                            { name: 'Charcoal', hex: '#1a1a1a' },
                                            { name: 'Heather', hex: '#52525b' },
                                            { name: 'Crimson', hex: '#e11d48' },
                                            { name: 'Navy', hex: '#1e3a8a' },
                                            { name: 'Forest', hex: '#14532d' },
                                            { name: 'Mustard', hex: '#a16207' },
                                            { name: 'Royal', hex: '#2563eb' },
                                            { name: 'Purple', hex: '#7c3aed' }
                                        ].map((c) => (
                                            <button
                                                key={c.hex}
                                                onClick={() => setShirtColor(c.hex)}
                                                className={`w-full aspect-square rounded-xl shadow-inner flex items-center justify-center transition-all hover:scale-110 active:scale-95 ${shirtColor === c.hex ? 'ring-2 ring-accent ring-offset-2 ring-offset-background' : 'grayscale-[0.3] hover:grayscale-0'}`}
                                                style={{ backgroundColor: c.hex }}
                                                title={c.name}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'upload' && (
                                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    <label className="text-[10px] text-muted uppercase tracking-[0.2em] block font-black">Upload Artwork</label>
                                    <p className="text-[10px] text-muted leading-relaxed">Supported formats: PNG, JPG, WEBP. <br />Transparent PNGs recommended for best results.</p>

                                    <label className="flex flex-col items-center justify-center w-full h-32 border border-dashed border-border rounded-xl bg-bg-secondary/20 text-sm text-muted hover:bg-foreground/5 hover:border-foreground/20 transition-all cursor-pointer group">
                                        {uploading ? <Loader2 className="w-8 h-8 mb-2 animate-spin text-accent" /> : <Upload className="w-8 h-8 mb-2 text-muted group-hover:text-foreground transition-colors" />}
                                        <span className="font-bold uppercase tracking-widest text-[10px]">{uploading ? 'Processing...' : 'Click to Upload'}</span>
                                        <input type="file" className="hidden" accept="image/*" onChange={handleUpload} />
                                    </label>
                                </div>
                            )}

                            {activeTab === 'text' && (
                                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    <label className="text-[10px] text-muted uppercase tracking-[0.2em] block font-black">Add Text</label>

                                    <input
                                        type="text"
                                        placeholder="Enter text..."
                                        className="w-full bg-bg-secondary/40 border border-border rounded-lg px-4 py-3 text-foreground placeholder-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all font-medium"
                                        value={textInput}
                                        onChange={(e) => setTextInput(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleAddText()}
                                    />

                                    <div className="flex gap-4">
                                        <div className="flex-1">
                                            <label className="text-[10px] text-muted uppercase mb-2 block font-bold">Font</label>
                                            <select
                                                className="w-full bg-bg-secondary/40 border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-accent"
                                                value={selectedFont}
                                                onChange={(e) => setSelectedFont(e.target.value)}
                                            >
                                                <option value="Arial">Sans Serif</option>
                                                <option value="Times New Roman">Serif</option>
                                                <option value="Courier New">Monospace</option>
                                                <option value="Impact">Bold / Impact</option>
                                                <option value="Brush Script MT">Handwritten</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-[10px] text-muted uppercase mb-2 block font-bold">Color</label>
                                            <div className="flex items-center h-[38px] bg-bg-secondary/40 border border-border rounded-lg px-2">
                                                <input
                                                    type="color"
                                                    className="w-8 h-8 bg-transparent border-none cursor-pointer"
                                                    value={textColor}
                                                    onChange={(e) => setTextColor(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleAddText}
                                        disabled={!textInput.trim()}
                                        className="w-full bg-accent hover:opacity-90 text-white font-bold uppercase tracking-[0.2em] text-xs py-4 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-95"
                                    >
                                        Add Text Layer
                                    </button>
                                </div>
                            )}

                            {decals.length > 0 && (
                                <div className="pt-6 border-t border-border animate-in fade-in duration-500">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-[10px] text-muted uppercase tracking-[0.2em] font-black">Layers ({decals.length})</h3>
                                    </div>
                                    <div data-lenis-prevent className="space-y-2 max-h-40 overflow-y-auto pr-1 custom-scrollbar">
                                        {decals.map((decal, index) => (
                                            <div key={decal.id} className="flex items-center justify-between bg-foreground/5 hover:bg-foreground/10 p-2 rounded-lg border border-border transition-colors group">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 relative rounded bg-checkered overflow-hidden border border-border">
                                                        <img src={decal.texture} alt="Layer" className="object-cover w-full h-full" />
                                                    </div>
                                                    <div>
                                                        <div className="text-xs font-bold text-foreground">Layer {index + 1}</div>
                                                        <div className="text-[10px] text-muted uppercase tracking-widest">Active</div>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => removeDecal(decal.id)}
                                                    className="w-8 h-8 flex items-center justify-center text-muted hover:text-red-500 hover:bg-foreground/5 rounded transition-all"
                                                    title="Remove Layer"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {product && (
                            <div className="pt-4 border-t border-border">
                                <button className="w-full text-left group">
                                    <div className="flex items-center justify-between text-[10px] text-muted uppercase tracking-[0.2em] font-black mb-2 group-hover:text-foreground transition-colors">
                                        Product Details
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-50 group-hover:opacity-100"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
                                    </div>
                                    <div className="text-muted text-[11px] space-y-2 group-hover:text-foreground/80 transition-colors leading-relaxed">
                                        <p>{product.description}</p>
                                        {product.fabricDetails && <p className="font-mono text-[10px] text-accent opacity-80">{product.fabricDetails}</p>}
                                    </div>
                                </button>
                            </div>
                        )}
                        <div className="md:hidden pt-4 border-t border-border mt-4 pb-2">
                            <button
                                onClick={handleAddToBag}
                                disabled={loading || (product && product.stock === 0)}
                                className="w-full bg-foreground text-background hover:scale-105 active:scale-95 text-lg font-bold px-8 py-4 rounded-xl shadow-2xl transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group"
                            >
                                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <ShoppingBag className="w-6 h-6 group-hover:animate-bounce" />}
                                <span className="uppercase tracking-widest text-sm text-center">
                                    {loading ? "Adding..." : (product && product.stock === 0 ? "It's beyond your reach." : `Add to Bag • ₹${product?.price?.toLocaleString() || '2,499'}`)}
                                </span>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="hidden md:block absolute bottom-8 right-8 pointer-events-auto">
                    <button
                        onClick={handleAddToBag}
                        disabled={loading || (product && product.stock === 0)}
                        className="bg-foreground text-background hover:scale-105 active:scale-95 text-lg font-bold px-8 py-5 rounded-full shadow-2xl transition-all flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group"
                    >
                        {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <ShoppingBag className="w-6 h-6 group-hover:animate-bounce" />}
                        <span className="uppercase tracking-widest text-sm text-center">
                            {loading ? "Adding..." : (product && product.stock === 0 ? "It's beyond your reach." : `Add to Bag • ₹${product?.price?.toLocaleString() || '2,499'}`)}
                        </span>
                    </button>
                </div>
            </div>
        </main>
    );
}

export default function CustomizePage() {
    return (
        <Suspense fallback={<div className="w-full h-screen bg-background flex flex-col items-center justify-center text-foreground"><Loader2 className="w-8 h-8 animate-spin mb-4" /><span className="text-xs uppercase tracking-[0.3em] font-black animate-pulse">Initializing Studio</span></div>}>
            <CustomizeContent />
        </Suspense>
    );
}

