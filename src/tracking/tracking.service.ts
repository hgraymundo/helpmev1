import { Injectable } from '@nestjs/common';
import { CreateTrackingDto } from './dto/create-tracking.dto';
import { UpdateTrackingDto } from './dto/update-tracking.dto';
import { Tracking } from './schemas/tracking.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Emergency } from 'src/emergency/schemas/emergency.schema';

@Injectable()
export class TrackingService {

  constructor(
    @InjectModel(Tracking.name) private trackingModel: Model<Tracking>,
    @InjectModel(Emergency.name) private emergencyModel: Model<Emergency>
  ) {}  

  async create(createTracking: any) {

    const emergency = await this.emergencyModel.findOne({ _id: createTracking.emergency, status: 'active' });
    if(!emergency) {
      return {
        success: false,
        message: 'La emergencia no existe',
        data: []
      }
    }


    const tracking = await this.trackingModel.create(createTracking)
    //console.log(tracking);
    return {
      success: true,
      message: 'Se ha creado el tracking',
      data: tracking
    }
  }

  findAll() {
    return `This action returns all tracking`;
  }

  findOne(id: string) {
    return ""
  }

  async getTrackingByEmergency(id: string) {

    const emergency = await this.emergencyModel.findOne({ _id: id });
    if(!emergency) {
      return {
        success: false,
        message: 'La emergencia no existe',
        data: []
      }
    }
    const tracking = await this.trackingModel.find({ emergency: id });

    return {
      success: true,
      message: 'Tracking de emergencia',
      data: tracking
    }
  }

  update(id: number, updateTrackingDto: UpdateTrackingDto) {
    return `This action updates a #${id} tracking`;
  }

  remove(id: number) {
    return `This action removes a #${id} tracking`;
  }
}
