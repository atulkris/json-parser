import { ApiProperty } from '@nestjs/swagger';
export class CreateJsonDto {

    @ApiProperty({ type: 'string', format: 'binary' })
    jsonFile: any;
}