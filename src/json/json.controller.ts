import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFiles } from '@nestjs/common';
import { JsonService } from './json.service';
import { CreateJsonDto } from './dto/create-json.dto';
import {  FastifyFilesInterceptor } from 'nest-fastify-multer';
import {
  ApiConsumes,
  ApiOperation,
} from '@nestjs/swagger';
import { diskStorage } from 'multer';

@Controller('json')
export class JsonController {
  constructor(private readonly jsonService: JsonService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload a new file' })
  @FastifyFilesInterceptor('jsonFile', 1,{
    storage: diskStorage({
      destination: './uploads/',
      filename:  function (req, file, cb) {
        cb(null, `${Date.now()}.json`)
        }})})
  create(@UploadedFiles() jsonFile: Express.Multer.File,
  @Body() _: CreateJsonDto,) {
    return this.jsonService.create(jsonFile);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    const fileName = `${id}.json`
    return this.jsonService.findOne(id);
  }

}
