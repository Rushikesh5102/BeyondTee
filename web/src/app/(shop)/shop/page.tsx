"use client";
/* eslint-disable */

import { API_URL } from '@/lib/api-config';

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { IProduct } from "@/models/Product";
import { ProductSkeleton } from "@/components/ui/Skeleton";
import { useSearchParams } from "next/navigation";


function ShopContent() {
    const [products, setProducts] = useState<IProduct[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<IProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const searchParams = useSearchParams();

    // Filter States
    const [selectedGender, setSelectedGender] = useState<string>("ALL");
    const [selectedCollection, setSelectedCollection] = useState<string>("ALL");
    const [selectedFit, setSelectedFit] = useState<string>("ALL");

    useEffect(() => {
        const cat = searchParams.get('category');
        if (cat) {
            const upperCat = cat.toUpperCase();
            if (['MEN', 'WOMEN', 'UNISEX'].includes(upperCat)) {
                setSelectedGender(upperCat);
            } else {
                setSelectedCollection(cat);
            }
        }
    }, [searchParams]);

    useEffect(() => {
        fetch(`${API_URL}/products`)
            .then(res => res.json())
            .then(data => {
                let allProducts: IProduct[] = [];
                if (Array.isArray(data)) {
                    allProducts = data;
                } else if (data && data.success) {
                    allProducts = data.data;
                }
                setProducts(allProducts);
                setFilteredProducts(allProducts);
            })
            .catch(err => {
                console.error("Failed to fetch products:", err);
                setProducts([]);
                setFilteredProducts([]);
            })
            .finally(() => setLoading(false));
    }, []);

    // Filter Logic
    useEffect(() => {
        let result = products;

        if (selectedGender !== "ALL") {
            result = result.filter(p => p.gender === selectedGender || p.gender === 'UNISEX');
        }

        if (selectedCollection !== "ALL") {
            result = result.filter(p => p.collection === selectedCollection);
        }

        if (selectedFit !== "ALL") {
            result = result.filter(p => p.fit === selectedFit);
        }

        setFilteredProducts(result);
    }, [selectedGender, selectedCollection, selectedFit, products]);

    // Derived Lists for Filter Options
    const collections = Array.from(new Set(products.map(p => p.collection).filter(Boolean)));
    const fits = Array.from(new Set(products.map(p => p.fit).filter(Boolean)));

    return (
        <div className="min-h-screen bg-background text-foreground p-6 pt-24 transition-colors">
            <div className="container mx-auto flex flex-col md:flex-row gap-12">

                {/* Filters Sidebar */}
                <aside className="w-full md:w-64 flex-shrink-0">
                    <div className="sticky top-32 space-y-8 p-6 rounded-2xl bg-bg-secondary/50 border border-border transition-colors">
                        <div>
                            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-accent mb-6">Gender</h3>
                            <div className="flex flex-col gap-3">
                                {['ALL', 'MEN', 'WOMEN', 'UNISEX'].map(g => (
                                    <button
                                        key={g}
                                        onClick={() => setSelectedGender(g)}
                                        className={`text-left text-xs font-bold uppercase tracking-widest transition-all ${selectedGender === g ? 'text-foreground translate-x-1' : 'text-muted hover:text-foreground hover:translate-x-1'}`}
                                    >
                                        {g}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {collections.length > 0 && (
                            <div>
                                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-accent mb-6">Collection</h3>
                                <div className="flex flex-col gap-3">
                                    <button
                                        onClick={() => setSelectedCollection("ALL")}
                                        className={`text-left text-xs font-bold uppercase tracking-widest transition-all ${selectedCollection === "ALL" ? 'text-foreground translate-x-1' : 'text-muted hover:text-foreground hover:translate-x-1'}`}
                                    >
                                        All Collections
                                    </button>
                                    {collections.map((c: any) => (
                                        <button
                                            key={c}
                                            onClick={() => setSelectedCollection(c)}
                                            className={`text-left text-xs font-bold uppercase tracking-widest transition-all ${selectedCollection === c ? 'text-foreground translate-x-1' : 'text-muted hover:text-foreground hover:translate-x-1'}`}
                                        >
                                            {c}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {fits.length > 0 && (
                            <div>
                                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-accent mb-6">Fit</h3>
                                <div className="flex flex-col gap-3">
                                    <button
                                        onClick={() => setSelectedFit("ALL")}
                                        className={`text-left text-xs font-bold uppercase tracking-widest transition-all ${selectedFit === "ALL" ? 'text-foreground translate-x-1' : 'text-muted hover:text-foreground hover:translate-x-1'}`}
                                    >
                                        All Fits
                                    </button>
                                    {fits.map((f: any) => (
                                        <button
                                            key={f}
                                            onClick={() => setSelectedFit(f)}
                                            className={`text-left text-xs font-bold uppercase tracking-widest transition-all ${selectedFit === f ? 'text-foreground translate-x-1' : 'text-muted hover:text-foreground hover:translate-x-1'}`}
                                        >
                                            {f}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </aside>

                {/* Product Grid */}
                <div className="flex-1">
                    <div className="flex justify-between items-end mb-12">
                        <div>
                            <h1 className="text-5xl font-bold font-outfit uppercase tracking-tighter leading-none mb-2">Catalog</h1>
                            <p className="text-xs text-muted font-bold uppercase tracking-widest">Premium Custom Apparel</p>
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-muted bg-bg-secondary px-3 py-1 rounded-full border border-border">{filteredProducts.length} Pieces</span>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[...Array(6)].map((_, i) => (
                                <ProductSkeleton key={i} />
                            ))}
                        </div>
                    ) : filteredProducts.length === 0 ? (
                        <div className="text-center py-32 border border-border border-dashed rounded-3xl bg-bg-secondary/10">
                            <p className="text-2xl font-outfit uppercase font-bold tracking-tight">Zero Matches found</p>
                            <p className="text-xs mt-2 text-muted uppercase tracking-widest font-bold">Try adjusting your spectral filters.</p>
                            <button
                                onClick={() => { setSelectedGender("ALL"); setSelectedCollection("ALL"); setSelectedFit("ALL"); }}
                                className="mt-8 text-[10px] font-black uppercase tracking-[0.3em] text-accent hover:text-foreground transition-colors"
                            >
                                Reset Filters [×]
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredProducts.map(product => (
                                <Link href={product.stock === 0 ? '#' : `/customize?id=${product.id || (product as any)._id}`} key={product.id || (product as any)._id} className={`group block ${product.stock === 0 ? 'cursor-not-allowed opacity-80' : ''}`}>
                                    <div className="aspect-[3/4] bg-bg-secondary rounded-2xl overflow-hidden relative border border-border transition-all duration-500 group-hover:border-accent group-hover:shadow-[0_0_30px_rgba(255,255,255,0.05)]">
                                        <div className="w-full h-full flex items-center justify-center">
                                            { }
                                            {(() => {
                                                let imgUrl = "/placeholder.png";
                                                try {
                                                    const rawImgs = product.images as any;
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

                                        <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                        <div className="absolute inset-0 p-8 flex flex-col justify-end transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                            <div className="flex justify-between items-end gap-4 overflow-hidden">
                                                <div className="flex-1">
                                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-accent mb-2 opacity-0 group-hover:opacity-100 transition-all delay-75">{product.collection || 'Standard'}</p>
                                                    <h3 className="text-2xl font-bold font-outfit text-white leading-none tracking-tighter truncate">{product.name}</h3>
                                                </div>
                                                <p className="text-lg font-bold font-mono text-accent">₹{product.price}</p>
                                            </div>
                                            <div className="mt-6 pt-6 border-t border-white/10 opacity-0 group-hover:opacity-100 transition-all delay-150">
                                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white flex items-center justify-between">
                                                    {product.stock === 0 ? "It's beyond your reach." : "Open Studio"}
                                                    {product.stock !== 0 && <div className="w-2 h-2 rounded-full bg-accent shadow-[0_0_10px_rgba(204,255,0,0.8)] animate-pulse" />}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function ShopPage() {
    return (
        <Suspense fallback={<div className="container p-8 pt-24"><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">{[...Array(6)].map((_, i) => <ProductSkeleton key={i} />)}</div></div>}>
            <ShopContent />
        </Suspense>
    );
}
