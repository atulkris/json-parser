import { Module } from '@nestjs/common';
import { JsonService } from './json.service';
import { JsonController } from './json.controller';
import { HealthSchema } from 'src/schema/health';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'health', schema: HealthSchema }]),
  ],
  controllers: [JsonController],
  providers: [JsonService],
})
export class JsonModule {}
