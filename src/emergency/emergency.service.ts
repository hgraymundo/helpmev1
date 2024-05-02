import { Injectable } from '@nestjs/common';
import { InjectModel, } from '@nestjs/mongoose';

import { CreateEmergencyDto } from './dto/create-emergency.dto';
import { UpdateEmergencyDto } from './dto/update-emergency.dto';
import { Emergency } from './schemas/emergency.schema';
import { Model } from 'mongoose';

@Injectable()
export class EmergencyService {

  constructor(@InjectModel(Emergency.name) private emergency: Model<Emergency>) {}
  
  create(createEmergency: Emergency) {
    const _emergency = createEmergency;
    _emergency.status = 'true';
    return this.emergency.create(_emergency);
  }

  // findAll() {
  //   return `This action returns all emergency`;
  // }

  findOne(id: string) {
    return this.emergency.findOne({ _id: id }).populate('user');
  }
  
  findEmergenciesByUser(id: string) {
    return this.emergency.find({ user: id }).populate('user');
  }

  // update(id: number, updateEmergencyDto: UpdateEmergencyDto) {
  //   return `This action updates a #${id} emergency`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} emergency`;
  // }
}
