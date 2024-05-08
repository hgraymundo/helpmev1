import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose/dist/mongoose.module';
import { EmergencyModule } from './emergency/emergency.module';
import { ContactModule } from './contact/contact.module';
import { TrackingModule } from './tracking/tracking.module';
import { MeetModule } from './meet/meet.module';



@Module({
  imports: [
    
    
    MongooseModule.forRoot('mongodb+srv://developer:atsuIuAMEwb3qyjf@cluster0.zhobkrv.mongodb.net/tracking'),
    UserModule,
    EmergencyModule,
    ContactModule,
    TrackingModule,
    MeetModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
