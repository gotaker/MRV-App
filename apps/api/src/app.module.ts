import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HealthController } from './controllers/health.controller';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/mrv';

@Module({
  imports: [
    MongooseModule.forRoot(mongoUri)
  ],
  controllers: [HealthController],
  imports: [UsersModule, AuthModule],
  providers: [],
})
export class AppModule {}
