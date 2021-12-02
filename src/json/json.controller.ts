import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Response,
  UploadedFiles,
  StreamableFile,
} from '@nestjs/common';
import { JsonService } from './json.service';
import { CreateJsonDto } from './dto/create-json.dto';
import { FastifyFilesInterceptor } from 'nest-fastify-multer';
import { ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { createReadStream } from 'fs';
import { join } from 'path';
import { CreateHealthDto } from './dto/create-health.dto';

@Controller('json')
export class JsonController {
  constructor(private readonly jsonService: JsonService) {}

  @Post()
  @ApiTags('file')
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload a new file' })
  @FastifyFilesInterceptor('jsonFile', 1, {
    storage: diskStorage({
      destination: join(process.cwd(), 'uploads'),
      filename: function (req, file, cb) {
        cb(null, `${Date.now()}.json`);
      },
    }),
  })
  uploadFile(
    @UploadedFiles() jsonFile: Express.Multer.File,
    @Body() _: CreateJsonDto,
  ) {
    return this.jsonService.create(jsonFile);
  }

  @Get(':id')
  @ApiTags('file')
  @ApiOperation({ summary: 'Download a processed file' })
  downloadJson(
    @Param('id') id: string,
    @Response({ passthrough: true }) res,
  ): StreamableFile {
    const fileName = `processed-${id}.json`;
    const file = createReadStream(
      join(process.cwd(), 'uploads', `${fileName}`),
    );
    res.header('Content-Type', 'application/json');
    res.header('Content-Disposition', `attachment; filename=${fileName}`);
    return new StreamableFile(file);
  }

  @Post('health')
  @ApiTags('health')
  @ApiOperation({ summary: 'Create  health record entries' })
  async createHealthRecords(@Body() createHealthDto: CreateHealthDto[]) {
    return this.jsonService.createHealthRecords(createHealthDto);
  }
}
