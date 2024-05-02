import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from 'src/user/schemas/user.schema';

@Schema()
export class Contact {

    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    cellphone: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    user: User;
}

export const ContactSchema = SchemaFactory.createForClass(Contact);

