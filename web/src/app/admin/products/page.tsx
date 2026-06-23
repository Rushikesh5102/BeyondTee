/* eslint-disable */
"use client";

import { useEffect, useState } from "react";
import { API_URL } from "@/lib/api-config";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Plus, Pencil, Trash2, Search, Filter, Check, X, Loader2 } from "lucide-react";
import { IProduct } from "@/models/Product";

export default function AdminProductsPage() {
    const { data: session } = useSession();
    const [products, setProducts] = useState<IProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [editingStock, setEditingStock] = useState<string | null>(null);
    const [stockValue, setStockValue] = useState<number>(0);
    const [updatingStock, setUpdatingStock] = useState(false);

    useEffect(() => {
        if (session?.user) {
            fetchProducts();
        }
    }, [session]);

    const fetchProducts = async () => {
        try {
            const res = await fetch(`${API_URL}/products`);
            const data = await res.json();
            if (Array.isArray(data)) {
                setProducts(data);
            }
        } catch (error) {
            console.error("Failed to fetch products", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this product?")) return;

        // @ts-ignore
        const token = session?.user?.accessToken;

        try {
            const res = await fetch(`${API_URL}/products/${id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (res.ok) {
                setProducts(products.filter(p => (p.id || p._id) !== id));
            } else {
                alert("Failed to delete");
            }
        } catch (e) {
            console.error(e);
        }
    };

    const handleUpdateStock = async (id: string) => {
        setUpdatingStock(true);
        // @ts-ignore
        const token = session?.user?.accessToken;

        try {
            const res = await fetch(`${API_URL}/products/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ stock: stockValue })
            });

            if (res.ok) {
                setProducts(products.map(p => (p.id || p._id) === id ? { ...p, stock: stockValue } : p));
                setEditingStock(null);
            } else {
                alert("Failed to update stock");
            }
        } catch (e) {
            console.error(e);
        } finally {
            setUpdatingStock(false);
        }
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.sku?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-transparent">
            <div className="flex justify-between items-center mb-12">
                <div>
                    <h1 className="text-4xl font-black font-outfit text-foreground uppercase tracking-tighter leading-none mb-2">Inventory</h1>
                    <p className="text-xs text-muted font-bold uppercase tracking-[0.2em]">Manage your digital catalog</p>
                </div>
                <Link href="/admin/products/new" className="bg-accent text-black px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-[10px] flex items-center gap-2 hover:scale-105 transition-all shadow-lg shadow-accent/20">
                    <Plus size={16} />
                    Add New Product
                </Link>
            </div>

            <div className="bg-bg-secondary/30 border border-border rounded-2xl overflow-hidden backdrop-blur-sm transition-colors">
                <div className="p-6 border-b border-border/50 flex gap-4">
                    <div className="relative flex-1 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-accent transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Search by name or SKU..."
                            className="w-full bg-background/50 pl-12 pr-4 py-3 border border-border/50 rounded-xl focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/50 transition-all text-sm text-foreground placeholder-muted"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <table className="w-full text-left border-collapse">
                    <thead className="bg-foreground/5 text-muted text-[10px] uppercase font-black tracking-[0.2em] border-b border-border/50">
                        <tr>
                            <th className="p-6">Product</th>
                            <th className="p-6">Category</th>
                            <th className="p-6">Price</th>
                            <th className="p-6">Stock</th>
                            <th className="p-6">Status</th>
                            <th className="p-6 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/30">
                        {loading ? (
                            <tr><td colSpan={6} className="p-8 text-center text-muted">Loading...</td></tr>
                        ) : filteredProducts.map((product) => {
                            const productId = product.id || product._id;
                            const isEditing = editingStock === productId;

                            // Safe Image Parsing
                            let displayImage = "/placeholder.png";
                            try {
                                if (product.images) {
                                    const rawImgs = product.images as any;
                                    const imgs = typeof rawImgs === 'string'
                                        ? (rawImgs.startsWith('[') ? JSON.parse(rawImgs) : [rawImgs])
                                        : rawImgs;
                                    displayImage = Array.isArray(imgs) ? imgs[0] : imgs;
                                }
                            } catch (e) {
                                console.error("Image parse error", e);
                            }

                            return (
                                <tr key={productId} className="hover:bg-foreground/[0.02] transition-colors group">
                                    <td className="p-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-background rounded-xl overflow-hidden relative border border-border group-hover:border-accent/30 transition-colors">
                                                <img src={displayImage} alt="" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                            </div>
                                            <div>
                                                <div className="font-bold text-foreground group-hover:text-accent transition-colors">{product.name}</div>
                                                <div className="text-[10px] text-muted font-mono uppercase tracking-widest">{product.sku}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <div className="flex flex-col">
                                            <span className="text-xs font-bold text-foreground/80">{product.category}</span>
                                            {product.collection && <span className="text-[9px] text-accent uppercase tracking-widest font-black mt-1">{product.collection}</span>}
                                        </div>
                                    </td>
                                    <td className="p-6 font-mono font-bold text-accent">₹{product.price}</td>
                                    <td className="p-6">
                                        {isEditing ? (
                                            <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                                                <input
                                                    type="number"
                                                    value={stockValue}
                                                    onChange={(e) => setStockValue(parseInt(e.target.value) || 0)}
                                                    className="w-20 bg-background border border-accent rounded-lg px-2 py-1 text-xs focus:outline-none"
                                                    autoFocus
                                                />
                                                <button
                                                    onClick={() => handleUpdateStock(productId!)}
                                                    className="text-green-500 p-1 hover:bg-green-500/10 rounded"
                                                    disabled={updatingStock}
                                                >
                                                    {updatingStock ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                                                </button>
                                                <button
                                                    onClick={() => setEditingStock(null)}
                                                    className="text-red-500 p-1 hover:bg-red-500/10 rounded"
                                                    disabled={updatingStock}
                                                >
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        ) : (
                                            <div
                                                className="group/stock cursor-pointer flex items-center gap-2"
                                                onClick={() => {
                                                    setEditingStock(productId || null);
                                                    setStockValue(product.stock);
                                                }}
                                            >
                                                <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-widest border transition-all ${product.stock > 0 ? 'bg-green-500/5 text-green-400 border-green-500/20' : 'bg-red-500/5 text-red-400 border-red-500/20'} hover:border-accent`}>
                                                    {product.stock} Units
                                                </span>
                                                <Pencil size={10} className="text-muted opacity-0 group-hover/stock:opacity-100 transition-opacity" />
                                            </div>
                                        )}
                                    </td>
                                    <td className="p-6">
                                        <span className={`text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full border ${product.isCustomizable ? 'border-accent/40 text-accent bg-accent/5' : 'border-border text-muted bg-transparent'}`}>
                                            {product.isCustomizable ? 'Configurable' : 'Locked'}
                                        </span>
                                    </td>
                                    <td className="p-6 text-right">
                                        <div className="flex justify-end gap-3 translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                                            <Link href={`/admin/products/${productId}`} className="p-2 text-muted hover:text-accent hover:bg-accent/10 rounded-lg transition-all">
                                                <Pencil size={16} />
                                            </Link>
                                            <button onClick={() => handleDelete(productId!)} className="p-2 text-muted hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
