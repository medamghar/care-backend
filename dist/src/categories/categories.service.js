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
exports.CategoriesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let CategoriesService = class CategoriesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll() {
        try {
            const categories = await this.prisma.category.findMany({
                orderBy: [
                    { sortOrder: 'asc' },
                    { nameAr: 'asc' }
                ],
                include: {
                    parent: true,
                    children: {
                        orderBy: [
                            { sortOrder: 'asc' },
                            { nameAr: 'asc' }
                        ],
                        include: {
                            children: {
                                orderBy: [
                                    { sortOrder: 'asc' },
                                    { nameAr: 'asc' }
                                ]
                            }
                        }
                    }
                }
            });
            return categories.filter(category => !category.parentId);
        }
        catch (error) {
            throw new Error(`Failed to fetch categories: ${error.message}`);
        }
    }
    async findOne(id) {
        try {
            const category = await this.prisma.category.findUnique({
                where: { id },
                include: {
                    parent: true,
                    children: {
                        orderBy: [
                            { sortOrder: 'asc' },
                            { nameAr: 'asc' }
                        ],
                        include: {
                            children: {
                                orderBy: [
                                    { sortOrder: 'asc' },
                                    { nameAr: 'asc' }
                                ]
                            }
                        }
                    }
                }
            });
            if (!category) {
                throw new common_1.NotFoundException(`Category with ID ${id} not found`);
            }
            return category;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new Error(`Failed to fetch category: ${error.message}`);
        }
    }
    async create(input) {
        try {
            if (input.parentId) {
                const parentExists = await this.prisma.category.findUnique({
                    where: { id: input.parentId }
                });
                if (!parentExists) {
                    throw new common_1.BadRequestException(`Parent category with ID ${input.parentId} not found`);
                }
                const isCircular = await this.wouldCreateCircularReference(input.parentId, null);
                if (isCircular) {
                    throw new common_1.BadRequestException('Cannot create circular reference in category hierarchy');
                }
            }
            const category = await this.prisma.category.create({
                data: {
                    nameAr: input.nameAr,
                    nameFr: input.nameFr,
                    imageUrl: input.imageUrl,
                    parentId: input.parentId || null,
                    sortOrder: input.sortOrder || 0,
                    isActive: input.isActive ?? true,
                },
                include: {
                    parent: true,
                    children: {
                        orderBy: [
                            { sortOrder: 'asc' },
                            { nameAr: 'asc' }
                        ]
                    }
                }
            });
            return category;
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException) {
                throw error;
            }
            throw new Error(`Failed to create category: ${error.message}`);
        }
    }
    async update(id, input) {
        try {
            const existingCategory = await this.prisma.category.findUnique({
                where: { id }
            });
            if (!existingCategory) {
                throw new common_1.NotFoundException(`Category with ID ${id} not found`);
            }
            if (input.parentId !== undefined) {
                if (input.parentId) {
                    const parentExists = await this.prisma.category.findUnique({
                        where: { id: input.parentId }
                    });
                    if (!parentExists) {
                        throw new common_1.BadRequestException(`Parent category with ID ${input.parentId} not found`);
                    }
                    const isCircular = await this.wouldCreateCircularReference(input.parentId, id);
                    if (isCircular) {
                        throw new common_1.BadRequestException('Cannot create circular reference in category hierarchy');
                    }
                    if (input.parentId === id) {
                        throw new common_1.BadRequestException('Category cannot be its own parent');
                    }
                }
            }
            const updatedCategory = await this.prisma.category.update({
                where: { id },
                data: {
                    ...(input.nameAr !== undefined && { nameAr: input.nameAr }),
                    ...(input.nameFr !== undefined && { nameFr: input.nameFr }),
                    ...(input.imageUrl !== undefined && { imageUrl: input.imageUrl }),
                    ...(input.parentId !== undefined && { parentId: input.parentId || null }),
                    ...(input.sortOrder !== undefined && { sortOrder: input.sortOrder }),
                    ...(input.isActive !== undefined && { isActive: input.isActive }),
                },
                include: {
                    parent: true,
                    children: {
                        orderBy: [
                            { sortOrder: 'asc' },
                            { nameAr: 'asc' }
                        ]
                    }
                }
            });
            return updatedCategory;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException || error instanceof common_1.BadRequestException) {
                throw error;
            }
            throw new Error(`Failed to update category: ${error.message}`);
        }
    }
    async remove(id) {
        try {
            const existingCategory = await this.prisma.category.findUnique({
                where: { id },
                include: {
                    children: true
                }
            });
            if (!existingCategory) {
                throw new common_1.NotFoundException(`Category with ID ${id} not found`);
            }
            const productsCount = await this.prisma.product.count({
                where: { categoryId: id }
            });
            if (productsCount > 0) {
                throw new common_1.BadRequestException(`Cannot delete category: ${productsCount} products are assigned to this category`);
            }
            await this.deleteRecursive(id);
            return true;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException || error instanceof common_1.BadRequestException) {
                throw error;
            }
            throw new Error(`Failed to delete category: ${error.message}`);
        }
    }
    async findByParentId(parentId) {
        try {
            return await this.prisma.category.findMany({
                where: { parentId },
                orderBy: [
                    { sortOrder: 'asc' },
                    { nameAr: 'asc' }
                ],
                include: {
                    parent: true,
                    children: {
                        orderBy: [
                            { sortOrder: 'asc' },
                            { nameAr: 'asc' }
                        ]
                    }
                }
            });
        }
        catch (error) {
            throw new Error(`Failed to fetch categories by parent: ${error.message}`);
        }
    }
    async updateSortOrder(categoryId, newSortOrder) {
        try {
            const updatedCategory = await this.prisma.category.update({
                where: { id: categoryId },
                data: { sortOrder: newSortOrder },
                include: {
                    parent: true,
                    children: {
                        orderBy: [
                            { sortOrder: 'asc' },
                            { nameAr: 'asc' }
                        ]
                    }
                }
            });
            return updatedCategory;
        }
        catch (error) {
            throw new Error(`Failed to update sort order: ${error.message}`);
        }
    }
    async toggleActive(categoryId) {
        try {
            const category = await this.prisma.category.findUnique({
                where: { id: categoryId }
            });
            if (!category) {
                throw new common_1.NotFoundException(`Category with ID ${categoryId} not found`);
            }
            const updatedCategory = await this.prisma.category.update({
                where: { id: categoryId },
                data: { isActive: !category.isActive },
                include: {
                    parent: true,
                    children: {
                        orderBy: [
                            { sortOrder: 'asc' },
                            { nameAr: 'asc' }
                        ]
                    }
                }
            });
            return updatedCategory;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new Error(`Failed to toggle category status: ${error.message}`);
        }
    }
    async deleteRecursive(categoryId) {
        const children = await this.prisma.category.findMany({
            where: { parentId: categoryId }
        });
        for (const child of children) {
            await this.deleteRecursive(child.id);
        }
        await this.prisma.category.delete({
            where: { id: categoryId }
        });
    }
    async wouldCreateCircularReference(potentialParentId, categoryId) {
        if (!categoryId)
            return false;
        let currentParentId = potentialParentId;
        const visited = new Set();
        while (currentParentId) {
            if (visited.has(currentParentId)) {
                return true;
            }
            if (currentParentId === categoryId) {
                return true;
            }
            visited.add(currentParentId);
            const parent = await this.prisma.category.findUnique({
                where: { id: currentParentId },
                select: { parentId: true }
            });
            currentParentId = parent?.parentId || null;
        }
        return false;
    }
    async getCategoryPath(categoryId) {
        const path = [];
        let currentId = categoryId;
        while (currentId) {
            const category = await this.prisma.category.findUnique({
                where: { id: currentId },
                include: { parent: true }
            });
            if (!category)
                break;
            path.unshift(category);
            currentId = category.parentId;
        }
        return path;
    }
    async getCategoryDepth(categoryId) {
        const path = await this.getCategoryPath(categoryId);
        return path.length;
    }
    async getAllDescendants(categoryId) {
        const descendants = [];
        const getChildren = async (parentId) => {
            const children = await this.prisma.category.findMany({
                where: { parentId },
                include: { children: true }
            });
            for (const child of children) {
                descendants.push(child);
                await getChildren(child.id);
            }
        };
        await getChildren(categoryId);
        return descendants;
    }
};
exports.CategoriesService = CategoriesService;
exports.CategoriesService = CategoriesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CategoriesService);
//# sourceMappingURL=categories.service.js.map