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
exports.ShopsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const bcrypt = require("bcrypt");
const images_service_1 = require("../images/images.service");
let ShopsService = class ShopsService {
    constructor(prisma, imageService) {
        this.prisma = prisma;
        this.imageService = imageService;
        this.baseUrl = process.env.BASE_URL || 'http://192.168.1.47:3000';
    }
    async findById(id) {
        const shop = await this.prisma.shop.findUnique({
            where: { id },
            include: {
                shopImages: {
                    orderBy: { sortOrder: 'asc' },
                },
            },
        });
        if (!shop) {
            throw new common_1.NotFoundException('Shop not found');
        }
        return shop;
    }
    async findByPhone(phone) {
        return this.prisma.shop.findUnique({
            where: { phone },
        });
    }
    async findAll(filters) {
        const where = {};
        if (filters) {
            if (filters.search) {
                where.OR = [
                    { nameAr: { contains: filters.search, mode: 'insensitive' } },
                    { nameFr: { contains: filters.search, mode: 'insensitive' } },
                    { ownerName: { contains: filters.search, mode: 'insensitive' } },
                    { phone: { contains: filters.search, mode: 'insensitive' } },
                ];
            }
            if (filters.city) {
                where.city = { contains: filters.city, mode: 'insensitive' };
            }
            if (filters.status) {
                where.status = filters.status;
            }
            if (filters.ownerName) {
                where.ownerName = { contains: filters.ownerName, mode: 'insensitive' };
            }
        }
        const shops = await this.prisma.shop.findMany({
            where,
            include: {
                shopImages: {
                    orderBy: { sortOrder: 'asc' },
                },
                orders: {
                    orderBy: { createdAt: 'desc' },
                    take: 1,
                    select: {
                        createdAt: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        return shops.map(shop => ({
            ...shop,
            lastOrder: shop.orders.length > 0 ? shop.orders[0].createdAt.toISOString() : null,
            orders: undefined,
        }));
    }
    async findPendingShops() {
        const shops = await this.prisma.shop.findMany({
            where: {
                status: 'PENDING',
            },
            include: {
                shopImages: {
                    orderBy: { sortOrder: 'asc' },
                },
                orders: {
                    orderBy: { createdAt: 'desc' },
                    take: 1,
                    select: {
                        createdAt: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        return shops.map(shop => ({
            ...shop,
            lastOrder: shop.orders.length > 0 ? shop.orders[0].createdAt.toISOString() : null,
            orders: undefined,
        }));
    }
    async getShopStats() {
        const totalShops = await this.prisma.shop.count();
        const activeShops = await this.prisma.shop.count({
            where: { status: 'APPROVED' },
        });
        const pendingApprovals = await this.prisma.shop.count({
            where: { status: 'PENDING' },
        });
        const blockedShops = await this.prisma.shop.count({
            where: { status: 'BLOCKED' },
        });
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const newShopsThisMonth = await this.prisma.shop.count({
            where: {
                createdAt: {
                    gte: startOfMonth,
                },
            },
        });
        return {
            totalShops,
            activeShops,
            pendingApprovals,
            blockedShops,
            newShopsThisMonth,
        };
    }
    async updatePassword(id, input) {
        const shop = await this.findById(id);
        const isOldPasswordValid = await bcrypt.compare(input.oldPassword, shop.passwordHash);
        if (!isOldPasswordValid) {
            throw new common_1.UnauthorizedException('Current password is incorrect');
        }
        const hashedNewPassword = await bcrypt.hash(input.newPassword, 10);
        const updatedShop = await this.prisma.shop.update({
            where: { id },
            data: {
                passwordHash: hashedNewPassword,
                updatedAt: new Date(),
            },
        });
        return updatedShop;
    }
    async updateStatus(id, status, approvedByUserId) {
        await this.findById(id);
        const updatedShop = await this.prisma.shop.update({
            where: { id },
            data: {
                status,
                approvedByUserId: status === 'APPROVED' ? approvedByUserId : null,
                updatedAt: new Date(),
            },
        });
        return updatedShop;
    }
    async delete(id) {
        try {
            await this.findById(id);
            await this.prisma.shop.delete({
                where: { id },
            });
            return true;
        }
        catch {
            return false;
        }
    }
    async findShopImages(shopId) {
        return this.prisma.shopImage.findMany({
            where: { shopId },
            orderBy: { sortOrder: 'asc' },
        });
    }
    async addShopImage(input) {
        const { shopId, imageUrl, sortOrder = 0 } = input;
        await this.findById(shopId);
        return this.prisma.shopImage.create({
            data: {
                shopId,
                imageUrl,
                sortOrder,
            },
        });
    }
    async updateShopImage(id, input) {
        const existingImage = await this.prisma.shopImage.findUnique({
            where: { id },
        });
        if (!existingImage) {
            throw new common_1.NotFoundException('Shop image not found');
        }
        return this.prisma.shopImage.update({
            where: { id },
            data: input,
        });
    }
    async deleteShopImage(id) {
        try {
            const existingImage = await this.prisma.shopImage.findUnique({
                where: { id },
            });
            if (!existingImage) {
                throw new common_1.NotFoundException('Shop image not found');
            }
            await this.prisma.shopImage.delete({
                where: { id },
            });
            return true;
        }
        catch {
            return false;
        }
    }
    async createShop(input, createdByUserId) {
        const { password, ...shopData } = input;
        const existingShop = await this.prisma.shop.findUnique({
            where: { phone: input.phone },
        });
        if (existingShop) {
            throw new common_1.ConflictException('Phone number already registered');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const shop = await this.prisma.shop.create({
            data: {
                ...shopData,
                passwordHash: hashedPassword,
                status: 'APPROVED',
                createdByUserId,
                approvedByUserId: createdByUserId,
            },
            include: {
                shopImages: {
                    orderBy: { sortOrder: 'asc' },
                },
            },
        });
        return shop;
    }
    async update(id, input, image) {
        await this.findById(id);
        console.log('New images promise received:', image);
        const updatedShop = await this.prisma.shop.update({
            where: { id },
            data: {
                ...input,
                updatedAt: new Date(),
            },
        });
        if (image) {
            try {
                const resolvedImages = await image;
                console.log('Resolved images:', resolvedImages);
                if (!Array.isArray(resolvedImages)) {
                    throw new common_1.BadRequestException('Invalid image data: expected array of files');
                }
                if (resolvedImages.length > 0) {
                    for (let i = 0; i < resolvedImages.length; i++) {
                        const upload = resolvedImages[i];
                        if (!upload || typeof upload !== 'object') {
                            throw new common_1.BadRequestException(`Invalid file upload at index ${i}: expected FileUpload object`);
                        }
                    }
                    const filePromises = resolvedImages.map(upload => Promise.resolve(upload));
                    const uploadedImages = await this.imageService.uploadMultipleImages(filePromises);
                    if (uploadedImages && uploadedImages.length > 0) {
                        await this.prisma.shopImage.deleteMany({
                            where: { shopId: id },
                        });
                        const newImages = await this.prisma.shopImage.createMany({
                            data: uploadedImages.map((img, index) => ({
                                shopId: id,
                                imageUrl: img.url.startsWith('http') ? img.url : `${this.baseUrl}${img.url}`,
                                sortOrder: index,
                            })),
                        });
                        console.log('New images created:', uploadedImages);
                        if (!newImages) {
                            throw new common_1.NotFoundException('Shop images not updated');
                        }
                    }
                }
            }
            catch (error) {
                if (error instanceof common_1.BadRequestException || error instanceof common_1.NotFoundException) {
                    throw error;
                }
                if (error.name === 'TypeError' && error.message.includes('Promise')) {
                    throw new common_1.BadRequestException('Failed to resolve image promise: invalid promise provided');
                }
                if (error.name === 'SyntaxError' || error.message.includes('parse')) {
                    throw new common_1.BadRequestException(`Image data parsing failed: ${error.message}`);
                }
                if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
                    throw new common_1.BadRequestException('Image upload service unavailable');
                }
                console.error('Unexpected error in image processing:', error);
                throw new common_1.BadRequestException(`Image processing failed: ${error.message || 'Unknown error'}`);
            }
        }
        return updatedShop;
    }
};
exports.ShopsService = ShopsService;
exports.ShopsService = ShopsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, images_service_1.ImageService])
], ShopsService);
//# sourceMappingURL=shops.service.js.map