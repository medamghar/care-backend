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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const bcrypt = require("bcrypt");
let UsersService = class UsersService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findByPhone(phone) {
        return this.prisma.user.findUnique({
            where: { phone },
            include: {
                role: true,
                commercialAgent: true,
            },
        });
    }
    async findById(id) {
        return this.prisma.user.findUnique({
            where: { id },
            include: {
                role: true,
                commercialAgent: true,
            },
        });
    }
    async findAll() {
        return this.prisma.user.findMany({
            include: {
                role: true,
                commercialAgent: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }
    async findOne(id) {
        return this.prisma.user.findUnique({
            where: { id },
            include: {
                role: true,
                commercialAgent: true,
            },
        });
    }
    async findAllRoles() {
        return this.prisma.role.findMany({
            orderBy: {
                name: 'asc',
            },
        });
    }
    async create(input) {
        const hashedPassword = await bcrypt.hash(input.password, 10);
        return this.prisma.user.create({
            data: {
                phone: input.phone,
                passwordHash: hashedPassword,
                roleId: input.roleId,
                isActive: input.isActive,
            },
            include: {
                role: true,
                commercialAgent: true,
            },
        });
    }
    async update(id, input) {
        const updateData = { ...input };
        if (input.password) {
            updateData.passwordHash = await bcrypt.hash(input.password, 10);
            delete updateData.password;
        }
        return this.prisma.user.update({
            where: { id },
            data: updateData,
            include: {
                role: true,
                commercialAgent: true,
            },
        });
    }
    async delete(id) {
        try {
            await this.prisma.user.delete({
                where: { id },
            });
            return true;
        }
        catch (error) {
            return false;
        }
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map