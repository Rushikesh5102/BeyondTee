"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
let OrdersService = class OrdersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createOrderDto) {
        try {
            return await this.prisma.$transaction(async (tx) => {
                let user = await tx.user.findUnique({ where: { id: createOrderDto.userId } });
                if (!user) {
                    user = await tx.user.create({
                        data: {
                            id: createOrderDto.userId,
                            email: `guest-${Date.now()}@example.com`,
                            password: 'guest',
                            name: 'Guest User'
                        }
                    });
                }
                const address = await tx.address.create({
                    data: {
                        street: "123 Test St",
                        city: "Mumbai",
                        state: "MH",
                        zip: "400001",
                        country: "India",
                        userId: user.id
                    }
                });
                const orderItemsData = await Promise.all(createOrderDto.items.map(async (item) => {
                    let designId = null;
                    if (item.customizationData) {
                        const design = await tx.design.create({
                            data: {
                                userId: user.id,
                                configuration: typeof item.customizationData === 'string' ? item.customizationData : JSON.stringify(item.customizationData),
                                name: 'Custom Order Design',
                            },
                        });
                        designId = design.id;
                    }
                    return {
                        productId: item.productId,
                        quantity: item.quantity,
                        price: item.price,
                        size: item.size,
                        color: item.color,
                        designId: designId,
                        customizationData: item.customizationData ? (typeof item.customizationData === 'string' ? item.customizationData : JSON.stringify(item.customizationData)) : null,
                    };
                }));
                const order = await tx.order.create({
                    data: {
                        userId: user.id,
                        totalAmount: createOrderDto.totalAmount,
                        shippingAddressId: address.id,
                        items: {
                            create: orderItemsData
                        }
                    },
                    include: {
                        items: true,
                    },
                });
                return order;
            });
        }
        catch (e) {
            console.error("Order Create Error:", e);
            throw e;
        }
    }
    async findAll() {
        const orders = await this.prisma.order.findMany({
            include: {
                items: {
                    include: {
                        product: true,
                        design: true,
                    },
                },
                user: true,
            },
        });
        return orders.map(order => ({
            ...order,
            items: order.items.map(item => ({
                ...item,
                customizationData: item.customizationData ? JSON.parse(item.customizationData) : null,
                design: item.design ? {
                    ...item.design,
                    configuration: item.design.configuration ? JSON.parse(item.design.configuration) : null
                } : null
            }))
        }));
    }
    async findOne(id) {
        const order = await this.prisma.order.findUnique({
            where: { id },
            include: {
                items: {
                    include: {
                        product: true,
                        design: true,
                    },
                },
            },
        });
        if (!order)
            return null;
        return {
            ...order,
            items: order.items.map(item => ({
                ...item,
                customizationData: item.customizationData ? JSON.parse(item.customizationData) : null,
                design: item.design ? {
                    ...item.design,
                    configuration: item.design.configuration ? JSON.parse(item.design.configuration) : null
                } : null
            }))
        };
    }
    update(id, updateOrderDto) {
        const { items, ...data } = updateOrderDto;
        return this.prisma.order.update({
            where: { id },
            data: data,
        });
    }
    remove(id) {
        return this.prisma.order.delete({
            where: { id },
        });
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map