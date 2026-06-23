export interface IProduct {
    id?: string;
    _id: string; // Sticking to _id for frontend compatibility for now, though Postgres uses id
    name: string;
    description: string;
    price: number;
    sku: string;
    images: string[];
    category: string;
    stock: number;
    isCustomizable?: boolean;
    gender?: 'MEN' | 'WOMEN' | 'UNISEX';
    collection?: string;
    fit?: string;
    isFeatured?: boolean;
    fabricDetails?: string;
    careInstructions?: string;
    modelPath?: string;
}
