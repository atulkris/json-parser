import { Injectable } from '@nestjs/common';
import { CreateHealthDto } from './dto/create-health.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HealthDocument } from 'src/schema/health';
import * as fs from 'fs';
import * as stream from 'stream';
import * as bfj from 'bfj';
import { join } from 'path';
@Injectable()
export class JsonService {
  constructor(
    @InjectModel('health')
    private readonly healthRepo: Model<HealthDocument>,
  ) { }
  create(jsonFile: Express.Multer.File) {
    this.parseJsonFromStream(jsonFile[0].path)
      .pipe(this.processJsonChunksFromStream())
      .pipe(
        this.writeJson(
          join(process.cwd(), 'uploads', `processed-${jsonFile[0]?.filename}`),
        ),
      );
    return { id: jsonFile[0]?.filename?.split('.json')[0] };
  }

  /**
   * 
   * @param createHealthArray 
   * @returns 
   * function to create healt records
   */
  createHealthRecords(createHealthArray: CreateHealthDto[]) {
    return Promise.all(
      createHealthArray.map((healthRecord) => {
        this.healthRepo.create(healthRecord);
      }),
    );
  }
  /**
   * 
   * @param filePath 
   * @returns 
   * Takes in a json file and streams it is objects
   * uses bfj 
   */
  parseJsonFromStream(filePath: string) {
    const parsedStream = new stream.Readable({ objectMode: true });
    parsedStream._read = () => { };
    let patientData = null;
    let patientKey = null;
    const emitter = bfj.walk(fs.createReadStream(filePath));
    // emitter.on(bfj.events.array,()=>{
    //   patientData={};
    // })
    const setData = (data) => {
      patientData[patientKey] = data;
      patientKey = null;
    };
    emitter.on(bfj.events.object, () => {
      patientData = {};
    });
    emitter.on(bfj.events.property, (name) => {
      patientKey = name;
    });
    emitter.on(bfj.events.string, setData);

    emitter.on(bfj.events.literal, setData);

    emitter.on(bfj.events.number, setData);

    emitter.on(bfj.events.endObject, () => {
      parsedStream.push(patientData);
      patientData = null;
    });
    emitter.on(bfj.events.endArray, () => {
      parsedStream.push(null);
    });
    return parsedStream;
  }
  
  /**
   * 
   * @returns 
   * adds the bmi category and risk to json chunk
   */
  processJsonChunksFromStream() {
    const proccessStream = new stream.Transform({ objectMode: true });
    proccessStream._transform = async (jsonObj, encoding, cb) => {
      const data: any = await this.calculateBMIandFetchCategory(
        jsonObj.HeightCm,
        jsonObj.WeightKg,
      );
      jsonObj.BMI = data.BMI;
      jsonObj.category = data.category;
      jsonObj.risk = data.risk;
      proccessStream.push(jsonObj);
      cb();
    };
    return proccessStream;
  }
  /**
   * 
   * @param height 
   * @param weight 
   * @returns 
   * 
   */
  async calculateBMIandFetchCategory(height: number, weight: number) {
    const BMI = Math.round((weight / (height / 100) ** 2) * 10) / 10;
    const data = await this.healthRepo
      .findOne({ lowerWeight: { $lte: BMI }, upperWeight: { $gte: BMI } })
      .lean()
      .exec();
    return { BMI: BMI, category: data?.category, risk: data?.risk };
  }
  /**
   * 
   * @param processedFilePath 
   * @returns 
   * writes back to a json file
   */
  writeJson(processedFilePath: string) {
    const processedJsonStream = fs.createWriteStream(processedFilePath);
    processedJsonStream.write('{');
    processedJsonStream.write(JSON.stringify('processedArray'));
    processedJsonStream.write(':[');

    let numRecords = 0;
    let overweightCount = 0;

    const processedChunkStream = new stream.Writable({ objectMode: true });
    processedChunkStream._write = (chunk, encoding, callback) => {
      if (numRecords > 0) {
        processedJsonStream.write(',\n');
      }

      const jsonData = JSON.stringify(chunk);
      processedJsonStream.write(jsonData);
      if (chunk.Gender) numRecords += 1;
      if (chunk.category == 'Overweight') {
        overweightCount += 1;
      }
      callback();
    };

    processedChunkStream.on('finish', () => {
      processedJsonStream.write('],\n');
      processedJsonStream.write(JSON.stringify('overweightCount'));
      processedJsonStream.write(`:${overweightCount}`);
      processedJsonStream.write('}');
      processedJsonStream.end();
    });

    return processedChunkStream;
  }
}
