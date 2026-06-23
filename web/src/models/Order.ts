

export interface IOrder {
    id?: string;
    _id: string; // MongoDB/Prisma distinction
    userId: string;
    customerName?: string;
    customerEmail?: string;
    shippingAddress?: {
        street: string;
        city: string;
        state: string;
        zip: string;
        country: string;
    };
    items: Array<{
        productId: string;
        product: {
            name: string;
            images: string[] | string;
        };
        quantity: number;
        size?: string;
        color?: string;
        price: number;
        customizationData?: string | Record<string, unknown> | any[]; // JSON string or object
    }>;
    totalAmount: number;
    status: string;
    createdAt: string;
}
