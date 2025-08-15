import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HealthController } from './controllers/health.controller';

const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/mrv';

@Module({
  imports: [
    MongooseModule.forRoot(mongoUri)
  ],
  controllers: [HealthController],
  providers: [],
})
export class AppModule {}
