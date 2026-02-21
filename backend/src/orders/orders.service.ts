/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-argument */
import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaService } from '../prisma.service';

import { EmailService } from '../email/email.service';

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    try {
      console.log(
        'Creating Order with payload:',
        JSON.stringify(createOrderDto, null, 2),
      );

      return await this.prisma.$transaction(async (tx) => {
        // ... (existing user/address logic) ...
        // 1. Ensure User Exists
        let user = await tx.user.findUnique({
          where: { id: createOrderDto.userId },
        });
        if (!user) {
          console.log(
            `User ${createOrderDto.userId} not found, creating guest user.`,
          );
          user = await tx.user.create({
            data: {
              id: createOrderDto.userId,
              email:
                createOrderDto.customerEmail ||
                `guest-${Date.now()}@example.com`,
              name: createOrderDto.customerName || 'Guest User',
              password: 'guest-password-placeholder', // Needs a dummy password
            },
          });
        }

        // 2. Create Shipping Address
        let addressId = createOrderDto.shippingAddressId;

        if (createOrderDto.shippingAddress) {
          console.log('Creating new shipping address...');
          const newAddress = await tx.address.create({
            data: {
              street: createOrderDto.shippingAddress.street,
              city: createOrderDto.shippingAddress.city || 'Mumbai',
              state: createOrderDto.shippingAddress.state || 'MH',
              zip: createOrderDto.shippingAddress.zip || '400001',
              country: createOrderDto.shippingAddress.country || 'India',
              userId: user.id,
            },
          });
          addressId = newAddress.id;
        } else if (!addressId) {
          // Fallback
          console.log('No address provided, using fallback.');
          const fallbackAddr = await tx.address.create({
            data: {
              street: '123 Test St',
              city: 'Mumbai',
              state: 'MH',
              zip: '400001',
              country: 'India',
              userId: user.id,
            },
          });
          addressId = fallbackAddr.id;
        }

        // 3. Prepare Order Items
        const orderItemsData = await Promise.all(
          createOrderDto.items.map(async (item) => {
            let designId: string | null = null;
            if (
              item.customizationData &&
              Object.keys(item.customizationData).length > 0
            ) {
              const design = await tx.design.create({
                data: {
                  userId: user.id,
                  configuration:
                    typeof item.customizationData === 'string'
                      ? item.customizationData
                      : JSON.stringify(item.customizationData),
                  name: 'Custom Order Design',
                },
              });
              designId = design.id;
            }

            return {
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
              size: item.size || 'L', // Default to L if missing
              color: item.color || '#000000',
              designId: designId,
              customizationData: item.customizationData
                ? typeof item.customizationData === 'string'
                  ? item.customizationData
                  : JSON.stringify(item.customizationData)
                : null,
            };
          }),
        );

        // 4. Create Order linked to User and Address
        console.log('Finalizing order creation...');
        const order = await tx.order.create({
          data: {
            userId: user.id,
            totalAmount: createOrderDto.totalAmount,
            shippingAddressId: addressId,
            couponCode: createOrderDto.couponCode,
            items: {
              create: orderItemsData,
            },
          },
          include: {
            items: true,
          },
        });
        console.log('Order created successfully:', order.id);

        // 5. Send Email Confirmation (Non-blocking)
        if (
          user.email &&
          !user.email.startsWith('guest-') &&
          user.email.includes('@')
        ) {
          void this.emailService.sendOrderConfirmation(
            user.email,
            order.id,
            createOrderDto.totalAmount,
            createOrderDto.items,
          );
        } else if (createOrderDto.customerEmail) {
          void this.emailService.sendOrderConfirmation(
            createOrderDto.customerEmail,
            order.id,
            createOrderDto.totalAmount,
            createOrderDto.items,
          );
        }

        return order;
      });
    } catch (e) {
      console.error('Order Create Critical Error:', e);
      throw e; // NestJS will handle the response, but now we have logs.
    }
  }

  async getStats() {
    const totalOrders = await this.prisma.order.count();
    const totalRevenueAgg = await this.prisma.order.aggregate({
      _sum: { totalAmount: true },
    });
    const totalRevenue = totalRevenueAgg._sum.totalAmount || 0;

    const recentOrders = await this.prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { user: true },
    });

    // Low stock products
    const lowStockProducts = await this.prisma.product.findMany({
      where: { stock: { lt: 10 } },
      take: 5,
      select: { id: true, name: true, stock: true },
    });

    return {
      totalOrders,
      totalRevenue,
      recentOrders,
      lowStockProducts,
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
      orderBy: { createdAt: 'desc' },
    });

    return orders.map((order) => this.transformOrder(order));
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
      orderBy: { createdAt: 'desc' },
    });

    return orders.map((order) => this.transformOrder(order));
  }

  private transformOrder(order: any) {
    return {
      ...order,
      items: order.items.map((item) => ({
        ...item,
        customizationData: item.customizationData
          ? JSON.parse(item.customizationData as string)
          : null,
        design: item.design
          ? {
              ...item.design,
              configuration: item.design.configuration
                ? JSON.parse(item.design.configuration as string)
                : null,
            }
          : null,
      })),
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
