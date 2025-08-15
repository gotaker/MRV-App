import { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from '../common/dto/login.dto';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
export declare class AuthController {
    private auth;
    private users;
    private jwt;
    constructor(auth: AuthService, users: UsersService, jwt: JwtService);
    register(body: RegisterDto): Promise<{
        id: any;
        email: any;
    }>;
    login(body: LoginDto, res: Response): Promise<{
        accessToken: any;
    }>;
    refresh(req: Request): Promise<{
        accessToken: any;
    }>;
    logout(res: Response): Promise<{
        ok: boolean;
    }>;
    me(req: any): Promise<any>;
}
