import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
export declare class AuthService {
    private readonly users;
    private readonly jwt;
    constructor(users: UsersService, jwt: JwtService);
    private signAccessToken;
    private signRefreshToken;
    private cookieOptions;
    register(email: string, password: string, name?: string): Promise<{
        id: any;
        email: string;
    }>;
    validateUser(email: string, password: string): Promise<import("mongoose").Document<unknown, {}, import("../schemas/user.schema").UserDocument, {}, {}> & import("../schemas/user.schema").User & import("mongoose").Document<unknown, any, any, Record<string, any>, {}> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    login(email: string, password: string, res: any): Promise<{
        accessToken: string;
    }>;
    refresh(refreshToken: string, res: any): Promise<{
        accessToken: string;
    }>;
    logout(res: any): Promise<{
        ok: boolean;
    }>;
}
