import { OnModuleInit } from '@nestjs/common';
import { Model } from 'mongoose';
export declare class AppModule implements OnModuleInit {
    private userModel;
    constructor(userModel: Model<any>);
    onModuleInit(): Promise<void>;
}
