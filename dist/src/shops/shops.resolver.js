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
exports.ShopsResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const common_1 = require("@nestjs/common");
const shops_service_1 = require("./shops.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const shop_dto_1 = require("./dto/shop.dto");
const shop_image_dto_1 = require("./dto/shop-image.dto");
const shop_filters_dto_1 = require("./dto/shop-filters.dto");
const shop_stats_dto_1 = require("./dto/shop-stats.dto");
const graphql_upload_ts_1 = require("graphql-upload-ts");
let ShopsResolver = class ShopsResolver {
    constructor(shopsService) {
        this.shopsService = shopsService;
    }
    async shops(filters) {
        return this.shopsService.findAll(filters);
    }
    async pendingShops() {
        return this.shopsService.findPendingShops();
    }
    async shopStats() {
        return this.shopsService.getShopStats();
    }
    async shop(id) {
        return this.shopsService.findById(id);
    }
    async shopImages(shopId) {
        return this.shopsService.findShopImages(shopId);
    }
    async updateShop(id, input, images) {
        console.log('Received images for updateShop:', images);
        return await this.shopsService.update(id, input, images);
    }
    async updateShopPassword(id, input) {
        return this.shopsService.updatePassword(id, input);
    }
    async deleteShop(id) {
        return this.shopsService.delete(id);
    }
    async addShopImage(input) {
        return this.shopsService.addShopImage(input);
    }
    async updateShopImage(id, input) {
        return this.shopsService.updateShopImage(id, input);
    }
    async deleteShopImage(id) {
        return this.shopsService.deleteShopImage(id);
    }
    async approveShop(shopId, context) {
        const currentUserId = context.req.user?.id;
        return this.shopsService.updateStatus(shopId, 'APPROVED', currentUserId);
    }
    async blockShop(shopId, context) {
        const currentUserId = context.req.user?.id;
        return this.shopsService.updateStatus(shopId, 'BLOCKED', currentUserId);
    }
    async createShop(input, context) {
        const currentUserId = context.req.user?.id;
        return this.shopsService.createShop(input, currentUserId);
    }
    async updateShopStatus(id, status, context) {
        const currentUserId = context.req.user?.id;
        return this.shopsService.updateStatus(id, status, currentUserId);
    }
};
exports.ShopsResolver = ShopsResolver;
__decorate([
    (0, graphql_1.Query)(() => [shop_dto_1.Shop]),
    __param(0, (0, graphql_1.Args)('filters', { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [shop_filters_dto_1.ShopFiltersInput]),
    __metadata("design:returntype", Promise)
], ShopsResolver.prototype, "shops", null);
__decorate([
    (0, graphql_1.Query)(() => [shop_dto_1.Shop]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ShopsResolver.prototype, "pendingShops", null);
__decorate([
    (0, graphql_1.Query)(() => shop_stats_dto_1.ShopStats),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ShopsResolver.prototype, "shopStats", null);
__decorate([
    (0, graphql_1.Query)(() => shop_dto_1.Shop),
    __param(0, (0, graphql_1.Args)('id', { type: () => graphql_1.ID })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ShopsResolver.prototype, "shop", null);
__decorate([
    (0, graphql_1.Query)(() => [shop_image_dto_1.ShopImage]),
    __param(0, (0, graphql_1.Args)('shopId', { type: () => graphql_1.ID })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ShopsResolver.prototype, "shopImages", null);
__decorate([
    (0, graphql_1.Mutation)(() => shop_dto_1.Shop),
    __param(0, (0, graphql_1.Args)('id', { type: () => graphql_1.ID })),
    __param(1, (0, graphql_1.Args)('input')),
    __param(2, (0, graphql_1.Args)('images', { type: () => [graphql_upload_ts_1.GraphQLUpload], nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, shop_dto_1.UpdateShopInput, Promise]),
    __metadata("design:returntype", Promise)
], ShopsResolver.prototype, "updateShop", null);
__decorate([
    (0, graphql_1.Mutation)(() => shop_dto_1.Shop),
    __param(0, (0, graphql_1.Args)('id', { type: () => graphql_1.ID })),
    __param(1, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, shop_dto_1.UpdateShopPasswordInput]),
    __metadata("design:returntype", Promise)
], ShopsResolver.prototype, "updateShopPassword", null);
__decorate([
    (0, graphql_1.Mutation)(() => Boolean),
    __param(0, (0, graphql_1.Args)('id', { type: () => graphql_1.ID })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ShopsResolver.prototype, "deleteShop", null);
__decorate([
    (0, graphql_1.Mutation)(() => shop_image_dto_1.ShopImage),
    __param(0, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [shop_image_dto_1.CreateShopImageInput]),
    __metadata("design:returntype", Promise)
], ShopsResolver.prototype, "addShopImage", null);
__decorate([
    (0, graphql_1.Mutation)(() => shop_image_dto_1.ShopImage),
    __param(0, (0, graphql_1.Args)('id', { type: () => graphql_1.ID })),
    __param(1, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, shop_image_dto_1.UpdateShopImageInput]),
    __metadata("design:returntype", Promise)
], ShopsResolver.prototype, "updateShopImage", null);
__decorate([
    (0, graphql_1.Mutation)(() => Boolean),
    __param(0, (0, graphql_1.Args)('id', { type: () => graphql_1.ID })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ShopsResolver.prototype, "deleteShopImage", null);
__decorate([
    (0, graphql_1.Mutation)(() => shop_dto_1.Shop),
    __param(0, (0, graphql_1.Args)('shopId', { type: () => graphql_1.ID })),
    __param(1, (0, graphql_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ShopsResolver.prototype, "approveShop", null);
__decorate([
    (0, graphql_1.Mutation)(() => shop_dto_1.Shop),
    __param(0, (0, graphql_1.Args)('shopId', { type: () => graphql_1.ID })),
    __param(1, (0, graphql_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ShopsResolver.prototype, "blockShop", null);
__decorate([
    (0, graphql_1.Mutation)(() => shop_dto_1.Shop),
    __param(0, (0, graphql_1.Args)('input')),
    __param(1, (0, graphql_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [shop_dto_1.CreateShopInput, Object]),
    __metadata("design:returntype", Promise)
], ShopsResolver.prototype, "createShop", null);
__decorate([
    (0, graphql_1.Mutation)(() => shop_dto_1.Shop),
    __param(0, (0, graphql_1.Args)('id', { type: () => graphql_1.ID })),
    __param(1, (0, graphql_1.Args)('status', { type: () => String })),
    __param(2, (0, graphql_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], ShopsResolver.prototype, "updateShopStatus", null);
exports.ShopsResolver = ShopsResolver = __decorate([
    (0, graphql_1.Resolver)(() => shop_dto_1.Shop),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [shops_service_1.ShopsService])
], ShopsResolver);
//# sourceMappingURL=shops.resolver.js.map