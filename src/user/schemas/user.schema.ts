import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class User {

    @Prop({ required: true })
    email: string;
    @Prop({ required: true })
    name: string;
    @Prop({ required: true })
    lastname: string;
    @Prop({ required: true })
    mlastname: string;
    @Prop({ required: true })
    cellphone: string;
    @Prop({ required: true })
    state: string;
    @Prop({ required: true })
    municipality: string;
    @Prop({ required: false, default: false }) 
    status: string
    @Prop({defaul:"0"})
    code: string


}

export const UserSchema = SchemaFactory.createForClass(User);
