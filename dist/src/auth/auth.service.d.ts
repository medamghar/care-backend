import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { LoginInput, RegisterShopInput, AuthUser, UpdateProfileInput } from './dto/auth.dto';
import { AuthResponse, RegisterResponse } from '../common/dto/response.dto';
export declare class AuthService {
    private prisma;
    private jwtService;
    private configService;
    constructor(prisma: PrismaService, jwtService: JwtService, configService: ConfigService);
    validateUser(phone: string, password: string): Promise<any>;
    login(loginInput: LoginInput): Promise<AuthResponse>;
    shopLogin(loginInput: LoginInput): Promise<AuthResponse>;
    registerShop(registerInput: RegisterShopInput): Promise<RegisterResponse>;
    refreshToken(token: string): Promise<AuthResponse>;
    logout(token: string): Promise<boolean>;
    updatePassword(userId: string, oldPassword: string, newPassword: string): Promise<boolean>;
    private isValidMoroccanPhone;
    createDefaultAdmin(): Promise<void>;
    getProfile(userId: string): Promise<AuthUser>;
    updateProfile(userId: string, input: UpdateProfileInput): Promise<AuthUser>;
}
