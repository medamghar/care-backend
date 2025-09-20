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
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const images_service_1 = require("../images/images.service");
const notification_service_1 = require("../notification/notification.service");
let ProductsService = class ProductsService {
    constructor(prisma, imageService, notificationService) {
        this.prisma = prisma;
        this.imageService = imageService;
        this.notificationService = notificationService;
        this.baseUrl = process.env.BASE_URL || 'http://192.168.1.47:3000';
        this.updatePriceTier = async (id, minQuantity, pricePerUnit) => {
            const existings = await this.prisma.priceTier.findUnique({ where: { id } });
            if (!existings) {
                return false;
            }
            const updating = await this.prisma.priceTier.update({
                where: { id },
                data: {
                    minQuantity,
                    pricePerUnit,
                },
            });
            return !!updating;
        };
        this.deletePriceTier = async (id) => {
            const existings = await this.prisma.priceTier.findUnique({ where: { id } });
            if (!existings) {
                return false;
            }
            const updating = await this.prisma.priceTier.delete({
                where: { id },
            });
            if (!updating) {
                return false;
            }
            return true;
        };
    }
    async createProduct(input, images) {
        const { sku, nameAr, nameFr, categoryId, brandId, basePrice, ...productData } = input;
        const existingSku = await this.prisma.product.findUnique({
            where: { sku },
        });
        if (existingSku) {
            throw new common_1.ConflictException('SKU already exists');
        }
        const category = await this.prisma.category.findUnique({
            where: { id: categoryId },
        });
        if (!category) {
            throw new common_1.NotFoundException('Category not found');
        }
        const brand = await this.prisma.brand.findUnique({
            where: { id: brandId },
        });
        if (!brand) {
            throw new common_1.NotFoundException('Brand not found');
        }
        const product = await this.prisma.product.create({
            data: {
                sku,
                nameAr,
                nameFr,
                categoryId,
                brandId,
                basePrice,
                ...productData,
            },
            include: {
                category: true,
                brand: true,
                images: {
                    orderBy: { sortOrder: 'asc' },
                },
                priceTiers: {
                    orderBy: { minQuantity: 'asc' },
                },
            },
        });
        if (images) {
            try {
                console.log('New images promise received:', images);
                const resolvedImages = await images;
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
                        const newImages = await this.prisma.productImage.createMany({
                            data: uploadedImages.map((img, index) => ({
                                productId: product.id,
                                imageUrl: img.url.startsWith('http') ? img.url : `${this.baseUrl}${img.url}`,
                                sortOrder: index,
                                isPrimary: index === 0,
                            })),
                        });
                        console.log('New product images created:', uploadedImages);
                        if (!newImages) {
                            throw new common_1.NotFoundException('Product images not created');
                        }
                        const productWithImages = await this.prisma.product.findUnique({
                            where: { id: product.id },
                            include: {
                                category: true,
                                brand: true,
                                images: {
                                    orderBy: { sortOrder: 'asc' },
                                },
                                priceTiers: {
                                    orderBy: { minQuantity: 'asc' },
                                },
                            },
                        });
                        return productWithImages;
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
                console.error('Unexpected error in product image processing:', error);
                await this.prisma.product.delete({
                    where: { id: product.id },
                });
                throw new common_1.BadRequestException(`Product creation failed due to image processing error: ${error.message || 'Unknown error'}`);
            }
        }
        return product;
    }
    async updateProduct(id, input) {
        const product = await this.prisma.product.findUnique({
            where: { id },
        });
        let currentQuantity;
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        if (product.currentStock === 0) {
            currentQuantity = 0;
        }
        const updatedProduct = await this.prisma.product.update({
            where: { id },
            data: input,
            include: {
                category: true,
                brand: true,
                images: {
                    orderBy: { sortOrder: 'asc' },
                },
                priceTiers: {
                    orderBy: { minQuantity: 'asc' },
                },
            },
        });
        if (updatedProduct.currentStock != 0 && currentQuantity === 0) {
            await this.notificationService.createBroadcastNotification('new products', 'sdkddsd', 'hdhdhdhhd', 'jjdsjsjdjsj');
        }
        return updatedProduct;
    }
    async deleteProduct(id) {
        const product = await this.prisma.product.findUnique({
            where: { id },
        });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        await this.prisma.product.delete({
            where: { id },
        });
        return true;
    }
    async getProduct(id) {
        const product = await this.prisma.product.findUnique({
            where: { id },
            include: {
                category: true,
                brand: true,
                images: {
                    orderBy: { sortOrder: 'asc' },
                },
                priceTiers: {
                    orderBy: { minQuantity: 'asc' },
                },
            },
        });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        return product;
    }
    async getProducts(filters) {
        const { search, categoryId, brandId, isFeatured, inStock, page = 1, limit = 20, } = filters;
        const skip = (page - 1) * limit;
        const where = {
            isActive: true,
        };
        if (search) {
            where.OR = [
                { nameAr: { contains: search, mode: 'insensitive' } },
                { nameFr: { contains: search, mode: 'insensitive' } },
                { sku: { contains: search, mode: 'insensitive' } },
            ];
        }
        if (categoryId) {
            where.categoryId = categoryId;
        }
        if (brandId) {
            where.brandId = brandId;
        }
        if (typeof isFeatured === 'boolean') {
            where.isFeatured = isFeatured;
        }
        if (inStock) {
            where.currentStock = { gt: 0 };
        }
        const [products, total] = await Promise.all([
            this.prisma.product.findMany({
                where,
                skip,
                take: limit,
                include: {
                    category: true,
                    brand: true,
                    images: {
                        where: { isPrimary: true },
                        take: 1,
                    },
                    priceTiers: {
                        orderBy: { minQuantity: 'asc' },
                        take: 1,
                    },
                },
                orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
            }),
            this.prisma.product.count({ where }),
        ]);
        return {
            products,
            total,
            page,
            limit,
            hasMore: skip + products.length < total,
        };
    }
    async getFeaturedProducts(limit = 10) {
        return this.prisma.product.findMany({
            where: {
                isActive: true,
                isFeatured: true,
                currentStock: { gt: 0 },
            },
            take: limit,
            include: {
                category: true,
                brand: true,
                images: {
                    where: { isPrimary: true },
                    take: 1,
                },
                priceTiers: {
                    orderBy: { minQuantity: 'asc' },
                    take: 1,
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async createCategory(input) {
        if (input.parentId) {
            const parentCategory = await this.prisma.category.findUnique({
                where: { id: input.parentId },
            });
            if (!parentCategory) {
                throw new common_1.NotFoundException('Parent category not found');
            }
        }
        return this.prisma.category.create({
            data: {
                nameAr: input.nameAr,
                nameFr: input.nameFr,
                imageUrl: input.imageUrl,
                parentId: input.parentId,
                sortOrder: input.sortOrder || 0,
            },
            include: {
                parent: true,
                children: true,
            },
        });
    }
    async getCategories() {
        return this.prisma.category.findMany({
            where: { isActive: true },
            include: {
                parent: true,
                children: {
                    where: { isActive: true },
                    orderBy: { sortOrder: 'asc' },
                },
                _count: {
                    select: { products: true },
                },
            },
            orderBy: { sortOrder: 'asc' },
        });
    }
    async getCategory(id) {
        const category = await this.prisma.category.findUnique({
            where: { id },
            include: {
                parent: true,
                children: {
                    where: { isActive: true },
                    orderBy: { sortOrder: 'asc' },
                },
                products: {
                    where: { isActive: true },
                    take: 10,
                    include: {
                        brand: true,
                        images: {
                            where: { isPrimary: true },
                            take: 1,
                        },
                    },
                },
            },
        });
        if (!category) {
            throw new common_1.NotFoundException('Category not found');
        }
        return category;
    }
    async createBrand(input) {
        const existingBrand = await this.prisma.brand.findUnique({
            where: { name: input.name },
        });
        if (existingBrand) {
            throw new common_1.BadRequestException('Brand with this name already exists');
        }
        return this.prisma.brand.create({
            data: {
                name: input.name,
                logoUrl: input.logoUrl,
            },
        });
    }
    async getBrands() {
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
    async getBrand(id) {
        const brand = await this.prisma.brand.findUnique({
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
        if (!brand) {
            throw new common_1.NotFoundException('Brand not found');
        }
        return brand;
    }
    async addProductImage(productId, imageUrl, isPrimary = false) {
        const product = await this.prisma.product.findUnique({
            where: { id: productId },
        });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        if (isPrimary) {
            await this.prisma.productImage.updateMany({
                where: { productId },
                data: { isPrimary: false },
            });
        }
        const lastImage = await this.prisma.productImage.findFirst({
            where: { productId },
            orderBy: { sortOrder: 'desc' },
        });
        return this.prisma.productImage.create({
            data: {
                productId,
                imageUrl,
                isPrimary,
                sortOrder: (lastImage?.sortOrder || 0) + 1,
            },
        });
    }
    async addPriceTier(productId, minQuantity, pricePerUnit) {
        const product = await this.prisma.product.findUnique({
            where: { id: productId },
        });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        return this.prisma.priceTier.create({
            data: {
                productId,
                minQuantity,
                pricePerUnit,
            },
        });
    }
    async searchProducts(query, limit = 20) {
        return this.prisma.product.findMany({
            where: {
                isActive: true,
                OR: [
                    { nameAr: { contains: query, mode: 'insensitive' } },
                    { nameFr: { contains: query, mode: 'insensitive' } },
                    { sku: { contains: query, mode: 'insensitive' } },
                    { descriptionAr: { contains: query, mode: 'insensitive' } },
                    { descriptionFr: { contains: query, mode: 'insensitive' } },
                ],
            },
            take: limit,
            include: {
                category: true,
                brand: true,
                images: {
                    where: { isPrimary: true },
                    take: 1,
                },
            },
            orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
        });
    }
    async updateStock(productId, quantity, operation = 'add') {
        const product = await this.prisma.product.findUnique({
            where: { id: productId },
        });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        const newStock = operation === 'add'
            ? product.currentStock + quantity
            : product.currentStock - quantity;
        if (newStock < 0) {
            throw new common_1.BadRequestException('Insufficient stock');
        }
        return this.prisma.product.update({
            where: { id: productId },
            data: { currentStock: newStock },
        });
    }
    async createMultipleProducts(input) {
        if (!input || input.length === 0) {
            throw new common_1.BadRequestException('At least one product is required');
        }
        const skus = input.map(product => product.sku);
        const duplicateSkus = skus.filter((sku, index) => skus.indexOf(sku) !== index);
        if (duplicateSkus.length > 0) {
            throw new common_1.BadRequestException(`Duplicate SKUs found in input: ${duplicateSkus.join(', ')}`);
        }
        const existingProducts = await this.prisma.product.findMany({
            where: {
                sku: {
                    in: skus
                }
            },
            select: {
                sku: true
            }
        });
        if (existingProducts.length > 0) {
            const existingSkus = existingProducts.map(p => p.sku);
            throw new common_1.ConflictException(`Products with following SKUs already exist: ${existingSkus.join(', ')}`);
        }
        const categoryIds = [...new Set(input.map(p => p.categoryId))];
        const brandIds = [...new Set(input.map(p => p.brandId))];
        const [existingCategories, existingBrands] = await Promise.all([
            this.prisma.category.findMany({
                where: {
                    id: {
                        in: categoryIds
                    }
                },
                select: {
                    id: true
                }
            }),
            this.prisma.brand.findMany({
                where: {
                    id: {
                        in: brandIds
                    }
                },
                select: {
                    id: true
                }
            })
        ]);
        const existingCategoryIds = existingCategories.map(c => c.id);
        const existingBrandIds = existingBrands.map(b => b.id);
        const invalidCategories = categoryIds.filter(id => !existingCategoryIds.includes(id));
        const invalidBrands = brandIds.filter(id => !existingBrandIds.includes(id));
        if (invalidCategories.length > 0) {
            throw new common_1.BadRequestException(`Invalid category IDs: ${invalidCategories.join(', ')}`);
        }
        if (invalidBrands.length > 0) {
            throw new common_1.BadRequestException(`Invalid brand IDs: ${invalidBrands.join(', ')}`);
        }
        return await this.prisma.$transaction(async (tx) => {
            const createdProducts = [];
            for (const productInput of input) {
                const product = await tx.product.create({
                    data: {
                        sku: productInput.sku,
                        nameAr: productInput.nameAr,
                        nameFr: productInput.nameFr,
                        descriptionAr: productInput.descriptionAr,
                        descriptionFr: productInput.descriptionFr,
                        categoryId: productInput.categoryId,
                        brandId: productInput.brandId,
                        basePrice: productInput.basePrice,
                        currentStock: productInput.currentStock,
                        isFeatured: productInput.isFeatured ?? false,
                        isActive: productInput.isActive ?? true,
                    },
                    include: {
                        category: true,
                        brand: true,
                        images: {
                            orderBy: {
                                sortOrder: 'asc'
                            }
                        },
                        priceTiers: {
                            orderBy: {
                                minQuantity: 'asc'
                            }
                        }
                    }
                });
                if (productInput.imageUrl) {
                    await tx.productImage.create({
                        data: {
                            productId: product.id,
                            imageUrl: productInput.imageUrl,
                            sortOrder: 0,
                            isPrimary: true
                        }
                    });
                }
                createdProducts.push(product);
            }
            return createdProducts;
        });
    }
    async createMultipleProductsBatch(input) {
        if (!input || input.length === 0) {
            throw new common_1.BadRequestException('At least one product is required');
        }
        const skus = input.map(product => product.sku);
        const duplicateSkus = skus.filter((sku, index) => skus.indexOf(sku) !== index);
        if (duplicateSkus.length > 0) {
            throw new common_1.BadRequestException(`Duplicate SKUs found in input: ${duplicateSkus.join(', ')}`);
        }
        const existingProducts = await this.prisma.product.findMany({
            where: { sku: { in: skus } },
            select: { sku: true }
        });
        if (existingProducts.length > 0) {
            const existingSkus = existingProducts.map(p => p.sku);
            throw new common_1.ConflictException(`Products with following SKUs already exist: ${existingSkus.join(', ')}`);
        }
        return await this.prisma.$transaction(async (tx) => {
            const productData = input.map(product => ({
                sku: product.sku,
                nameAr: product.nameAr,
                nameFr: product.nameFr,
                descriptionAr: product.descriptionAr,
                descriptionFr: product.descriptionFr,
                categoryId: product.categoryId,
                brandId: product.brandId,
                basePrice: product.basePrice,
                currentStock: product.currentStock,
                isFeatured: product.isFeatured ?? false,
                isActive: product.isActive ?? true,
            }));
            await tx.product.createMany({
                data: productData,
                skipDuplicates: true
            });
            const createdProducts = await tx.product.findMany({
                where: {
                    sku: { in: skus }
                },
                include: {
                    category: true,
                    brand: true,
                    images: {
                        orderBy: {
                            sortOrder: 'asc'
                        }
                    },
                    priceTiers: {
                        orderBy: {
                            minQuantity: 'asc'
                        }
                    }
                }
            });
            const imageData = [];
            for (let i = 0; i < input.length; i++) {
                const productInput = input[i];
                const createdProduct = createdProducts.find(p => p.sku === productInput.sku);
                if (productInput.imageUrl && createdProduct) {
                    imageData.push({
                        productId: createdProduct.id,
                        imageUrl: productInput.imageUrl,
                        sortOrder: 0,
                        isPrimary: true
                    });
                }
            }
            if (imageData.length > 0) {
                await tx.productImage.createMany({
                    data: imageData
                });
            }
            const finalProducts = await tx.product.findMany({
                where: {
                    sku: { in: skus }
                },
                include: {
                    category: true,
                    brand: true,
                    images: {
                        orderBy: {
                            sortOrder: 'asc'
                        }
                    },
                    priceTiers: {
                        orderBy: {
                            minQuantity: 'asc'
                        }
                    }
                }
            });
            return {
                count: finalProducts.length,
                products: finalProducts
            };
        });
    }
    async validateReferences(categoryIds, brandIds) {
        const [existingCategories, existingBrands] = await Promise.all([
            this.prisma.category.findMany({
                where: { id: { in: categoryIds } },
                select: { id: true }
            }),
            this.prisma.brand.findMany({
                where: { id: { in: brandIds } },
                select: { id: true }
            })
        ]);
        const existingCategoryIds = existingCategories.map(c => c.id);
        const existingBrandIds = existingBrands.map(b => b.id);
        const invalidCategories = categoryIds.filter(id => !existingCategoryIds.includes(id));
        const invalidBrands = brandIds.filter(id => !existingBrandIds.includes(id));
        if (invalidCategories.length > 0) {
            throw new common_1.BadRequestException(`Invalid category IDs: ${invalidCategories.join(', ')}`);
        }
        if (invalidBrands.length > 0) {
            throw new common_1.BadRequestException(`Invalid brand IDs: ${invalidBrands.join(', ')}`);
        }
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        images_service_1.ImageService,
        notification_service_1.NotificationService])
], ProductsService);
//# sourceMappingURL=products.service.js.map