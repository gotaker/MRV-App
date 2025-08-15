import { HydratedDocument } from 'mongoose';
export type UserDocument = HydratedDocument<User>;
export declare class User {
    email: string;
    name: string;
    passwordHash: string;
    roles: string[];
    active: boolean;
}
export declare const UserSchema: any;
