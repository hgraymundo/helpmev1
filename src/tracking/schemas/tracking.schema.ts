
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Emergency } from 'src/emergency/schemas/emergency.schema';


@Schema()
export class Tracking {

    @Prop({ required: true })
    lat: string;

    @Prop({ required: true })
    lon: string;

    @Prop( { default: Date.now } )
    created_at: Date;

    @Prop( { default: Date.now } )
    updated_at: Date;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Emergency' })
    emergency: Emergency

}

export const TrackingSchema = SchemaFactory.createForClass(Tracking);
