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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const common_1 = require("@nestjs/common");
const products_service_1 = require("./products.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const product_dto_1 = require("./dto/product.dto");
const category_dto_1 = require("../categories/dto/category.dto");
const brand_dto_1 = require("../brands/dto/brand.dto");
let ProductsResolver = class ProductsResolver {
    constructor(productsService) {
        this.productsService = productsService;
    }
    async products(filters) {
        return this.productsService.getProducts(filters || {});
    }
    async GetProductById(id) {
        console.log('Fetching product with ID:', id);
        return this.productsService.getProduct(id);
    }
    async featuredProducts(limit) {
        return this.productsService.getFeaturedProducts(limit);
    }
    async searchProducts(query, limit) {
        return this.productsService.searchProducts(query, limit);
    }
    async categories() {
        return this.productsService.getCategories();
    }
    async category(id) {
        return this.productsService.getCategory(id);
    }
    async brands() {
        return this.productsService.getBrands();
    }
    async brand(id) {
        return this.productsService.getBrand(id);
    }
    async createProduct(input) {
        return this.productsService.createProduct(input);
    }
    async updateProduct(id, input) {
        return this.productsService.updateProduct(id, input);
    }
    async deleteProduct(id) {
        return this.productsService.deleteProduct(id);
    }
    async addProductImage(productId, imageUrl, isPrimary) {
        await this.productsService.addProductImage(productId, imageUrl, isPrimary);
        return true;
    }
    async addPriceTier(productId, minQuantity, pricePerUnit) {
        await this.productsService.addPriceTier(productId, minQuantity, pricePerUnit);
        return true;
    }
    async updateStock(productId, quantity, operation) {
        return this.productsService.updateStock(productId, quantity, operation);
    }
};
exports.ProductsResolver = ProductsResolver;
__decorate([
    (0, graphql_1.Query)(() => product_dto_1.ProductConnection),
    __param(0, (0, graphql_1.Args)('filters', { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [product_dto_1.ProductFilters]),
    __metadata("design:returntype", Promise)
], ProductsResolver.prototype, "products", null);
__decorate([
    (0, graphql_1.Query)(() => product_dto_1.Product),
    __param(0, (0, graphql_1.Args)('id', { type: () => graphql_1.ID })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductsResolver.prototype, "GetProductById", null);
__decorate([
    (0, graphql_1.Query)(() => [product_dto_1.Product]),
    __param(0, (0, graphql_1.Args)('limit', { type: () => graphql_1.Int, defaultValue: 10 })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ProductsResolver.prototype, "featuredProducts", null);
__decorate([
    (0, graphql_1.Query)(() => [product_dto_1.Product]),
    __param(0, (0, graphql_1.Args)('query')),
    __param(1, (0, graphql_1.Args)('limit', { type: () => graphql_1.Int, defaultValue: 20 })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], ProductsResolver.prototype, "searchProducts", null);
__decorate([
    (0, graphql_1.Query)(() => [category_dto_1.Category]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ProductsResolver.prototype, "categories", null);
__decorate([
    (0, graphql_1.Query)(() => category_dto_1.Category),
    __param(0, (0, graphql_1.Args)('id', { type: () => graphql_1.ID })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductsResolver.prototype, "category", null);
__decorate([
    (0, graphql_1.Query)(() => [brand_dto_1.Brand]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ProductsResolver.prototype, "brands", null);
__decorate([
    (0, graphql_1.Query)(() => brand_dto_1.Brand),
    __param(0, (0, graphql_1.Args)('id', { type: () => graphql_1.ID })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductsResolver.prototype, "brand", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, graphql_1.Mutation)(() => product_dto_1.Product),
    __param(0, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [product_dto_1.CreateProductInput]),
    __metadata("design:returntype", Promise)
], ProductsResolver.prototype, "createProduct", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, graphql_1.Mutation)(() => product_dto_1.Product),
    __param(0, (0, graphql_1.Args)('id', { type: () => graphql_1.ID })),
    __param(1, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, product_dto_1.UpdateProductInput]),
    __metadata("design:returntype", Promise)
], ProductsResolver.prototype, "updateProduct", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, graphql_1.Mutation)(() => Boolean),
    __param(0, (0, graphql_1.Args)('id', { type: () => graphql_1.ID })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductsResolver.prototype, "deleteProduct", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, graphql_1.Mutation)(() => Boolean),
    __param(0, (0, graphql_1.Args)('productId', { type: () => graphql_1.ID })),
    __param(1, (0, graphql_1.Args)('imageUrl')),
    __param(2, (0, graphql_1.Args)('isPrimary', { defaultValue: false })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Boolean]),
    __metadata("design:returntype", Promise)
], ProductsResolver.prototype, "addProductImage", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, graphql_1.Mutation)(() => Boolean),
    __param(0, (0, graphql_1.Args)('productId', { type: () => graphql_1.ID })),
    __param(1, (0, graphql_1.Args)('minQuantity')),
    __param(2, (0, graphql_1.Args)('pricePerUnit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number]),
    __metadata("design:returntype", Promise)
], ProductsResolver.prototype, "addPriceTier", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, graphql_1.Mutation)(() => product_dto_1.Product),
    __param(0, (0, graphql_1.Args)('productId', { type: () => graphql_1.ID })),
    __param(1, (0, graphql_1.Args)('quantity')),
    __param(2, (0, graphql_1.Args)('operation', { defaultValue: 'add' })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, String]),
    __metadata("design:returntype", Promise)
], ProductsResolver.prototype, "updateStock", null);
exports.ProductsResolver = ProductsResolver = __decorate([
    (0, graphql_1.Resolver)(() => product_dto_1.Product),
    __metadata("design:paramtypes", [products_service_1.ProductsService])
], ProductsResolver);
//# sourceMappingURL=products.resolver.js.map