import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    create(createProductDto: CreateProductDto): Promise<{
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
    }>;
    findAll(): Promise<{
        images: any;
        category: string;
        id: string;
        sku: string;
        name: string;
        description: string;
        price: number;
        stock: number;
        modelPath: string | null;
        isCustomizable: boolean;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findOne(id: string): Promise<{
        images: any;
        category: string;
        id: string;
        sku: string;
        name: string;
        description: string;
        price: number;
        stock: number;
        modelPath: string | null;
        isCustomizable: boolean;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    update(id: string, updateProductDto: UpdateProductDto): import(".prisma/client").Prisma.Prisma__ProductClient<{
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
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    remove(id: string): import(".prisma/client").Prisma.Prisma__ProductClient<{
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
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
}
