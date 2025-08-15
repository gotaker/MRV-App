import { UsersService } from '../users/users.service';
declare const JwtStrategy_base: any;
export declare class JwtStrategy extends JwtStrategy_base {
    private users;
    constructor(users: UsersService);
    validate(payload: any): Promise<{
        id: any;
        email: any;
        roles: any;
    }>;
}
export {};
