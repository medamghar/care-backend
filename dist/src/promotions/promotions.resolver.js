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
exports.PromotionsResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const common_1 = require("@nestjs/common");
const promotions_service_1 = require("./promotions.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const promotion_dto_1 = require("./dto/promotion.dto");
let PromotionsResolver = class PromotionsResolver {
    constructor(promotionsService) {
        this.promotionsService = promotionsService;
    }
    async promotions() {
        return this.promotionsService.findAll();
    }
    async activePromotions() {
        return this.promotionsService.getActivePromotions();
    }
    async sliders() {
        return this.promotionsService.getSliders();
    }
    async createPromotion(input) {
        const promotionData = {
            ...input,
            startDate: new Date(input.startDate),
            endDate: new Date(input.endDate),
        };
        return this.promotionsService.create(promotionData);
    }
    async updatePromotion(id, input) {
        const updateData = {
            ...input,
            ...(input.startDate && { startDate: new Date(input.startDate) }),
            ...(input.endDate && { endDate: new Date(input.endDate) }),
        };
        return this.promotionsService.update(id, updateData);
    }
    async deletePromotion(id) {
        await this.promotionsService.remove(id);
        return true;
    }
    async createSlider(input) {
        return this.promotionsService.createSlider(input);
    }
    async updateSlider(id, input) {
        return this.promotionsService.updateSlider(id, input);
    }
    async deleteSlider(id) {
        await this.promotionsService.removeSlider(id);
        return true;
    }
};
exports.PromotionsResolver = PromotionsResolver;
__decorate([
    (0, graphql_1.Query)(() => [promotion_dto_1.Promotion]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PromotionsResolver.prototype, "promotions", null);
__decorate([
    (0, graphql_1.Query)(() => [promotion_dto_1.Promotion]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PromotionsResolver.prototype, "activePromotions", null);
__decorate([
    (0, graphql_1.Query)(() => [promotion_dto_1.Slider]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PromotionsResolver.prototype, "sliders", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, graphql_1.Mutation)(() => promotion_dto_1.Promotion),
    __param(0, (0, graphql_1.Args)('input', { type: () => promotion_dto_1.CreatePromotionInput })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [promotion_dto_1.CreatePromotionInput]),
    __metadata("design:returntype", Promise)
], PromotionsResolver.prototype, "createPromotion", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, graphql_1.Mutation)(() => promotion_dto_1.Promotion),
    __param(0, (0, graphql_1.Args)('id', { type: () => graphql_1.ID })),
    __param(1, (0, graphql_1.Args)('input', { type: () => promotion_dto_1.UpdatePromotionInput })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, promotion_dto_1.UpdatePromotionInput]),
    __metadata("design:returntype", Promise)
], PromotionsResolver.prototype, "updatePromotion", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, graphql_1.Mutation)(() => Boolean),
    __param(0, (0, graphql_1.Args)('id', { type: () => graphql_1.ID })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PromotionsResolver.prototype, "deletePromotion", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, graphql_1.Mutation)(() => promotion_dto_1.Slider),
    __param(0, (0, graphql_1.Args)('input', { type: () => promotion_dto_1.CreateSliderInput })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [promotion_dto_1.CreateSliderInput]),
    __metadata("design:returntype", Promise)
], PromotionsResolver.prototype, "createSlider", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, graphql_1.Mutation)(() => promotion_dto_1.Slider),
    __param(0, (0, graphql_1.Args)('id', { type: () => graphql_1.ID })),
    __param(1, (0, graphql_1.Args)('input', { type: () => promotion_dto_1.UpdateSliderInput })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, promotion_dto_1.UpdateSliderInput]),
    __metadata("design:returntype", Promise)
], PromotionsResolver.prototype, "updateSlider", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, graphql_1.Mutation)(() => Boolean),
    __param(0, (0, graphql_1.Args)('id', { type: () => graphql_1.ID })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PromotionsResolver.prototype, "deleteSlider", null);
exports.PromotionsResolver = PromotionsResolver = __decorate([
    (0, graphql_1.Resolver)(() => promotion_dto_1.Promotion),
    __metadata("design:paramtypes", [promotions_service_1.PromotionsService])
], PromotionsResolver);
//# sourceMappingURL=promotions.resolver.js.map