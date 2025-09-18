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
exports.PromotionsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let PromotionsService = class PromotionsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
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
    async findOne(id) {
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
            throw new common_1.NotFoundException('Promotion not found');
        }
        return promotion;
    }
    async create(data) {
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
    async update(id, data) {
        return this.prisma.promotion.update({
            where: { id },
            data,
        });
    }
    async remove(id) {
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
    async createSlider(data) {
        return this.prisma.slider.create({
            data: {
                imageUrl: data.imageUrl,
                linkUrl: data.linkUrl,
                sortOrder: data.sortOrder || 0,
            },
        });
    }
    async updateSlider(id, data) {
        return this.prisma.slider.update({
            where: { id },
            data,
        });
    }
    async removeSlider(id) {
        return this.prisma.slider.delete({
            where: { id },
        });
    }
};
exports.PromotionsService = PromotionsService;
exports.PromotionsService = PromotionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PromotionsService);
//# sourceMappingURL=promotions.service.js.map