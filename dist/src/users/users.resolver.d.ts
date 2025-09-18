import { UsersService } from './users.service';
import { CreateUserInput, UpdateUserInput, User } from './dto/user.dto';
import { Role } from '../auth/dto/auth.dto';
export declare class UsersResolver {
    private usersService;
    constructor(usersService: UsersService);
    users(): Promise<User[]>;
    user(id: string): Promise<User>;
    roles(): Promise<Role[]>;
    createUser(input: CreateUserInput): Promise<User>;
    updateUser(id: string, input: UpdateUserInput): Promise<User>;
    deleteUser(id: string): Promise<boolean>;
}
