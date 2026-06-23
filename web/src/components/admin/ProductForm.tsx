/* eslint-disable */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { API_URL } from "@/lib/api-config";
import { IProduct } from "@/models/Product";
import { Loader2, Save, X, UploadCloud } from "lucide-react";
import Link from "next/link";

interface ProductFormProps {
    product?: IProduct;
    isEdit?: boolean;
}

export default function ProductForm({ product, isEdit = false }: ProductFormProps) {
    const router = useRouter();
    const { data: session } = useSession();
    const [submitting, setSubmitting] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);

    const [formData, setFormData] = useState<Partial<IProduct>>(product || {
        name: "",
        description: "",
        price: 0,
        sku: "",
        stock: 0,
        category: "T-Shirts", // Default
        gender: "UNISEX",
        collection: "",
        fit: "Normal",
        images: [],
        modelPath: "/Regular tshirt.glb",
        isCustomizable: false,
        isFeatured: false,
        fabricDetails: "",
        careInstructions: ""
    });

    const [imageInput, setImageInput] = useState("");

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.length) return;
        setUploadingImage(true);
        const file = e.target.files[0];
        const fd = new FormData();
        fd.append('file', file);
        try {
            // @ts-ignore
            const token = session?.user?.accessToken;
            const res = await fetch(`${API_URL}/uploads`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`
                },
                body: fd
            });
            if (res.ok) {
                const data = await res.json();
                const newArr = [...(formData.images || []), data.url];
                setFormData({ ...formData, images: newArr });
                setImageInput(newArr.join(', '));
            } else {
                alert("Upload failed");
            }
        } catch (err) {
            console.error(err);
            alert("Upload error");
        } finally {
            setUploadingImage(false);
            e.target.value = '';
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        // @ts-ignore
        const token = session?.user?.accessToken;

        try {
            const payload = { ...formData };
            if (imageInput) {
                const newImages = imageInput.split(',').map(s => s.trim());
                // @ts-ignore
                payload.images = Array.from(new Set([...(payload.images || []), ...newImages])).filter(Boolean);
            }

            payload.price = Number(payload.price);
            payload.stock = Number(payload.stock);

            const url = isEdit ? `${API_URL}/products/${product?._id || product?.id}` : `${API_URL}/products`;
            const method = isEdit ? "PATCH" : "POST";

            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                router.push("/admin/products");
                router.refresh();
            } else {
                const err = await res.json();
                alert(`Error: ${err.message || "Failed to save"}`);
            }
        } catch (e) {
            console.error(e);
            alert("Something went wrong");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8 pb-12 transition-colors">

            {/* Header */}
            <div className="flex justify-between items-center bg-background p-6 rounded-xl border border-border shadow-sm">
                <h2 className="text-xl font-bold text-foreground">{isEdit ? "Edit Product" : "Create New Product"}</h2>
                <div className="flex gap-4">
                    <Link href="/admin/products" className="px-4 py-2 text-muted hover:text-foreground transition-colors font-bold uppercase text-xs tracking-widest flex items-center">Cancel</Link>
                    <button
                        type="submit"
                        disabled={submitting}
                        className="btn-primary flex items-center gap-2 hover:opacity-80 transition-opacity disabled:opacity-50"
                    >
                        {submitting ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                        Save Product
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left Column - Main Info */}
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-background p-6 border border-border rounded-xl space-y-4 shadow-sm transition-colors">
                        <h3 className="font-bold text-foreground">General Information</h3>
                        <div>
                            <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-2">Product Name</label>
                            <input
                                required
                                type="text"
                                className="w-full px-4 py-3 bg-transparent border border-border rounded-lg focus:border-foreground focus:ring-1 focus:ring-foreground outline-none transition-colors"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-2">Description</label>
                            <textarea
                                required
                                rows={4}
                                className="w-full px-4 py-3 bg-transparent border border-border rounded-lg focus:border-foreground focus:ring-1 focus:ring-foreground outline-none transition-colors resize-none"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-2">Fabric Details</label>
                                <input
                                    type="text"
                                    placeholder="e.g. 100% Cotton, 220 GSM"
                                    className="w-full px-4 py-3 bg-transparent border border-border rounded-lg focus:border-foreground focus:ring-1 focus:ring-foreground outline-none transition-colors"
                                    value={formData.fabricDetails || ""}
                                    onChange={(e) => setFormData({ ...formData, fabricDetails: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-2">Care Instructions</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Machine wash cold"
                                    className="w-full px-4 py-3 bg-transparent border border-border rounded-lg focus:border-foreground focus:ring-1 focus:ring-foreground outline-none transition-colors"
                                    value={formData.careInstructions || ""}
                                    onChange={(e) => setFormData({ ...formData, careInstructions: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-background p-6 border border-border rounded-xl space-y-4 shadow-sm transition-colors">
                        <div className="flex justify-between items-center">
                            <h3 className="font-bold text-foreground">Media (Images)</h3>
                            <button
                                type="button"
                                className="relative cursor-pointer flex items-center gap-2 px-4 py-2 bg-foreground/5 hover:bg-foreground/10 text-foreground rounded-lg transition-colors border border-border text-[11px] font-bold uppercase tracking-wider"
                            >
                                <input type="file" disabled={uploadingImage} accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleImageUpload} />
                                {uploadingImage ? <Loader2 size={14} className="animate-spin" /> : <UploadCloud size={14} />}
                                {uploadingImage ? "Uploading..." : "Upload File"}
                            </button>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-2">Image URLs (Comma separated)</label>
                            <input
                                type="text"
                                className="w-full px-4 py-3 bg-transparent border border-border rounded-lg focus:border-foreground focus:ring-1 focus:ring-foreground outline-none transition-colors"
                                placeholder="/products/tee-black.png, /products/tee-white.png"
                                value={imageInput || (Array.isArray(formData.images) ? formData.images.join(', ') : "")}
                                onChange={(e) => {
                                    setImageInput(e.target.value);
                                    const arr = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                                    setFormData({ ...formData, images: arr });
                                }}
                            />
                            <p className="text-xs text-muted mt-2">Enter paths manually or definitively upload a file using the button above.</p>
                        </div>
                        {formData.images && formData.images.length > 0 && (
                            <div className="flex gap-3 flex-wrap mt-4">
                                {formData.images.map((img, i) => (
                                    <div key={i} className="w-24 h-24 bg-foreground/5 rounded-lg border border-border overflow-hidden relative group">
                                        <img src={img} alt="" className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            className="absolute top-1 right-1 p-1.5 bg-red-500 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-md"
                                            onClick={() => {
                                                const newImgs = formData.images!.filter((_, idx) => idx !== i);
                                                setFormData({ ...formData, images: newImgs });
                                                setImageInput(newImgs.join(', '));
                                            }}
                                        >
                                            <X size={12} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="bg-background p-6 border border-border rounded-xl space-y-4 shadow-sm transition-colors">
                        <h3 className="font-bold text-foreground">3D Configuration</h3>
                        <div className="flex items-center gap-4 p-5 bg-accent/5 rounded-xl border border-accent/20 transition-colors">
                            <input
                                type="checkbox"
                                id="isCustomizable"
                                className="w-5 h-5 rounded border-accent text-accent focus:ring-accent accent-accent bg-transparent"
                                checked={formData.isCustomizable}
                                onChange={(e) => setFormData({ ...formData, isCustomizable: e.target.checked })}
                            />
                            <div>
                                <label htmlFor="isCustomizable" className="block text-sm font-bold text-foreground">Enable 3D Customization</label>
                                <p className="text-xs text-muted mt-1">Allow users to apply dynamic designs on 3D model</p>
                            </div>
                        </div>

                        <div className="pt-2">
                            <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-2">3D Model Path (.glb)</label>
                            <select
                                className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:border-foreground focus:ring-1 focus:ring-foreground outline-none transition-colors"
                                value={formData.modelPath}
                                onChange={(e) => setFormData({ ...formData, modelPath: e.target.value })}
                            >
                                <option value="/Regular tshirt.glb">Regular T-Shirt</option>
                                <option value="/Oversized tshirt.glb">Oversized T-Shirt</option>
                                <option value="/Hoodie.glb">Hoodie (Heavy)</option>
                                <option value="/Polo tshirt.glb">Polo T-Shirt</option>
                                <option value="/Female tshirt.glb">Female T-Shirt</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Right Column - Attributes */}
                <div className="space-y-6">
                    <div className="bg-background p-6 border border-border rounded-xl space-y-4 shadow-sm transition-colors">
                        <h3 className="font-bold text-foreground">Pricing & Inventory</h3>
                        <div>
                            <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-2">Price (₹)</label>
                            <input
                                required
                                type="number"
                                min="0"
                                className="w-full px-4 py-3 bg-transparent border border-border rounded-lg focus:border-foreground focus:ring-1 focus:ring-foreground outline-none transition-colors"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.valueAsNumber })}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-2">Stock Quantity</label>
                            <input
                                required
                                type="number"
                                min="0" // Allow 0 for "Beyond Reach"
                                className="w-full px-4 py-3 bg-transparent border border-border rounded-lg focus:border-foreground focus:ring-1 focus:ring-foreground outline-none transition-colors"
                                value={formData.stock}
                                onChange={(e) => setFormData({ ...formData, stock: e.target.valueAsNumber })}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-2">SKU</label>
                            <input
                                required
                                type="text"
                                className="w-full px-4 py-3 bg-transparent border border-border rounded-lg focus:border-foreground focus:ring-1 focus:ring-foreground outline-none transition-colors font-mono text-sm"
                                value={formData.sku}
                                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="bg-background p-6 border border-border rounded-xl space-y-4 shadow-sm transition-colors">
                        <h3 className="font-bold text-foreground">Organization</h3>
                        <div>
                            <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-2">Category</label>
                            <select
                                className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:border-foreground focus:ring-1 focus:ring-foreground outline-none transition-colors"
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            >
                                <option value="T-Shirts">T-Shirts</option>
                                <option value="Hoodies">Hoodies</option>
                                <option value="Polos">Polos</option>
                                <option value="Sweatshirts">Sweatshirts</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-2">Gender</label>
                            <select
                                className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:border-foreground focus:ring-1 focus:ring-foreground outline-none transition-colors"
                                value={formData.gender}
                                // @ts-ignore
                                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                            >
                                <option value="MEN">Men</option>
                                <option value="WOMEN">Women</option>
                                <option value="UNISEX">Unisex</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-2">Collection</label>
                            <input
                                type="text"
                                placeholder="e.g. Premium Fashion"
                                className="w-full px-4 py-3 bg-transparent border border-border rounded-lg focus:border-foreground focus:ring-1 focus:ring-foreground outline-none transition-colors"
                                value={formData.collection || ""}
                                onChange={(e) => setFormData({ ...formData, collection: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-2">Fit</label>
                            <select
                                className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:border-foreground focus:ring-1 focus:ring-foreground outline-none transition-colors"
                                value={formData.fit || "Normal"}
                                onChange={(e) => setFormData({ ...formData, fit: e.target.value })}
                            >
                                <option value="Normal">Normal / Regular</option>
                                <option value="Oversized">Oversized / Drop Shoulder</option>
                                <option value="Slim">Slim</option>
                                <option value="Boxy">Boxy</option>
                            </select>
                        </div>
                        <div className="flex items-center gap-3 mt-6 p-4 bg-foreground/5 rounded-lg border border-border">
                            <input
                                type="checkbox"
                                id="isFeatured"
                                className="w-5 h-5 rounded border-border text-foreground focus:ring-foreground bg-transparent"
                                checked={formData.isFeatured}
                                onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                            />
                            <label htmlFor="isFeatured" className="text-sm font-bold text-foreground">Feature this product on Homepage</label>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}
