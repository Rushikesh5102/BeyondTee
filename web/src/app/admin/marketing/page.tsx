/* eslint-disable */

"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { API_URL } from "@/lib/api-config";
import { Plus, Trash2, Ticket, Loader2 } from "lucide-react";

interface ICoupon {
    id: string;
    code: string;
    discount: number;
    type: 'PERCENTAGE' | 'FIXED';
    isActive: boolean;
    expiresAt?: string;
    createdAt: string;
}

export default function MarketingPage() {
    const { data: session } = useSession();
    const [coupons, setCoupons] = useState<ICoupon[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        code: "",
        discount: 0,
        type: "PERCENTAGE",
        expiresAt: ""
    });

    useEffect(() => {
        if (session?.user) {
            fetchCoupons();
        }
    }, [session]);

    const fetchCoupons = async () => {
        try {
            // @ts-ignore
            const token = session?.user?.accessToken;
            const res = await fetch(`${API_URL}/coupons`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await res.json();
            if (Array.isArray(data)) {
                setCoupons(data);
            }
        } catch (error) {
            console.error("Failed to fetch coupons", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        // @ts-ignore
        const token = session?.user?.accessToken;

        try {
            const payload = {
                ...formData,
                discount: Number(formData.discount),
                expiresAt: formData.expiresAt ? new Date(formData.expiresAt).toISOString() : undefined
            };

            const res = await fetch(`${API_URL}/coupons`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                const newCoupon = await res.json();
                setCoupons([newCoupon, ...coupons]);
                setShowForm(false);
                setFormData({ code: "", discount: 0, type: "PERCENTAGE", expiresAt: "" });
            } else {
                alert("Failed to create coupon");
            }
        } catch (e) {
            console.error(e);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this coupon?")) return;
        // @ts-ignore
        const token = session?.user?.accessToken;

        try {
            const res = await fetch(`${API_URL}/coupons/${id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) {
                setCoupons(coupons.filter(c => c.id !== id));
            }
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className="min-h-screen bg-white">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold font-outfit text-black">Marketing</h1>
                    <p className="text-gray-500">Manage discounts and promotions</p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-black text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-800 transition-colors"
                >
                    <Plus size={18} />
                    Create Coupon
                </button>
            </div>

            {showForm && (
                <div className="mb-8 p-6 bg-gray-50 rounded-xl border border-gray-200 animate-in fade-in slide-in-from-top-2">
                    <h3 className="font-semibold text-gray-900 mb-4">New Coupon</h3>
                    <form onSubmit={handleCreate} className="grid grid-cols-4 gap-4 items-end">
                        <div className="col-span-1">
                            <label className="block text-xs font-medium text-gray-500 mb-1">Code</label>
                            <input
                                required
                                type="text"
                                placeholder="e.g. SUMMER20"
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black/5 outline-none uppercase font-mono"
                                value={formData.code}
                                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                            />
                        </div>
                        <div className="col-span-1">
                            <label className="block text-xs font-medium text-gray-500 mb-1">Discount Type</label>
                            <select
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black/5 outline-none bg-white"
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                            >
                                <option value="PERCENTAGE">Percentage (%)</option>
                                <option value="FIXED">Fixed Amount (₹)</option>
                            </select>
                        </div>
                        <div className="col-span-1">
                            <label className="block text-xs font-medium text-gray-500 mb-1">Value</label>
                            <input
                                required
                                type="number"
                                min="0"
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black/5 outline-none"
                                value={formData.discount}
                                onChange={(e) => setFormData({ ...formData, discount: Number(e.target.value) })}
                            />
                        </div>
                        <div className="col-span-1 flex gap-2">
                            <button
                                type="submit"
                                disabled={submitting}
                                className="flex-1 bg-black text-white py-2 rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50"
                            >
                                {submitting ? <Loader2 className="animate-spin mx-auto" size={20} /> : "Save"}
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                className="px-4 py-2 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-100"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {loading ? (
                    <div className="col-span-3 text-center py-12 text-gray-500">Loading coupons...</div>
                ) : coupons.length === 0 ? (
                    <div className="col-span-3 text-center py-12 text-gray-400 border-2 border-dashed rounded-xl">
                        No active coupons found. Create one!
                    </div>
                ) : (
                    coupons.map((coupon) => (
                        <div key={coupon.id} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm relative group">
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-2">
                                    <div className="bg-purple-50 text-purple-600 p-2 rounded-lg">
                                        <Ticket size={20} />
                                    </div>
                                    <div>
                                        <div className="text-lg font-bold font-mono tracking-wide text-gray-900">{coupon.code}</div>
                                        <div className="text-xs text-gray-500">
                                            {coupon.type === 'PERCENTAGE' ? `${coupon.discount}% OFF` : `₹${coupon.discount} OFF`}
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleDelete(coupon.id)}
                                    className="text-gray-400 hover:text-red-500 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                            <div className="mt-4 pt-4 border-t border-gray-50 flex justify-between items-center text-xs">
                                <span className={`px-2 py-0.5 rounded ${coupon.isActive ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                    {coupon.isActive ? 'Active' : 'Inactive'}
                                </span>
                                <span className="text-gray-400">
                                    {coupon.expiresAt ? `Expires: ${new Date(coupon.expiresAt).toLocaleDateString()}` : 'No Expiry'}
                                </span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
