import { Test, TestingModule } from '@nestjs/testing';
import { JsonController } from './json.controller';
import { JsonService } from './json.service';

describe('JsonController', () => {
  let controller: JsonController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JsonController],
      providers: [JsonService],
    }).compile();

    controller = module.get<JsonController>(JsonController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
