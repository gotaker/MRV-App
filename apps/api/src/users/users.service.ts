import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findByEmail(email: string) {
    return this.userModel.findOne({ email: email.toLowerCase() }).exec();
  }

  async createUser(email: string, name: string, passwordHash: string, roles: string[] = ['user']) {
    const doc = new this.userModel({ email: email.toLowerCase(), name, passwordHash, roles });
    return doc.save();
  }
}
