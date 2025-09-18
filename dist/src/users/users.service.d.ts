import { PrismaService } from '../prisma/prisma.service';
import { CreateUserInput, UpdateUserInput } from './dto/user.dto';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    findByPhone(phone: string): Promise<{
        role: {
            id: string;
            name: string;
            permissions: import("@prisma/client/runtime/library").JsonValue;
        };
        commercialAgent: {
            id: string;
            userId: string;
            territory: string;
            commissionRate: number;
        };
    } & {
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        phone: string;
        passwordHash: string;
        roleId: string;
    }>;
    findById(id: string): Promise<{
        role: {
            id: string;
            name: string;
            permissions: import("@prisma/client/runtime/library").JsonValue;
        };
        commercialAgent: {
            id: string;
            userId: string;
            territory: string;
            commissionRate: number;
        };
    } & {
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        phone: string;
        passwordHash: string;
        roleId: string;
    }>;
    findAll(): Promise<any>;
    findOne(id: string): Promise<any>;
    findAllRoles(): Promise<any>;
    create(input: CreateUserInput): Promise<any>;
    update(id: string, input: UpdateUserInput): Promise<any>;
    delete(id: string): Promise<boolean>;
}
