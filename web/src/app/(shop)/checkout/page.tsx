"use client";
/* eslint-disable */

import { API_URL } from '@/lib/api-config';
import { useCartStore } from "@/lib/store/cartStore";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import Script from 'next/script';

declare global {
    interface Window {
        Razorpay: any;
    }
}

export default function CheckoutPage() {
    const { items, total, subtotal, clearCart, appliedCoupon, applyCoupon, removeCoupon } = useCartStore();
    const [loading, setLoading] = useState(false);
    const [couponCode, setCouponCode] = useState("");
    const [validatingCoupon, setValidatingCoupon] = useState(false);
    const router = useRouter();
    const { data: session } = useSession();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        address: ""
    });

    // Populate user details if logged in
    useEffect(() => {
        if (session?.user) {
            setFormData(prev => ({
                ...prev,
                name: session.user.name || prev.name,
                email: session.user.email || prev.email,
            }));
        }
    }, [session]);

    const handleApplyCoupon = async () => {
        if (!couponCode) return;
        setValidatingCoupon(true);
        try {
            const res = await fetch(`${API_URL}/coupons/validate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: couponCode })
            });
            const data = await res.json();
            if (res.ok) {
                applyCoupon(data);
                alert("Coupon Applied!");
            } else {
                alert(data.message || "Invalid Coupon");
            }
        } catch (e) {
            console.error(e);
            alert("Failed to validate coupon");
        } finally {
            setValidatingCoupon(false);
        }
    };

    const handlePayment = async (orderId: string, amount: number, customerDetails: any) => {
        const res = await fetch(`${API_URL}/payments/create-order`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                amount: amount,
                receiptId: orderId
            })
        });

        if (!res.ok) throw new Error("Payment initialization failed");
        const data = await res.json(); // Razorpay Order Object

        const options = {
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_placeholder', // Should be in env
            amount: data.amount,
            currency: data.currency,
            name: "Beyondtee",
            description: "Premium Apparel",
            order_id: data.id,
            handler: async function (response: any) {
                // Verify Payment
                try {
                    const verifyRes = await fetch(`${API_URL}/payments/verify`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            razorpayOrderId: response.razorpay_order_id,
                            razorpayPaymentId: response.razorpay_payment_id,
                            signature: response.razorpay_signature
                        })
                    });

                    if (verifyRes.ok) {
                        // Success
                        clearCart();
                        // Save to LocalStorage for Guest Tracking
                        const guestOrders = JSON.parse(localStorage.getItem('guest_order_ids') || '[]');
                        if (!guestOrders.includes(orderId)) {
                            guestOrders.unshift(orderId);
                            localStorage.setItem('guest_order_ids', JSON.stringify(guestOrders));
                        }
                        router.push("/profile?success=true");
                    } else {
                        alert("Payment Verification Failed");
                    }
                } catch (e) {
                    console.error("Verification Error", e);
                    alert("Payment Verification Error");
                }
            },
            prefill: {
                name: customerDetails.name,
                email: customerDetails.email,
                contact: "" // Can add phone field if needed
            },
            theme: {
                color: "#000000"
            }
        };

        const rzp1 = new window.Razorpay(options);
        rzp1.open();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const userId = (session?.user as any)?.id || `guest-${Date.now()}`;

            const orderData = {
                userId: userId,
                totalAmount: total(),
                shippingAddress: {
                    street: formData.address,
                    city: "Mumbai",
                    state: "Maharashtra",
                    zip: "400001",
                    country: "India"
                },
                couponCode: appliedCoupon?.code,
                customerName: formData.name,
                customerEmail: formData.email,
                items: items.map(item => ({
                    productId: item.productId,
                    quantity: item.quantity,
                    size: item.size || 'L',
                    color: item.color || '#000000',
                    price: item.price,
                    customizationData: (!item.customizationData || (Array.isArray(item.customizationData) && item.customizationData.length === 0)) ? null : {
                        decals: item.customizationData,
                        mockup: item.previewImage,
                    }
                }))
            };

            // 1. Create Order in Backend
            const res = await fetch(`${API_URL}/orders`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData)
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.message || "Order creation failed");
            }

            const orderResponse = await res.json();
            const orderId = orderResponse.id || orderResponse.data?.id || orderResponse.data?._id;

            console.log("Order Created:", orderId, "Initiating Razorpay...");

            // 2. Initiate Razorpay Payment
            await handlePayment(orderId, total(), formData);

        } catch (err: any) {
            console.error("Checkout Error:", err);
            alert(`Checkout failed: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    if (items.length === 0 && !loading) {
        return <div className="min-h-screen flex items-center justify-center bg-background text-foreground transition-colors">Your cart is empty.</div>;
    }

    return (
        <>
            <Script
                id="razorpay-checkout-js"
                src="https://checkout.razorpay.com/v1/checkout.js"
            />
            <div className="min-h-screen bg-background text-foreground p-8 pt-24 font-inter transition-colors">
                <div className="container max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div>
                        <h1 className="text-3xl font-bold mb-8 font-outfit uppercase tracking-tight">Checkout</h1>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid gap-6">
                                <div>
                                    <label className="block text-xs uppercase tracking-widest text-muted mb-2 font-bold">Full Name</label>
                                    <input
                                        required
                                        type="text"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-bg-secondary border border-border p-3 rounded focus:border-accent outline-none transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs uppercase tracking-widest text-muted mb-2 font-bold">Email</label>
                                    <input
                                        required
                                        type="email"
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full bg-bg-secondary border border-border p-3 rounded focus:border-accent outline-none transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs uppercase tracking-widest text-muted mb-2 font-bold">Shipping Address</label>
                                    <textarea
                                        required
                                        value={formData.address}
                                        onChange={e => setFormData({ ...formData, address: e.target.value })}
                                        className="w-full bg-bg-secondary border border-border p-3 rounded focus:border-accent outline-none transition-colors"
                                        rows={3}
                                    />
                                </div>
                            </div>

                            <button disabled={loading} className="btn-primary w-full py-4 flex justify-center uppercase font-bold tracking-[0.2em] text-sm mt-8">
                                {loading ? <Loader2 className="animate-spin" /> : "Pay with Razorpay"}
                            </button>
                        </form>
                    </div>

                    {/* Order Summary */}
                    <div className="bg-bg-secondary/50 border border-border rounded-xl p-8 h-fit">
                        <h2 className="text-xl font-bold mb-6 font-outfit uppercase tracking-wider text-muted">Order Summary</h2>
                        <div className="space-y-4 mb-8">
                            {items.map(item => (
                                <div key={item.id} className="flex justify-between items-center text-sm">
                                    <div>
                                        <span className="font-bold">{item.name}</span>
                                        <span className="text-muted block text-xs">{item.size} | {item.color} | x{item.quantity}</span>
                                    </div>
                                    <span className="font-mono">₹{(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                            ))}
                        </div>

                        {/* Coupon Section */}
                        <div className="mb-8 pt-6 border-t border-border/50">
                            <label className="block text-[10px] uppercase tracking-widest text-muted mb-2 font-black">Promo Code</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={couponCode}
                                    onChange={e => setCouponCode(e.target.value.toUpperCase())}
                                    placeholder="ENTER CODE"
                                    className="flex-1 bg-background border border-border p-2 rounded text-sm outline-none focus:border-accent font-mono"
                                    disabled={!!appliedCoupon}
                                />
                                {appliedCoupon ? (
                                    <button onClick={removeCoupon} className="px-4 py-2 text-xs font-bold text-red-500 hover:bg-red-500/10 rounded border border-red-500/20 transition-colors">
                                        Remove
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleApplyCoupon}
                                        disabled={validatingCoupon || !couponCode}
                                        className="px-4 py-2 bg-foreground text-background text-xs font-bold rounded hover:bg-accent hover:text-white transition-colors disabled:opacity-50"
                                    >
                                        {validatingCoupon ? <Loader2 className="animate-spin" size={14} /> : "Apply"}
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="space-y-3 pt-6 border-t border-border">
                            <div className="flex justify-between text-sm text-muted">
                                <span>Subtotal</span>
                                <span className="font-mono">₹{subtotal().toFixed(2)}</span>
                            </div>
                            {appliedCoupon && (
                                <div className="flex justify-between text-sm text-green-500">
                                    <span>Discount ({appliedCoupon.code})</span>
                                    <span className="font-mono">-₹{(subtotal() - total()).toFixed(2)}</span>
                                </div>
                            )}
                            <div className="flex justify-between text-xl font-bold pt-4">
                                <span>Total</span>
                                <span className="text-accent font-mono">₹{total().toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
