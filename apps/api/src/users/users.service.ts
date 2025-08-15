import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument, UserModelName } from '../schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(UserModelName) private readonly userModel: Model<UserDocument>) {}

  async findByEmail(email: string) {
    return this.userModel.findOne({ email: email.toLowerCase() }).exec();
  }

  async findById(id: string) {
    return this.userModel.findById(id).exec();
  }

  async createUser(email: string, password: string, name?: string, roles: string[] = ['admin']) {
    const passwordHash = await bcrypt.hash(password, 10);
    const user = new this.userModel({ email: email.toLowerCase(), passwordHash, name, roles, active: true });
    return user.save();
  }

  async list(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      this.userModel.find().skip(skip).limit(limit).lean().exec(),
      this.userModel.countDocuments().exec(),
    ]);
    return { items, total, page, limit };
  }

  async ensureAdmin() {
    const email = process.env.ADMIN_EMAIL || 'admin@example.com';
    const password = process.env.ADMIN_PASSWORD || 'ChangeMe123';
    const exists = await this.findByEmail(email);
    if (!exists) {
      await this.createUser(email, password, 'Admin', ['admin']);
      // eslint-disable-next-line no-console
      console.log(`[bootstrap] created default admin: ${email}`);
    }
  }
}
