import { Injectable } from '@nestjs/common';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { PrismaService } from '../prisma.service';

@Injectable()
export class CouponsService {

  constructor(private prisma: PrismaService) { }

  create(createCouponDto: CreateCouponDto) {
    return this.prisma.coupon.create({
      data: createCouponDto,
    });
  }

  findAll() {
    return this.prisma.coupon.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  findOne(id: string) {
    return this.prisma.coupon.findUnique({
      where: { id },
    });
  }

  update(id: string, updateCouponDto: UpdateCouponDto) {
    return this.prisma.coupon.update({
      where: { id },
      data: updateCouponDto,
    });
  }

  remove(id: string) {
    return this.prisma.coupon.delete({
      where: { id },
    });
  }
}
