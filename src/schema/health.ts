import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
export type HealthDocument = Health & Document;

@Schema({ timestamps: true })
export class Health {
  @Prop({ index: true, unique: true })
  lowerWeight: number;

  @Prop({ index: true, unique: true })
  upperWeight: number;

  @Prop({ index: true, unique: true })
  category: string;

  @Prop({ index: true, unique: true })
  risk: string;
}
export const HealthSchema = SchemaFactory.createForClass(Health);
