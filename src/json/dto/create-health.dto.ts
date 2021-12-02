import { ApiProperty } from '@nestjs/swagger';
export class CreateHealthDto {
  @ApiProperty({ type: 'number', format: 'number', required: true, example: 0 })
  lowerWeight: number;
  @ApiProperty({
    type: 'number',
    format: 'number',
    required: true,
    example: 18.4,
  })
  upperWeight: number;
  @ApiProperty({
    type: 'string',
    format: 'string',
    required: true,
    example: 'Underweight',
  })
  category: string;
  @ApiProperty({
    type: 'string',
    format: 'string',
    required: true,
    example: 'Underweight',
  })
  risk: string;
}
