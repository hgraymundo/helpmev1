import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { now } from "mongoose";
import { User } from "src/user/schemas/user.schema";

@Schema()
export class Emergency {
  
    // @Prop({ required: true })
    // lat: string;
    // @Prop({ required: true })
    // lon: string;

    @Prop({ required: true })
    timestamp: string;
    
    @Prop({ required: false, default: "active" })
    status: string;

    @Prop({ required: false })
    meet: string;

    @Prop({ default: now() })
    created_at: Date;
    
    @Prop({ default: now() })
    updated_at: Date;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    user: User;
}

export const EmergencySchema = SchemaFactory.createForClass(Emergency)