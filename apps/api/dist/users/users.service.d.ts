import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';
export declare class UsersService {
    private readonly userModel;
    constructor(userModel: Model<UserDocument>);
    findByEmail(email: string): Promise<import("mongoose").Document<unknown, {}, UserDocument, {}, {}> & User & import("mongoose").Document<unknown, any, any, Record<string, any>, {}> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    findById(id: string): Promise<import("mongoose").Document<unknown, {}, UserDocument, {}, {}> & User & import("mongoose").Document<unknown, any, any, Record<string, any>, {}> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    createUser(email: string, password: string, name?: string, roles?: string[]): Promise<import("mongoose").Document<unknown, {}, UserDocument, {}, {}> & User & import("mongoose").Document<unknown, any, any, Record<string, any>, {}> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    list(page?: number, limit?: number): Promise<{
        items: (import("mongoose").FlattenMaps<UserDocument> & Required<{
            _id: import("mongoose").FlattenMaps<unknown>;
        }> & {
            __v: number;
        })[];
        total: number;
        page: number;
        limit: number;
    }>;
    ensureAdmin(): Promise<void>;
}
