import { Module } from '@nestjs/common';
import { EmergencyService } from './emergency.service';
import { EmergencyController } from './emergency.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Emergency, EmergencySchema } from './schemas/emergency.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Emergency.name, schema: EmergencySchema }])],
  controllers: [EmergencyController],
  providers: [EmergencyService],
})
export class EmergencyModule {}
