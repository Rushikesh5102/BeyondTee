
"use client";

import { useEffect, useState } from "react";
import ProductForm from "@/components/admin/ProductForm";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { API_URL } from "@/lib/api-config";
import { IProduct } from "@/models/Product";

export default function EditProductPage({ params }: { params: { id: string } }) {
    const [product, setProduct] = useState<IProduct | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Handle params being a Promise in newer Next.js versions if needed, 
        // but for now accessed directly. If it breaks, we unwrap.
        // Actually, let's fetch.
        const id = params.id;

        fetch(`${API_URL}/products/${id}`)
            .then(res => res.json())
            .then(data => {
                if (data && (data.id || data._id)) {
                    setProduct(data);
                } else {
                    console.error("Product not found");
                }
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, [params.id]);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>;
    }

    if (!product) {
        return <div className="p-8">Product not found.</div>;
    }

    return (
        <div className="bg-gray-50 min-h-screen p-8">
            <div className="max-w-4xl mx-auto mb-6">
                <Link href="/admin/products" className="text-gray-500 hover:text-black flex items-center gap-2 text-sm mb-4">
                    <ArrowLeft size={16} />
                    Back to Products
                </Link>
            </div>
            <ProductForm product={product} isEdit={true} />
        </div>
    );
}
