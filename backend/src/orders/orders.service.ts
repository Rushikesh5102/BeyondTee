import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaService } from '../prisma.service';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) { }

  async create(createOrderDto: CreateOrderDto) {
    try {
      return await this.prisma.$transaction(async (tx) => {
        // 1. Ensure User Exists
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

        // 2. Create Shipping Address
        let addressId = createOrderDto.shippingAddressId;

        if (createOrderDto.shippingAddress) {
          const newAddress = await tx.address.create({
            data: {
              street: createOrderDto.shippingAddress.street,
              city: createOrderDto.shippingAddress.city || "Mumbai",
              state: createOrderDto.shippingAddress.state || "MH",
              zip: createOrderDto.shippingAddress.zip || "400001",
              country: createOrderDto.shippingAddress.country || "India",
              userId: user.id
            }
          });
          addressId = newAddress.id;
        } else if (!addressId) {
          // Fallback if neither ID nor Object provided (Backwards compat / Hard fallback)
          const fallbackAddr = await tx.address.create({
            data: {
              street: "123 Test St",
              city: "Mumbai",
              state: "MH",
              zip: "400001",
              country: "India",
              userId: user.id
            }
          });
          addressId = fallbackAddr.id;
        }

        // 3. Prepare Order Items
        const orderItemsData = await Promise.all(
          createOrderDto.items.map(async (item) => {
            let designId: string | null = null;
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
          })
        );

        // 4. Create Order linked to User and Address
        const order = await tx.order.create({
          data: {
            userId: user.id,
            totalAmount: createOrderDto.totalAmount,
            shippingAddressId: addressId,
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
    } catch (e) {
      console.error("Order Create Error:", e);
      throw e;
    }
  }

  async getStats() {
    const totalOrders = await this.prisma.order.count();
    const totalRevenueAgg = await this.prisma.order.aggregate({
      _sum: { totalAmount: true }
    });
    const totalRevenue = totalRevenueAgg._sum.totalAmount || 0;

    const recentOrders = await this.prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { user: true }
    });

    // Low stock products
    const lowStockProducts = await this.prisma.product.findMany({
      where: { stock: { lt: 10 } },
      take: 5,
      select: { id: true, name: true, stock: true }
    });

    return {
      totalOrders,
      totalRevenue,
      recentOrders,
      lowStockProducts
    };
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
        shippingAddress: true,
      },
      orderBy: { createdAt: 'desc' }
    });

    return orders.map(order => this.transformOrder(order));
  }

  async findMyOrders(userId: string) {
    const orders = await this.prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
            design: true,
          },
        },
        shippingAddress: true,
      },
      orderBy: { createdAt: 'desc' }
    });

    return orders.map(order => this.transformOrder(order));
  }

  private transformOrder(order: any) {
    return {
      ...order,
      items: order.items.map(item => ({
        ...item,
        customizationData: item.customizationData ? JSON.parse(item.customizationData as string) : null,
        design: item.design ? {
          ...item.design,
          configuration: item.design.configuration ? JSON.parse(item.design.configuration as string) : null
        } : null
      }))
    };
  }

  async findOne(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        shippingAddress: true,
        items: {
          include: {
            product: true,
            design: true,
          },
        },
      },
    });

    if (!order) return null;

    return this.transformOrder(order);
  }

  update(id: string, updateOrderDto: UpdateOrderDto) {
    const { items, ...data } = updateOrderDto;
    return this.prisma.order.update({
      where: { id },
      data: data as any,
    });
  }

  remove(id: string) {
    return this.prisma.order.delete({
      where: { id },
    });
  }
}
