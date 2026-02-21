import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(createProductDto: any) {
    return this.prisma.product.create({
      data: {
        ...createProductDto,
        images: JSON.stringify(createProductDto.images || []),
      },
    });
  }

  async findAll() {
    const products = await this.prisma.product.findMany();
    return products.map((p) => ({
      ...p,
      images: JSON.parse((p.images as unknown as string) || '[]'),
    }));
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });
    if (product) {
      return {
        ...product,
        images: JSON.parse((product.images as unknown as string) || '[]'),
      };
    }
    return null;
  }

  update(id: string, updateProductDto: any) {
    const data = { ...updateProductDto };
    if (data.images) {
      data.images = JSON.stringify(data.images);
    }
    return this.prisma.product.update({
      where: { id },
      data: data,
    });
  }

  remove(id: string) {
    return this.prisma.product.delete({
      where: { id },
    });
  }
}
