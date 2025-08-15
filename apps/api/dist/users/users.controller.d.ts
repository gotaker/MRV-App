import { UsersService } from './users.service';
export declare class UsersController {
    private readonly users;
    constructor(users: UsersService);
    list(page?: number, limit?: number): Promise<{
        items: (import("mongoose").FlattenMaps<import("../schemas/user.schema").UserDocument> & Required<{
            _id: import("mongoose").FlattenMaps<unknown>;
        }> & {
            __v: number;
        })[];
        total: number;
        page: number;
        limit: number;
    }>;
}
