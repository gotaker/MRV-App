import { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from '../common/dto/login.dto';
import { RegisterDto } from '../common/dto/register.dto';
export declare class AuthController {
    private readonly auth;
    constructor(auth: AuthService);
    register(body: RegisterDto): Promise<{
        id: any;
        email: string;
    }>;
    login(body: LoginDto, res: Response): Promise<{
        accessToken: string;
    }>;
    refresh(req: Request, res: Response): Promise<{
        accessToken: string;
    }>;
    logout(res: Response): Promise<{
        ok: boolean;
    }>;
    me(req: any): {
        id: any;
        email: any;
        roles: any;
    };
    whoami(req: any): {
        id: any;
        email: any;
        roles: any;
    };
}
