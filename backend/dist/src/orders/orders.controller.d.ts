import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    create(createOrderDto: CreateOrderDto): Promise<{
        items: {
            id: string;
            price: number;
            quantity: number;
            size: string | null;
            color: string | null;
            customizationData: string | null;
            productId: string;
            designId: string | null;
            orderId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        totalAmount: number;
        status: string;
        paymentIntentId: string | null;
        userId: string;
        shippingAddressId: string;
    }>;
    findAll(): Promise<{
        items: {
            customizationData: any;
            design: {
                configuration: any;
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                userId: string;
            } | null;
            product: {
                category: string;
                id: string;
                sku: string;
                name: string;
                description: string;
                price: number;
                stock: number;
                images: string;
                modelPath: string | null;
                isCustomizable: boolean;
                createdAt: Date;
                updatedAt: Date;
            };
            id: string;
            price: number;
            quantity: number;
            size: string | null;
            color: string | null;
            productId: string;
            designId: string | null;
            orderId: string;
        }[];
        user: {
            id: string;
            name: string | null;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            password: string;
            role: string;
        };
        id: string;
        createdAt: Date;
        updatedAt: Date;
        totalAmount: number;
        status: string;
        paymentIntentId: string | null;
        userId: string;
        shippingAddressId: string;
    }[]>;
    findOne(id: string): Promise<{
        items: {
            customizationData: any;
            design: {
                configuration: any;
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                userId: string;
            } | null;
            product: {
                category: string;
                id: string;
                sku: string;
                name: string;
                description: string;
                price: number;
                stock: number;
                images: string;
                modelPath: string | null;
                isCustomizable: boolean;
                createdAt: Date;
                updatedAt: Date;
            };
            id: string;
            price: number;
            quantity: number;
            size: string | null;
            color: string | null;
            productId: string;
            designId: string | null;
            orderId: string;
        }[];
        id: string;
        createdAt: Date;
        updatedAt: Date;
        totalAmount: number;
        status: string;
        paymentIntentId: string | null;
        userId: string;
        shippingAddressId: string;
    } | null>;
    update(id: string, updateOrderDto: UpdateOrderDto): import(".prisma/client").Prisma.Prisma__OrderClient<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        totalAmount: number;
        status: string;
        paymentIntentId: string | null;
        userId: string;
        shippingAddressId: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    remove(id: string): import(".prisma/client").Prisma.Prisma__OrderClient<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        totalAmount: number;
        status: string;
        paymentIntentId: string | null;
        userId: string;
        shippingAddressId: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
}
