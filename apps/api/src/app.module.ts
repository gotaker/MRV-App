import { Module, OnModuleInit } from '@nestjs/common';
import { MongooseModule, InjectModel } from '@nestjs/mongoose';
import { HealthController } from './controllers/health.controller';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { Model } from 'mongoose';
import { User, UserSchema } from './schemas/user.schema';
import * as bcrypt from 'bcrypt';

const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/mrv';

@Module({
  imports: [
    MongooseModule.forRoot(mongoUri, { serverSelectionTimeoutMS: 5000 }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    UsersModule,
    AuthModule,
  ],
  controllers: [HealthController],
})
export class AppModule implements OnModuleInit {
  constructor(@InjectModel(User.name) private userModel: Model<any>) {}
  async onModuleInit() {
    // Bootstrap default admin if none exists
    const count = await this.userModel.countDocuments({}).exec();
    if (count === 0) {
      const email = process.env.ADMIN_EMAIL || 'admin@example.com';
      const name = process.env.ADMIN_NAME || 'Admin';
      const pwd = process.env.ADMIN_PASSWORD || 'ChangeMe123';
      const passwordHash = await bcrypt.hash(pwd, 10);
      await this.userModel.create({ email, name, passwordHash, roles: ['admin'], active: true });
      // eslint-disable-next-line no-console
      console.log(`Seeded default admin: ${email} / ${pwd}`);
    }
  }
}
