
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
    id: string;
    productId: string;
    name: string;
    price: number;
    size: string;
    color: string;
    quantity: number;
    previewImage?: string; // URL
    customizationData?: Record<string, unknown> | any[]; // The state from customizationStore
}

interface CartState {
    items: CartItem[];
    appliedCoupon: {
        code: string;
        discount: number;
        type: 'PERCENTAGE' | 'FIXED';
    } | null;
    addItem: (item: CartItem) => void;
    removeItem: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
    total: () => number;
    subtotal: () => number;
    applyCoupon: (coupon: CartState['appliedCoupon']) => void;
    removeCoupon: () => void;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            appliedCoupon: null,
            addItem: (item) => set((state) => {
                const existing = state.items.find((i) => i.id === item.id);
                if (existing) {
                    return {
                        items: state.items.map((i) =>
                            i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
                        ),
                    };
                }
                return { items: [...state.items, { ...item, quantity: item.quantity || 1 }] };
            }),
            removeItem: (id) => set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
            updateQuantity: (id, quantity) => set((state) => ({
                items: state.items.map((i) => i.id === id ? { ...i, quantity: Math.max(1, quantity) } : i)
            })),
            clearCart: () => set({ items: [], appliedCoupon: null }),
            subtotal: () => get().items.reduce((acc, item) => acc + (item.price * (item.quantity || 1)), 0),
            total: () => {
                const subTotal = get().subtotal();
                const coupon = get().appliedCoupon;
                if (!coupon) return subTotal;

                if (coupon.type === 'PERCENTAGE') {
                    return subTotal * (1 - coupon.discount / 100);
                } else {
                    return Math.max(0, subTotal - coupon.discount);
                }
            },
            applyCoupon: (coupon) => set({ appliedCoupon: coupon }),
            removeCoupon: () => set({ appliedCoupon: null }),
        }),
        {
            name: 'beyondtee-cart',
        }
    )
);
