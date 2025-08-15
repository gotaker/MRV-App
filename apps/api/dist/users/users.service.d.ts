import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';
export declare class UsersService {
    private userModel;
    constructor(userModel: Model<UserDocument>);
    findByEmail(email: string): any;
    findById(id: string): any;
    create(user: Partial<User>): Promise<any>;
    list(): Promise<any>;
    remove(id: string): Promise<any>;
}
