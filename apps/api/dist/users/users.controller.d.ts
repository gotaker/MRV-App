import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    me(_params: any): Promise<{
        message: string;
    }>;
    list(): Promise<any>;
    delete(id: string): Promise<{
        ok: boolean;
    }>;
}
