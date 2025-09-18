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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const bcrypt = require("bcrypt");
const prisma_service_1 = require("../prisma/prisma.service");
let AuthService = class AuthService {
    constructor(prisma, jwtService, configService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.configService = configService;
    }
    async validateUser(phone, password) {
        const shop = await this.prisma.shop.findUnique({
            where: { phone },
            include: {
                createdBy: {
                    include: { role: true },
                },
            },
        });
        if (shop && shop.status === 'APPROVED') {
            const isPasswordValid = await bcrypt.compare(password, shop.passwordHash);
            if (isPasswordValid) {
                return {
                    id: shop.id,
                    phone: shop.phone,
                    type: 'shop',
                    role: { name: 'shop_owner', permissions: {} },
                    shop: shop,
                };
            }
        }
        const user = await this.prisma.user.findUnique({
            where: { phone },
            include: {
                role: true,
                commercialAgent: true,
            },
        });
        if (user && user.isActive) {
            const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
            if (isPasswordValid) {
                return {
                    id: user.id,
                    phone: user.phone,
                    type: 'user',
                    role: user.role,
                    commercialAgent: user.commercialAgent,
                };
            }
        }
        return null;
    }
    async login(loginInput) {
        const { phone, password } = loginInput;
        if (!this.isValidMoroccanPhone(phone)) {
            return {
                ok: false,
                message: 'Invalid Moroccan phone number format',
                code: 'INVALID_PHONE_FORMAT',
            };
        }
        const user = await this.validateUser(phone, password);
        if (!user) {
            return {
                ok: false,
                message: 'Invalid credentials',
                code: 'INVALID_CREDENTIALS',
            };
        }
        try {
            const payload = {
                sub: user.id,
                phone: user.phone,
                type: user.type,
                role: user.role.name,
            };
            const accessToken = this.jwtService.sign(payload);
            const refreshToken = this.jwtService.sign(payload, {
                expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN'),
            });
            await this.prisma.session.create({
                data: {
                    userId: user.type === 'user' ? user.id : null,
                    token: refreshToken,
                    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                },
            });
            return {
                ok: true,
                message: 'Login successful',
                accessToken,
                refreshToken,
                user: {
                    id: user.id,
                    phone: user.phone,
                    role: {
                        id: user.role.id || user.role.name,
                        name: user.role.name,
                        permissions: JSON.stringify(user.role.permissions),
                    },
                    type: user.type,
                    commercialAgent: user.commercialAgent,
                },
            };
        }
        catch {
            return {
                ok: false,
                message: 'Login failed due to server error',
                code: 'SERVER_ERROR',
            };
        }
    }
    async shopLogin(loginInput) {
        const { phone, password } = loginInput;
        if (!phone || !password) {
            return {
                ok: false,
                message: 'Phone number and password are required',
                code: 'MISSING_CREDENTIALS',
            };
        }
        if (!this.isValidMoroccanPhone(phone)) {
            return {
                ok: false,
                message: 'Invalid Moroccan phone number format',
                code: 'INVALID_PHONE_FORMAT',
            };
        }
        const shop = await this.prisma.shop.findUnique({
            where: { phone },
            include: {
                createdBy: {
                    include: { role: true },
                },
            },
        });
        if (!shop) {
            return {
                ok: false,
                message: 'Shop not found with this phone number',
                code: 'SHOP_NOT_FOUND',
            };
        }
        if (shop.status === 'BLOCKED') {
            return {
                ok: false,
                message: 'Shop account has been blocked',
                code: 'SHOP_BLOCKED',
            };
        }
        if (shop.status !== 'APPROVED') {
            return {
                ok: false,
                message: 'Shop account is not approved yet',
                code: 'SHOP_NOT_APPROVED',
            };
        }
        const isPasswordValid = await bcrypt.compare(password, shop.passwordHash);
        if (!isPasswordValid) {
            return {
                ok: false,
                message: 'Incorrect password',
                code: 'INVALID_PASSWORD',
            };
        }
        try {
            const user = {
                id: shop.id,
                phone: shop.phone,
                type: 'shop',
                role: { id: 'shop_owner', name: 'shop_owner', permissions: {} },
                shop: shop,
            };
            const payload = {
                sub: user.id,
                phone: user.phone,
                type: user.type,
                role: user.role.name,
            };
            const accessToken = this.jwtService.sign(payload);
            const refreshToken = this.jwtService.sign(payload, {
                expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN'),
            });
            await this.prisma.session.create({
                data: {
                    userId: null,
                    token: refreshToken,
                    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                },
            });
            return {
                ok: true,
                message: 'Shop login successful',
                accessToken,
                refreshToken,
                user: {
                    id: user.id,
                    phone: user.phone,
                    role: {
                        id: user.role.id,
                        name: user.role.name,
                        permissions: JSON.stringify(user.role.permissions),
                    },
                    type: user.type,
                },
            };
        }
        catch {
            return {
                ok: false,
                message: 'Login failed due to server error',
                code: 'SERVER_ERROR',
            };
        }
    }
    async registerShop(registerInput) {
        const { phone, password, shopName, ownerName, city, address, latitude, longitude, } = registerInput;
        if (!this.isValidMoroccanPhone(phone)) {
            return {
                ok: false,
                message: 'Invalid Moroccan phone number format',
                code: 'INVALID_PHONE_FORMAT',
            };
        }
        const existingShop = await this.prisma.shop.findUnique({
            where: { phone },
        });
        if (existingShop) {
            return {
                ok: false,
                message: 'Phone number already registered',
                code: 'PHONE_ALREADY_EXISTS',
            };
        }
        try {
            const hashedPassword = await bcrypt.hash(password, 12);
            const shop = await this.prisma.shop.create({
                data: {
                    nameAr: shopName,
                    ownerName,
                    phone,
                    passwordHash: hashedPassword,
                    city,
                    address,
                    latitude,
                    longitude,
                    status: 'PENDING',
                },
            });
            return {
                ok: true,
                message: 'Shop registration submitted for approval',
                id: shop.id,
                status: 'PENDING',
            };
        }
        catch {
            return {
                ok: false,
                message: 'Registration failed due to server error',
                code: 'SERVER_ERROR',
            };
        }
    }
    async refreshToken(token) {
        try {
            const payload = this.jwtService.verify(token);
            const session = await this.prisma.session.findUnique({
                where: { token },
                include: {
                    user: {
                        include: {
                            role: true,
                            commercialAgent: true,
                        },
                    },
                },
            });
            if (!session || session.expiresAt < new Date()) {
                return {
                    ok: false,
                    message: 'Invalid refresh token',
                    code: 'INVALID_REFRESH_TOKEN',
                };
            }
            const newPayload = {
                sub: payload.sub,
                phone: payload.phone,
                type: payload.type,
                role: payload.role,
            };
            const accessToken = this.jwtService.sign(newPayload);
            return {
                ok: true,
                message: 'Token refreshed successfully',
                accessToken,
                refreshToken: token,
                user: {
                    id: payload.sub,
                    phone: payload.phone,
                    role: {
                        id: session.user?.role?.id || 'shop_owner',
                        name: session.user?.role?.name || 'shop_owner',
                        permissions: JSON.stringify(session.user?.role?.permissions || {}),
                    },
                    type: payload.type,
                    commercialAgent: session.user?.commercialAgent,
                },
            };
        }
        catch {
            return {
                ok: false,
                message: 'Invalid refresh token',
                code: 'INVALID_REFRESH_TOKEN',
            };
        }
    }
    async logout(token) {
        await this.prisma.session.deleteMany({
            where: { token },
        });
        return true;
    }
    async updatePassword(userId, oldPassword, newPassword) {
        try {
            const user = await this.prisma.user.findUnique({
                where: { id: userId },
            });
            if (!user) {
                return false;
            }
            const isOldPasswordValid = await bcrypt.compare(oldPassword, user.passwordHash);
            if (!isOldPasswordValid) {
                return false;
            }
            const hashedNewPassword = await bcrypt.hash(newPassword, 12);
            await this.prisma.user.update({
                where: { id: userId },
                data: { passwordHash: hashedNewPassword },
            });
            return true;
        }
        catch {
            return false;
        }
    }
    isValidMoroccanPhone(phone) {
        const moroccanPhoneRegex = /^0[67]\d{8}$/;
        return moroccanPhoneRegex.test(phone);
    }
    async createDefaultAdmin() {
        const adminPhone = this.configService.get('ADMIN_PHONE');
        const adminPassword = this.configService.get('ADMIN_PASSWORD');
        let adminRole = await this.prisma.role.findUnique({
            where: { name: 'super_admin' },
        });
        if (!adminRole) {
            adminRole = await this.prisma.role.create({
                data: {
                    name: 'super_admin',
                    permissions: {
                        users: ['create', 'read', 'update', 'delete'],
                        shops: ['create', 'read', 'update', 'delete', 'approve'],
                        products: ['create', 'read', 'update', 'delete'],
                        orders: ['create', 'read', 'update', 'delete'],
                        promotions: ['create', 'read', 'update', 'delete'],
                        notifications: ['create', 'read', 'update', 'delete'],
                    },
                },
            });
        }
        const existingAdmin = await this.prisma.user.findUnique({
            where: { phone: adminPhone },
        });
        if (!existingAdmin) {
            const hashedPassword = await bcrypt.hash(adminPassword, 12);
            await this.prisma.user.create({
                data: {
                    phone: adminPhone,
                    passwordHash: hashedPassword,
                    roleId: adminRole.id,
                    isActive: true,
                },
            });
        }
    }
    async getProfile(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: {
                role: true,
                commercialAgent: true,
            },
        });
        if (!user) {
            throw new Error('User not found');
        }
        return {
            id: user.id,
            phone: user.phone,
            type: 'user',
            role: {
                id: user.role.id,
                name: user.role.name,
                permissions: user.role.permissions,
            },
            commercialAgent: user.commercialAgent,
        };
    }
    async updateProfile(userId, input) {
        const updatedUser = await this.prisma.user.update({
            where: { id: userId },
            data: {
                phone: input.phone,
            },
            include: {
                role: true,
                commercialAgent: true,
            },
        });
        return {
            id: updatedUser.id,
            phone: updatedUser.phone,
            type: 'user',
            role: {
                id: updatedUser.role.id,
                name: updatedUser.role.name,
                permissions: updatedUser.role.permissions,
            },
            commercialAgent: updatedUser.commercialAgent,
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map