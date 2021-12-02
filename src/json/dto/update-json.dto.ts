import { PartialType } from '@nestjs/swagger';
import { CreateJsonDto } from './create-json.dto';

export class UpdateJsonDto extends PartialType(CreateJsonDto) {}
