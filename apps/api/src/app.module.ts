import { Module, OnModuleInit } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HealthController } from './controllers/health.controller';
import { UsersModule } from './users/users.module';
import { UsersService } from './users/users.service';
import { AuthModule } from './auth/auth.module';

const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/mrv';

@Module({
  imports: [
    MongooseModule.forRoot(mongoUri, { serverSelectionTimeoutMS: 5000 }),
    UsersModule,
    AuthModule,
  ],
  controllers: [HealthController],
  providers: [],
})
export class AppModule implements OnModuleInit {
  constructor(private readonly users: UsersService) {}
  async onModuleInit() {
    await this.users.ensureAdmin();
  }
}
