import { CommercialAgent } from '../../users/dto/commercial-agent.dto';
export declare class LoginInput {
    phone: string;
    password: string;
}
export declare class RegisterShopInput {
    phone: string;
    password: string;
    shopName: string;
    ownerName: string;
    city: string;
    address: string;
    latitude?: number;
    longitude?: number;
}
export declare class Role {
    id: string;
    name: string;
    permissions: any;
}
export declare class AuthUser {
    id: string;
    phone: string;
    type: string;
    role: Role;
    commercialAgent?: CommercialAgent;
    createdAt: Date;
    updatedAt: Date;
}
export declare class AuthPayload {
    accessToken: string;
    refreshToken: string;
    user: AuthUser;
}
export declare class UpdatePasswordInput {
    oldPassword: string;
    newPassword: string;
}
export declare class UpdateProfileInput {
    phone?: string;
}
