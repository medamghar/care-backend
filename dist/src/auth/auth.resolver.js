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
exports.AuthResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const jwt_auth_guard_1 = require("./guards/jwt-auth.guard");
const auth_dto_1 = require("./dto/auth.dto");
const response_dto_1 = require("../common/dto/response.dto");
let AuthResolver = class AuthResolver {
    constructor(authService) {
        this.authService = authService;
    }
    async login(loginInput) {
        return this.authService.login(loginInput);
    }
    async shopLogin(loginInput) {
        return this.authService.shopLogin(loginInput);
    }
    async registerShop(registerInput) {
        return this.authService.registerShop(registerInput);
    }
    async refreshToken(token) {
        return this.authService.refreshToken(token);
    }
    async logout(context) {
        const token = context.req.headers.authorization?.replace('Bearer ', '');
        return this.authService.logout(token);
    }
    async updatePassword(updatePasswordInput, context) {
        const userId = context.req.user.id;
        return this.authService.updatePassword(userId, updatePasswordInput.oldPassword, updatePasswordInput.newPassword);
    }
    async getProfile(context) {
        const userId = context.req.user.id;
        return this.authService.getProfile(userId);
    }
    async updateProfile(updateProfileInput, context) {
        const userId = context.req.user.id;
        return this.authService.updateProfile(userId, updateProfileInput);
    }
};
exports.AuthResolver = AuthResolver;
__decorate([
    (0, graphql_1.Mutation)(() => response_dto_1.AuthResponse),
    __param(0, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.LoginInput]),
    __metadata("design:returntype", Promise)
], AuthResolver.prototype, "login", null);
__decorate([
    (0, graphql_1.Mutation)(() => response_dto_1.AuthResponse),
    __param(0, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.LoginInput]),
    __metadata("design:returntype", Promise)
], AuthResolver.prototype, "shopLogin", null);
__decorate([
    (0, graphql_1.Mutation)(() => response_dto_1.RegisterResponse),
    __param(0, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.RegisterShopInput]),
    __metadata("design:returntype", Promise)
], AuthResolver.prototype, "registerShop", null);
__decorate([
    (0, graphql_1.Mutation)(() => response_dto_1.AuthResponse),
    __param(0, (0, graphql_1.Args)('token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthResolver.prototype, "refreshToken", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, graphql_1.Mutation)(() => Boolean),
    __param(0, (0, graphql_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthResolver.prototype, "logout", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, graphql_1.Mutation)(() => Boolean),
    __param(0, (0, graphql_1.Args)('input')),
    __param(1, (0, graphql_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.UpdatePasswordInput, Object]),
    __metadata("design:returntype", Promise)
], AuthResolver.prototype, "updatePassword", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, graphql_1.Query)(() => auth_dto_1.AuthUser),
    __param(0, (0, graphql_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthResolver.prototype, "getProfile", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, graphql_1.Mutation)(() => auth_dto_1.AuthUser),
    __param(0, (0, graphql_1.Args)('input')),
    __param(1, (0, graphql_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.UpdateProfileInput, Object]),
    __metadata("design:returntype", Promise)
], AuthResolver.prototype, "updateProfile", null);
exports.AuthResolver = AuthResolver = __decorate([
    (0, graphql_1.Resolver)(),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthResolver);
//# sourceMappingURL=auth.resolver.js.map