import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';

@Injectable()
export class UserService {

  constructor( 
    @InjectModel(User.name) private readonly userModel: Model<User>
    
    ) {}
  create(createUser: User) {
    return this.userModel.create(createUser);
  }

  // findAll() {
  //   return `This action returns all user`;
  // }

  findOne(id: string) {
    return this.userModel.findById(id);
  }

  update(id: string, updateUser: any) {
    return this.userModel.findByIdAndUpdate(id, updateUser);
  }

  // remove(id: number) {
  //   return `This action removes a #${id} user`;
  // }
}
