import { Injectable } from '@nestjs/common';
import { InjectModel, } from '@nestjs/mongoose';

import { CreateEmergencyDto } from './dto/create-emergency.dto';
import { UpdateEmergencyDto } from './dto/update-emergency.dto';
import { Emergency } from './schemas/emergency.schema';
import { Model } from 'mongoose';
import { User } from 'src/user/schemas/user.schema';
import { Tracking } from 'src/tracking/schemas/tracking.schema';

@Injectable()
export class EmergencyService {

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Emergency.name) private emergencyModel: Model<Emergency>,
    @InjectModel(Tracking.name) private trackingModel: Model<Tracking>,
    ) {}
  
  async create(createEmergency: any) {
    console.log(createEmergency);
    // validate user exists
    const user = await this.userModel.findById(createEmergency.user);
    if(!user) {
      return {
        success: false,
        message: 'El usuario no existe',
        data: []
      }
    }
    
    const emergency = await this.emergencyModel.findOne({ user: createEmergency.user, status: 'active' }).populate('user');
    if( emergency ) {
      return {
        success: false,
        message: 'Ya existe una emergencia activa',
        data: emergency
      }
    } 

    //Create emergency with first tracking
    if(user && !emergency) {
      const emergency_ = await this.emergencyModel.create(createEmergency);
      const tracking = await this.trackingModel.create({
        emergency: emergency_._id,
        lat: createEmergency.lat,
        lon: createEmergency.lon 
      })
      return {
        success: true,
        message: 'Se ha creado la emergencia',
        data: emergency_
      }
    } 

    

    //const _emergency = createEmergency;
    //_emergency.status = 'true';
    //return this.emergency.create(_emergency);
    return "demo mode";
  }

  // findAll() {
  //   return `This action returns all emergency`;
  // }

  async inactive(id: string) {
    const emergency = await this.emergencyModel.findOne({ _id: id, status: 'active' });
    if( !emergency ) {
      return {
        success: false,
        message: 'La emergencia no existe',
        data: []
      }
    }
    emergency.status = 'inactive';
    const inactive = await this.emergencyModel.updateOne({ _id: id }, emergency);
    if( inactive ) {
      return {
        success: true,
        message: 'Emergencia inactivada',
        data: await this.emergencyModel.findOne({ _id: id })
      }
    }

    //return this.emergencyModel.updateOne({ _id: id }, emergency);
  }


  findOne(id: string) {
    return this.emergencyModel.findOne({ _id: id }).populate('user');
  }
  


  async findEmergenciesByUser(id: string) {

    const user = await this.userModel.findById(id);

    if(!user) {
      return {
        success: false,
        message: 'El usuario no existe',
        data: []
      }
    }

    const emergencies = await this.emergencyModel.find({ user: id });
    console.log(user);
    console.log(emergencies);
    return {
      success: true,
      message: 'Emergencias encontradas',
      data: {
        user: user,
        emergencies: emergencies
      }
    }

    return emergencies;
  }



  // update(id: number, updateEmergencyDto: UpdateEmergencyDto) {
  //   return `This action updates a #${id} emergency`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} emergency`;
  // }
}
