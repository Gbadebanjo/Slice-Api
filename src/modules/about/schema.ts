import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

@Schema({
  timestamps: true,
})
export class About {
  @Prop({
    default: () => new Types.ObjectId(),
  })
  _id?: Types.ObjectId;

  @Prop({
    type: [{ header: String, content: String }],
    default: [],
  })
  abouts: { header: string; content: string }[];
}

export type AboutDocument = HydratedDocument<About>;

export const AboutSchema = SchemaFactory.createForClass(About);
