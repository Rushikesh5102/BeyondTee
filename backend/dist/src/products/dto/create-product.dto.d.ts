export declare class CreateProductDto {
    name: string;
    description: string;
    price: number;
    sku: string;
    images: string[];
    category: string;
    stock?: number;
    isCustomizable?: boolean;
}
