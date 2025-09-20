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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var CategoriesResolver_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoriesResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const common_1 = require("@nestjs/common");
const categories_service_1 = require("./categories.service");
const category_dto_1 = require("./dto/category.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let CategoriesResolver = CategoriesResolver_1 = class CategoriesResolver {
    constructor(categoriesService) {
        this.categoriesService = categoriesService;
        this.logger = new common_1.Logger(CategoriesResolver_1.name);
    }
    async categories() {
        this.logger.log('Fetching all categories');
        return this.categoriesService.findAll();
    }
    async category(id) {
        this.logger.log(`Fetching category with ID: ${id}`);
        return this.categoriesService.findOne(id);
    }
    async categoriesByParent(parentId) {
        this.logger.log(`Fetching categories by parent ID: ${parentId}`);
        return this.categoriesService.findByParentId(parentId);
    }
    async categoryPath(id) {
        this.logger.log(`Fetching category path for ID: ${id}`);
        return this.categoriesService.getCategoryPath(id);
    }
    async categoryDepth(id) {
        this.logger.log(`Fetching category depth for ID: ${id}`);
        return this.categoriesService.getCategoryDepth(id);
    }
    async categoryDescendants(id) {
        this.logger.log(`Fetching category descendants for ID: ${id}`);
        return this.categoriesService.getAllDescendants(id);
    }
    async createCategory(input, context) {
        const user = context.req.user;
        this.logger.log(`User ${user.email || user.id} creating category: ${input.nameAr}`);
        return this.categoriesService.create(input);
    }
    async updateCategory(id, input, context) {
        const user = context.req.user;
        this.logger.log(`User ${user.email || user.id} updating category with ID: ${id}`);
        return this.categoriesService.update(id, input);
    }
    async deleteCategory(id, context) {
        const user = context.req.user;
        this.logger.log(`User ${user.email || user.id} deleting category with ID: ${id}`);
        return this.categoriesService.remove(id);
    }
    async updateCategorySortOrder(id, sortOrder, context) {
        const user = context.req.user;
        this.logger.log(`User ${user.email || user.id} updating sort order for category ${id} to ${sortOrder}`);
        return this.categoriesService.updateSortOrder(id, sortOrder);
    }
    async toggleCategoryActive(id, context) {
        const user = context.req.user;
        this.logger.log(`User ${user.email || user.id} toggling active status for category with ID: ${id}`);
        return this.categoriesService.toggleActive(id);
    }
    async parent(category) {
        if (!category.parentId)
            return null;
        if (category.parent)
            return category.parent;
        return this.categoriesService.findOne(category.parentId);
    }
    async children(category) {
        if (category.children)
            return category.children;
        return this.categoriesService.findByParentId(category.id);
    }
    async hasChildren(category) {
        if (category.children) {
            return category.children.length > 0;
        }
        const children = await this.categoriesService.findByParentId(category.id);
        return children.length > 0;
    }
    async childrenCount(category) {
        if (category.children) {
            return category.children.length;
        }
        const children = await this.categoriesService.findByParentId(category.id);
        return children.length;
    }
    async depth(category) {
        return this.categoriesService.getCategoryDepth(category.id);
    }
    async breadcrumb(category) {
        return this.categoriesService.getCategoryPath(category.id);
    }
    async descendants(category) {
        return this.categoriesService.getAllDescendants(category.id);
    }
    async totalDescendants(category) {
        const descendants = await this.categoriesService.getAllDescendants(category.id);
        return descendants.length;
    }
};
exports.CategoriesResolver = CategoriesResolver;
__decorate([
    (0, graphql_1.Query)(() => [category_dto_1.Category], {
        name: 'categories',
        description: 'Get all categories with hierarchical structure'
    }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CategoriesResolver.prototype, "categories", null);
__decorate([
    (0, graphql_1.Query)(() => category_dto_1.Category, {
        name: 'category',
        description: 'Get a specific category by ID'
    }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, graphql_1.Args)('id', { type: () => graphql_1.ID, description: 'Category ID' })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CategoriesResolver.prototype, "category", null);
__decorate([
    (0, graphql_1.Query)(() => [category_dto_1.Category], {
        name: 'categoriesByParent',
        description: 'Get categories by parent ID'
    }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, graphql_1.Args)('parentId', {
        type: () => graphql_1.ID,
        nullable: true,
        description: 'Parent category ID (null for root categories)'
    })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CategoriesResolver.prototype, "categoriesByParent", null);
__decorate([
    (0, graphql_1.Query)(() => [category_dto_1.Category], {
        name: 'categoryPath',
        description: 'Get the full path from root to category'
    }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, graphql_1.Args)('id', { type: () => graphql_1.ID, description: 'Category ID' })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CategoriesResolver.prototype, "categoryPath", null);
__decorate([
    (0, graphql_1.Query)(() => graphql_1.Int, {
        name: 'categoryDepth',
        description: 'Get the depth level of a category'
    }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, graphql_1.Args)('id', { type: () => graphql_1.ID, description: 'Category ID' })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CategoriesResolver.prototype, "categoryDepth", null);
__decorate([
    (0, graphql_1.Query)(() => [category_dto_1.Category], {
        name: 'categoryDescendants',
        description: 'Get all descendants of a category'
    }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, graphql_1.Args)('id', { type: () => graphql_1.ID, description: 'Category ID' })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CategoriesResolver.prototype, "categoryDescendants", null);
__decorate([
    (0, graphql_1.Mutation)(() => category_dto_1.Category, {
        name: 'createCategory',
        description: 'Create a new category'
    }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, graphql_1.Args)('input', { type: () => category_dto_1.CreateCategoryInput })),
    __param(1, (0, graphql_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [category_dto_1.CreateCategoryInput, Object]),
    __metadata("design:returntype", Promise)
], CategoriesResolver.prototype, "createCategory", null);
__decorate([
    (0, graphql_1.Mutation)(() => category_dto_1.Category, {
        name: 'updateCategory',
        description: 'Update an existing category'
    }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, graphql_1.Args)('id', { type: () => graphql_1.ID, description: 'Category ID' })),
    __param(1, (0, graphql_1.Args)('input', { type: () => category_dto_1.UpdateCategoryInput })),
    __param(2, (0, graphql_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, category_dto_1.UpdateCategoryInput, Object]),
    __metadata("design:returntype", Promise)
], CategoriesResolver.prototype, "updateCategory", null);
__decorate([
    (0, graphql_1.Mutation)(() => Boolean, {
        name: 'deleteCategory',
        description: 'Delete a category and all its subcategories'
    }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, graphql_1.Args)('id', { type: () => graphql_1.ID, description: 'Category ID' })),
    __param(1, (0, graphql_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CategoriesResolver.prototype, "deleteCategory", null);
__decorate([
    (0, graphql_1.Mutation)(() => category_dto_1.Category, {
        name: 'updateCategorySortOrder',
        description: 'Update the sort order of a category'
    }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, graphql_1.Args)('id', { type: () => graphql_1.ID, description: 'Category ID' })),
    __param(1, (0, graphql_1.Args)('sortOrder', { type: () => graphql_1.Int, description: 'New sort order' })),
    __param(2, (0, graphql_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Object]),
    __metadata("design:returntype", Promise)
], CategoriesResolver.prototype, "updateCategorySortOrder", null);
__decorate([
    (0, graphql_1.Mutation)(() => category_dto_1.Category, {
        name: 'toggleCategoryActive',
        description: 'Toggle the active status of a category'
    }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, graphql_1.Args)('id', { type: () => graphql_1.ID, description: 'Category ID' })),
    __param(1, (0, graphql_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CategoriesResolver.prototype, "toggleCategoryActive", null);
__decorate([
    (0, graphql_1.ResolveField)(() => category_dto_1.Category, { nullable: true }),
    __param(0, (0, graphql_1.Parent)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [category_dto_1.Category]),
    __metadata("design:returntype", Promise)
], CategoriesResolver.prototype, "parent", null);
__decorate([
    (0, graphql_1.ResolveField)(() => [category_dto_1.Category], { nullable: true }),
    __param(0, (0, graphql_1.Parent)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [category_dto_1.Category]),
    __metadata("design:returntype", Promise)
], CategoriesResolver.prototype, "children", null);
__decorate([
    (0, graphql_1.ResolveField)(() => Boolean, {
        name: 'hasChildren',
        description: 'Check if category has children'
    }),
    __param(0, (0, graphql_1.Parent)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [category_dto_1.Category]),
    __metadata("design:returntype", Promise)
], CategoriesResolver.prototype, "hasChildren", null);
__decorate([
    (0, graphql_1.ResolveField)(() => graphql_1.Int, {
        name: 'childrenCount',
        description: 'Number of direct children'
    }),
    __param(0, (0, graphql_1.Parent)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [category_dto_1.Category]),
    __metadata("design:returntype", Promise)
], CategoriesResolver.prototype, "childrenCount", null);
__decorate([
    (0, graphql_1.ResolveField)(() => graphql_1.Int, {
        name: 'depth',
        description: 'Category depth level (0 for root categories)'
    }),
    __param(0, (0, graphql_1.Parent)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [category_dto_1.Category]),
    __metadata("design:returntype", Promise)
], CategoriesResolver.prototype, "depth", null);
__decorate([
    (0, graphql_1.ResolveField)(() => [category_dto_1.Category], {
        name: 'breadcrumb',
        description: 'Full path from root to this category'
    }),
    __param(0, (0, graphql_1.Parent)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [category_dto_1.Category]),
    __metadata("design:returntype", Promise)
], CategoriesResolver.prototype, "breadcrumb", null);
__decorate([
    (0, graphql_1.ResolveField)(() => [category_dto_1.Category], {
        name: 'descendants',
        description: 'All descendants of this category'
    }),
    __param(0, (0, graphql_1.Parent)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [category_dto_1.Category]),
    __metadata("design:returntype", Promise)
], CategoriesResolver.prototype, "descendants", null);
__decorate([
    (0, graphql_1.ResolveField)(() => graphql_1.Int, {
        name: 'totalDescendants',
        description: 'Total number of descendants'
    }),
    __param(0, (0, graphql_1.Parent)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [category_dto_1.Category]),
    __metadata("design:returntype", Promise)
], CategoriesResolver.prototype, "totalDescendants", null);
exports.CategoriesResolver = CategoriesResolver = CategoriesResolver_1 = __decorate([
    (0, graphql_1.Resolver)(() => category_dto_1.Category),
    __metadata("design:paramtypes", [categories_service_1.CategoriesService])
], CategoriesResolver);
//# sourceMappingURL=categories.resolver.js.map