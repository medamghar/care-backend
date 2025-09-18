import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BrandsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.brand.findMany({
      where: { isActive: true },
      include: {
        _count: {
          select: { products: true },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.brand.findUnique({
      where: { id },
      include: {
        products: {
          where: { isActive: true },
          take: 10,
          include: {
            category: true,
            images: {
              where: { isPrimary: true },
              take: 1,
            },
          },
        },
      },
    });
  }

  async create(data: { name: string; logoUrl: string }) {
    return this.prisma.brand.create({
      data,
    });
  }

  async update(
    id: string,
    data: { name?: string; logoUrl?: string; isActive?: boolean },
  ) {
    return this.prisma.brand.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    return this.prisma.brand.update({
      where: { id },
      data: { isActive: false },
    });
  }
}
