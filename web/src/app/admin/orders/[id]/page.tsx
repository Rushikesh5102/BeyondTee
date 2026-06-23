/* eslint-disable */

"use client";

import { useEffect, useState } from "react";
import { API_URL } from "@/lib/api-config";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { ArrowLeft, Download, Loader2, Package, Truck, CheckCircle, Clock } from "lucide-react";
import { IOrder } from "@/models/Order";

export default function OrderDetailsPage({ params }: { params: { id: string } }) {
    const { data: session } = useSession();
    const [order, setOrder] = useState<IOrder | null>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        if (session?.user) {
            fetchOrder();
        }
    }, [session, params.id]);

    const fetchOrder = async () => {
        try {
            // @ts-ignore
            const token = session?.user?.accessToken;
            const res = await fetch(`${API_URL}/orders/${params.id}`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await res.json();
            if (data && (data.id || data._id)) {
                setOrder(data);
            }
        } catch (error) {
            console.error("Failed to fetch order", error);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (newStatus: string) => {
        if (!order) return;
        setUpdating(true);
        // @ts-ignore
        const token = session?.user?.accessToken;

        try {
            const res = await fetch(`${API_URL}/orders/${order._id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus })
            });

            if (res.ok) {
                setOrder({ ...order, status: newStatus });
            } else {
                alert("Failed to update status");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setUpdating(false);
        }
    };

    const StatusBadge = ({ status }: { status: string }) => {
        const styles = {
            PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
            PROCESSING: "bg-blue-100 text-blue-800 border-blue-200",
            SHIPPED: "bg-purple-100 text-purple-800 border-purple-200",
            DELIVERED: "bg-green-100 text-green-800 border-green-200",
            CANCELLED: "bg-red-100 text-red-800 border-red-200",
        };
        // @ts-ignore
        return <span className={`px-3 py-1 rounded-full text-xs font-bold border ${styles[status] || "bg-gray-100"}`}>{status}</span>;
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>;
    if (!order) return <div className="p-8">Order not found</div>;

    return (
        <div className="bg-background min-h-screen p-8 transition-colors">
            <div className="max-w-5xl mx-auto mb-6">
                <Link href="/admin/orders" className="text-muted hover:text-foreground flex items-center gap-2 text-sm mb-4 transition-colors">
                    <ArrowLeft size={16} />
                    Back to Orders
                </Link>

                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground mb-1">Order #{String(order.id || order._id).substring(0, 8)}</h1>
                        <p className="text-muted text-sm">Placed on {new Date(order.createdAt).toLocaleString()}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                        <StatusBadge status={order.status} />
                        <select
                            disabled={updating}
                            className="text-sm bg-background border-border rounded-md shadow-sm focus:border-foreground focus:ring-foreground text-foreground outline-none px-3 py-1 border transition-colors"
                            value={order.status}
                            onChange={(e) => updateStatus(e.target.value)}
                        >
                            <option value="PENDING">Mark as Pending</option>
                            <option value="PROCESSING">Mark as Processing</option>
                            <option value="SHIPPED">Mark as Shipped</option>
                            <option value="DELIVERED">Mark as Delivered</option>
                            <option value="CANCELLED">Mark as Cancelled</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto grid grid-cols-3 gap-8">
                {/* Left Column: Items */}
                <div className="col-span-2 space-y-6">
                    <div className="bg-background border border-border rounded-xl overflow-hidden shadow-sm transition-colors">
                        <div className="p-4 border-b border-border font-bold text-foreground bg-foreground/5">Order Items ({order.items.length})</div>
                        <div className="divide-y divide-border">
                            {order.items.map((item, idx) => {
                                let customData = null;
                                try {
                                    customData = typeof item.customizationData === 'string' ? JSON.parse(item.customizationData) : item.customizationData;
                                } catch (e) { }

                                return (
                                    <div key={idx} className="p-4 flex gap-4">
                                        <div className="w-20 h-20 bg-foreground/5 rounded-lg flex items-center justify-center text-muted border border-border overflow-hidden">
                                            {/* Placeholder or Product Image */}
                                            {customData?.preview ? (
                                                <img src={customData.preview} className="w-full h-full object-cover" />
                                            ) : (
                                                <Package size={24} />
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <div className="font-bold text-foreground">{item.product?.name || "Product"}</div>
                                            <div className="text-xs uppercase tracking-widest font-bold text-muted mt-1">Size: {item.size} • Color: {item.color} • Qty: {item.quantity}</div>

                                            {customData && (
                                                <div className="mt-4 p-3 bg-accent/5 rounded border border-accent/20 text-xs shadow-sm">
                                                    <div className="font-bold text-accent uppercase tracking-wider mb-2">Customization Assets</div>
                                                    <div className="flex gap-3 flex-wrap mt-2">
                                                        {customData.mockup && (
                                                            <a href={customData.mockup} download={`mockup-${item.productId}.png`} className="flex items-center gap-1 text-foreground hover:text-accent bg-background border border-border px-3 py-1.5 rounded transition-colors font-bold uppercase tracking-widest text-[10px]">
                                                                <Download size={14} />
                                                                Mockup
                                                            </a>
                                                        )}
                                                        {customData.decals && Array.isArray(customData.decals) && customData.decals.map((decal: any, i: number) => (
                                                            <a key={decal.id || i} href={decal.texture} download={`layer-${i + 1}.png`} className="flex items-center gap-1 text-foreground hover:text-accent bg-background border border-border px-3 py-1.5 rounded transition-colors font-bold uppercase tracking-widest text-[10px]">
                                                                <Download size={14} />
                                                                Layer {i + 1}
                                                            </a>
                                                        ))}
                                                        <button
                                                            onClick={() => {
                                                                const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(customData, null, 2));
                                                                const a = document.createElement('a');
                                                                a.href = dataStr;
                                                                a.download = `metadata-${item.productId}.json`;
                                                                a.click();
                                                            }}
                                                            className="flex items-center gap-1 text-foreground hover:text-accent bg-background border border-border px-3 py-1.5 rounded transition-colors font-bold uppercase tracking-widest text-[10px]"
                                                        >
                                                            <Download size={14} />
                                                            JSON Meta
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <div className="font-mono font-bold text-foreground">₹{item.price * item.quantity}</div>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="p-5 bg-foreground/5 flex justify-between items-center font-bold text-foreground border-t border-border">
                            <span className="uppercase tracking-widest text-xs">Total Amount</span>
                            <span className="text-lg">₹{order.totalAmount}</span>
                        </div>
                    </div>
                </div>

                {/* Right Column: Customer Info */}
                <div className="space-y-6">
                    <div className="bg-background border border-border rounded-xl p-6 shadow-sm transition-colors">
                        <h3 className="font-bold text-foreground mb-4">Customer Details</h3>
                        <div className="space-y-4 text-sm">
                            <div>
                                <div className="text-muted text-xs uppercase tracking-widest font-bold mb-1">Name</div>
                                <div className="font-bold text-foreground">{order.customerName || "N/A"}</div>
                            </div>
                            <div>
                                <div className="text-muted text-xs uppercase tracking-widest font-bold mb-1">Email</div>
                                <div className="font-bold text-foreground">{order.customerEmail || "N/A"}</div>
                            </div>
                            <div>
                                <div className="text-muted text-xs uppercase tracking-widest font-bold mb-1">User ID</div>
                                <div className="font-mono text-xs text-muted">{order.userId}</div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-background border border-border rounded-xl p-6 shadow-sm transition-colors">
                        <h3 className="font-bold text-foreground mb-4">Shipping Address</h3>
                        <div className="text-sm text-foreground/80 leading-relaxed space-y-1">
                            {order.shippingAddress ? (
                                <>
                                    <p className="font-medium">{order.shippingAddress.street}</p>
                                    <p className="font-medium">{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}</p>
                                    <p className="font-bold uppercase tracking-widest text-xs mt-2 text-muted">{order.shippingAddress.country}</p>
                                </>
                            ) : (
                                <p className="text-muted italic">No shipping address provided.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

