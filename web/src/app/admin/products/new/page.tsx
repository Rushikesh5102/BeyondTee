
"use client";

import ProductForm from "@/components/admin/ProductForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NewProductPage() {
    return (
        <div className="bg-background min-h-screen p-8 transition-colors">
            <div className="max-w-4xl mx-auto mb-6">
                <Link href="/admin/products" className="text-muted hover:text-foreground flex items-center gap-2 text-sm mb-4 transition-colors">
                    <ArrowLeft size={16} />
                    Back to Products
                </Link>
            </div>
            <ProductForm />
        </div>
    );
}
