import { AuthService } from './auth.service';
import { LoginInput, RegisterShopInput, UpdatePasswordInput, AuthUser, UpdateProfileInput } from './dto/auth.dto';
import { AuthResponse, RegisterResponse } from '../common/dto/response.dto';
export declare class AuthResolver {
    private authService;
    constructor(authService: AuthService);
    login(loginInput: LoginInput): Promise<AuthResponse>;
    shopLogin(loginInput: LoginInput): Promise<AuthResponse>;
    registerShop(registerInput: RegisterShopInput): Promise<RegisterResponse>;
    refreshToken(token: string): Promise<AuthResponse>;
    logout(context: any): Promise<boolean>;
    updatePassword(updatePasswordInput: UpdatePasswordInput, context: any): Promise<boolean>;
    getProfile(context: any): Promise<AuthUser>;
    updateProfile(updateProfileInput: UpdateProfileInput, context: any): Promise<AuthUser>;
}
