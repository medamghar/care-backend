import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PromotionsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.promotion.findMany({
      include: {
        promotionProducts: {
          include: {
            product: {
              select: {
                id: true,
                nameAr: true,
                nameFr: true,
                sku: true,
              },
            },
          },
        },
        promotionCategories: {
          include: {
            category: {
              select: {
                id: true,
                nameAr: true,
                nameFr: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const promotion = await this.prisma.promotion.findUnique({
      where: { id },
      include: {
        promotionProducts: {
          include: {
            product: true,
          },
        },
        promotionCategories: {
          include: {
            category: true,
          },
        },
      },
    });

    if (!promotion) {
      throw new NotFoundException('Promotion not found');
    }

    return promotion;
  }

  async create(data: {
    name: string;
    type: 'PERCENTAGE' | 'FIXED';
    value: number;
    startDate: Date;
    endDate: Date;
    productIds?: string[];
    categoryIds?: string[];
  }) {
    return this.prisma.promotion.create({
      data: {
        name: data.name,
        type: data.type,
        value: data.value,
        startDate: data.startDate,
        endDate: data.endDate,
        promotionProducts: data.productIds
          ? {
              create: data.productIds.map((productId) => ({ productId })),
            }
          : undefined,
        promotionCategories: data.categoryIds
          ? {
              create: data.categoryIds.map((categoryId) => ({ categoryId })),
            }
          : undefined,
      },
      include: {
        promotionProducts: {
          include: { product: true },
        },
        promotionCategories: {
          include: { category: true },
        },
      },
    });
  }

  async update(
    id: string,
    data: {
      name?: string;
      type?: 'PERCENTAGE' | 'FIXED';
      value?: number;
      startDate?: Date;
      endDate?: Date;
      isActive?: boolean;
    },
  ) {
    return this.prisma.promotion.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    return this.prisma.promotion.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async getActivePromotions() {
    const now = new Date();
    return this.prisma.promotion.findMany({
      where: {
        isActive: true,
        startDate: { lte: now },
        endDate: { gte: now },
      },
      include: {
        promotionProducts: {
          include: {
            product: {
              include: {
                images: {
                  where: { isPrimary: true },
                  take: 1,
                },
              },
            },
          },
        },
        promotionCategories: {
          include: {
            category: true,
          },
        },
      },
    });
  }

  async getSliders() {
    return this.prisma.slider.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async createSlider(data: {
    imageUrl: string;
    linkUrl?: string;
    sortOrder?: number;
  }) {
    return this.prisma.slider.create({
      data: {
        imageUrl: data.imageUrl,
        linkUrl: data.linkUrl,
        sortOrder: data.sortOrder || 0,
      },
    });
  }

  async updateSlider(
    id: string,
    data: {
      imageUrl?: string;
      linkUrl?: string;
      sortOrder?: number;
      isActive?: boolean;
    },
  ) {
    return this.prisma.slider.update({
      where: { id },
      data,
    });
  }

  async removeSlider(id: string) {
    return this.prisma.slider.delete({
      where: { id },
    });
  }
}
