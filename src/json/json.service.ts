import { Injectable } from '@nestjs/common';
import { CreateJsonDto } from './dto/create-json.dto';
import { UpdateJsonDto } from './dto/update-json.dto';

@Injectable()
export class JsonService {
  create(jsonFile: Express.Multer.File) {
    return jsonFile?.filename?.split(".json")[0];
  }

  findOne(id: string) {
    return `This action returns a #${id} json`;
  }
}
