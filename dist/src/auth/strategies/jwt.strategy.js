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
exports.JwtStrategy = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const passport_jwt_1 = require("passport-jwt");
const config_1 = require("@nestjs/config");
const prisma_service_1 = require("../../prisma/prisma.service");
const customJwtExtractor = (req) => {
    try {
        const authHeader = req.headers?.authorization || req.headers?.Authorization;
        if (!authHeader) {
            console.log('No authorization header found');
            return null;
        }
        if (authHeader.startsWith('Bearer ')) {
            const token = authHeader.substring(7);
            console.log('JWT token extracted successfully');
            if (process.env.NODE_ENV === 'development' &&
                token.includes('mock-signature-for-development-only')) {
                console.log('🔧 Development mock token detected');
                return token;
            }
            return token;
        }
        console.log('Authorization header does not start with Bearer');
        return null;
    }
    catch (error) {
        console.error('Error extracting JWT token:', error);
        return null;
    }
};
let JwtStrategy = class JwtStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy) {
    constructor(configService, prisma) {
        super({
            jwtFromRequest: customJwtExtractor,
            ignoreExpiration: process.env.NODE_ENV === 'development',
            secretOrKey: configService.get('JWT_SECRET') || 'fallback-secret-for-dev',
        });
        this.configService = configService;
        this.prisma = prisma;
    }
    async validate(payload) {
        if (process.env.NODE_ENV === 'development') {
            if (!payload || !payload.sub) {
                console.log('🔧 Creating mock user for invalid development token');
                return {
                    id: 'test-shop-id-123',
                    phone: '+1234567890',
                    type: 'shop',
                    role: { name: 'shop_owner', permissions: {} },
                    shop: {
                        id: 'test-shop-id-123',
                        nameAr: 'متجر تجريبي',
                        nameFr: 'Test Shop',
                        status: 'APPROVED',
                        phone: '+1234567890',
                    },
                };
            }
        }
        const { sub: id, type } = payload;
        if (process.env.NODE_ENV === 'development' && id === 'test-shop-id-123') {
            console.log('🔧 Using development mock authentication for shop:', id);
            return {
                id: 'test-shop-id-123',
                phone: '+1234567890',
                type: 'shop',
                role: { name: 'shop_owner', permissions: {} },
                shop: {
                    id: 'test-shop-id-123',
                    nameAr: 'متجر تجريبي',
                    nameFr: 'Test Shop',
                    status: 'APPROVED',
                    phone: '+1234567890',
                },
            };
        }
        if (type === 'shop') {
            const shop = await this.prisma.shop.findUnique({
                where: { id },
                include: {
                    createdBy: {
                        include: { role: true },
                    },
                },
            });
            if (!shop) {
                throw new common_1.UnauthorizedException('Shop not found');
            }
            return {
                id: shop.id,
                phone: shop.phone,
                type: 'shop',
                role: { name: 'shop_owner', permissions: {} },
                shop: shop,
            };
        }
        if (type === 'user') {
            const user = await this.prisma.user.findUnique({
                where: { id },
                include: {
                    role: true,
                    commercialAgent: true,
                },
            });
            if (!user || !user.isActive) {
                throw new common_1.UnauthorizedException('User not found or inactive');
            }
            return {
                id: user.id,
                phone: user.phone,
                type: 'user',
                role: user.role,
                commercialAgent: user.commercialAgent,
            };
        }
        throw new common_1.UnauthorizedException('Invalid user type');
    }
};
exports.JwtStrategy = JwtStrategy;
exports.JwtStrategy = JwtStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        prisma_service_1.PrismaService])
], JwtStrategy);
//# sourceMappingURL=jwt.strategy.js.map