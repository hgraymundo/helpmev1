import { Module } from '@nestjs/common';
import { TrackingService } from './tracking.service';
import { TrackingController } from './tracking.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Tracking, TrackingSchema } from './schemas/tracking.schema';
import { Emergency, EmergencySchema } from 'src/emergency/schemas/emergency.schema';
import { EmergencyService } from 'src/emergency/emergency.service';
import { ContactService } from 'src/contact/contact.service';
import { User, UserSchema } from 'src/user/schemas/user.schema';
import { Contact, ContactSchema } from 'src/contact/schemas/contact.schema';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([
      { name: Tracking.name, schema: TrackingSchema },
      { name: Emergency.name, schema: EmergencySchema },
      { name: User.name, schema: UserSchema },
      { name: Emergency.name, schema: EmergencySchema },
      { name: Contact.name, schema: ContactSchema }, 
    ]),
  ],
  controllers: [TrackingController],
  providers: [TrackingService, EmergencyService, ContactService],
})
export class TrackingModule {}
