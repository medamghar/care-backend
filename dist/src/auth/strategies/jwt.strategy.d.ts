import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    private configService;
    private prisma;
    constructor(configService: ConfigService, prisma: PrismaService);
    validate(payload: any): Promise<{
        id: string;
        phone: string;
        type: string;
        role: {
            name: string;
            permissions: {};
        };
        shop: {
            id: string;
            nameAr: string;
            nameFr: string;
            status: string;
            phone: string;
        };
        commercialAgent?: undefined;
    } | {
        id: string;
        phone: string;
        type: string;
        role: {
            name: string;
            permissions: {};
        };
        shop: {
            createdBy: {
                role: {
                    id: string;
                    name: string;
                    permissions: import("@prisma/client/runtime/library").JsonValue;
                };
            } & {
                id: string;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
                phone: string;
                passwordHash: string;
                roleId: string;
            };
        } & {
            id: string;
            nameAr: string;
            nameFr: string | null;
            createdAt: Date;
            updatedAt: Date;
            phone: string;
            passwordHash: string;
            ownerName: string;
            city: string;
            address: string;
            latitude: number | null;
            longitude: number | null;
            profileImage: string | null;
            status: import(".prisma/client").$Enums.ShopStatus;
            createdByUserId: string | null;
            approvedByUserId: string | null;
        };
        commercialAgent?: undefined;
    } | {
        id: string;
        phone: string;
        type: string;
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
        shop?: undefined;
    }>;
}
export {};
