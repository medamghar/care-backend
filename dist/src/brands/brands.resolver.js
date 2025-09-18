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
exports.BrandsResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const common_1 = require("@nestjs/common");
const brands_service_1 = require("./brands.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const brand_dto_1 = require("./dto/brand.dto");
let BrandsResolver = class BrandsResolver {
    constructor(brandsService) {
        this.brandsService = brandsService;
    }
    async brands() {
        return this.brandsService.findAll();
    }
    async brand(id) {
        return this.brandsService.findOne(id);
    }
    async createBrand(input) {
        return this.brandsService.create(input);
    }
    async updateBrand(id, input) {
        return this.brandsService.update(id, input);
    }
    async deleteBrand(id) {
        await this.brandsService.remove(id);
        return true;
    }
};
exports.BrandsResolver = BrandsResolver;
__decorate([
    (0, graphql_1.Query)(() => [brand_dto_1.Brand]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BrandsResolver.prototype, "brands", null);
__decorate([
    (0, graphql_1.Query)(() => brand_dto_1.Brand),
    __param(0, (0, graphql_1.Args)('id', { type: () => graphql_1.ID })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BrandsResolver.prototype, "brand", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, graphql_1.Mutation)(() => brand_dto_1.Brand),
    __param(0, (0, graphql_1.Args)('input', { type: () => brand_dto_1.CreateBrandInput })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [brand_dto_1.CreateBrandInput]),
    __metadata("design:returntype", Promise)
], BrandsResolver.prototype, "createBrand", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, graphql_1.Mutation)(() => brand_dto_1.Brand),
    __param(0, (0, graphql_1.Args)('id', { type: () => graphql_1.ID })),
    __param(1, (0, graphql_1.Args)('input', { type: () => brand_dto_1.UpdateBrandInput })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, brand_dto_1.UpdateBrandInput]),
    __metadata("design:returntype", Promise)
], BrandsResolver.prototype, "updateBrand", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, graphql_1.Mutation)(() => Boolean),
    __param(0, (0, graphql_1.Args)('id', { type: () => graphql_1.ID })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BrandsResolver.prototype, "deleteBrand", null);
exports.BrandsResolver = BrandsResolver = __decorate([
    (0, graphql_1.Resolver)(() => brand_dto_1.Brand),
    __metadata("design:paramtypes", [brands_service_1.BrandsService])
], BrandsResolver);
//# sourceMappingURL=brands.resolver.js.map