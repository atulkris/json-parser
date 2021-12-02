import { Module } from '@nestjs/common';
import { JsonService } from './json.service';
import { JsonController } from './json.controller';

@Module({
  controllers: [JsonController],
  providers: [JsonService]
})
export class JsonModule {}
