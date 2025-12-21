declare class CreateOrderItemDto {
    productId: string;
    quantity: number;
    price: number;
    size?: string;
    color?: string;
    customizationData?: any;
}
export declare class CreateOrderDto {
    userId: string;
    totalAmount: number;
    shippingAddressId: string;
    items: CreateOrderItemDto[];
}
export {};
