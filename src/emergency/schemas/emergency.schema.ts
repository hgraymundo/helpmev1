import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { User } from "src/user/schemas/user.schema";

@Schema()
export class Emergency {
  
    @Prop({ required: true })
    lat: string;
    @Prop({ required: true })
    lon: string;
    @Prop({ required: true })
    timestamp: string;
    @Prop({ required: false })
    status: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    user: User;
}

export const EmergencySchema = SchemaFactory.createForClass(Emergency)