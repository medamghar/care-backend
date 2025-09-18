import { Role } from '../../auth/dto/auth.dto';
import { CommercialAgent } from './commercial-agent.dto';
export declare class User {
    id: string;
    phone: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    role: Role;
    commercialAgent?: CommercialAgent;
}
export declare class CreateUserInput {
    phone: string;
    password: string;
    roleId: string;
    isActive: boolean;
}
export declare class UpdateUserInput {
    phone?: string;
    password?: string;
    roleId?: string;
    isActive?: boolean;
}
