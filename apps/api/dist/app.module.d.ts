import { OnModuleInit } from '@nestjs/common';
import { UsersService } from './users/users.service';
export declare class AppModule implements OnModuleInit {
    private readonly users;
    constructor(users: UsersService);
    onModuleInit(): Promise<void>;
}
