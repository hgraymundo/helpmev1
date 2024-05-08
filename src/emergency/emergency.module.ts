import { Module } from '@nestjs/common';
import { EmergencyService } from './emergency.service';
import { EmergencyController } from './emergency.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Emergency, EmergencySchema } from './schemas/emergency.schema';
import { HttpModule } from '@nestjs/axios';
import { ContactService } from 'src/contact/contact.service';
import { Contact, ContactSchema } from 'src/contact/schemas/contact.schema';
import { Tracking, TrackingSchema } from 'src/tracking/schemas/tracking.schema';
import { User, UserSchema } from 'src/user/schemas/user.schema';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Emergency.name, schema: EmergencySchema },
      { name: Contact.name, schema: ContactSchema }, 
      { name: Tracking.name, schema: TrackingSchema }
    ])],
  controllers: [EmergencyController],
  providers: [
    EmergencyService,
    ContactService
  ],
})
export class EmergencyModule {}
