import { AuthUser } from '../../auth/dto/auth.dto';
export declare class StandardResponse {
    ok: boolean;
    message: string;
    code?: string;
}
export declare class AuthResponse extends StandardResponse {
    accessToken?: string;
    refreshToken?: string;
    user?: AuthUser;
}
export declare class RegisterResponse extends StandardResponse {
    id?: string;
    status?: string;
}
