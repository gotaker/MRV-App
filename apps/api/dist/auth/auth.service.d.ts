import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private users;
    private jwt;
    constructor(users: UsersService, jwt: JwtService);
    private signAccess;
    private signRefresh;
    validateUser(email: string, password: string): Promise<any>;
    login(user: any): Promise<{
        accessToken: any;
        refreshToken: any;
    }>;
}
