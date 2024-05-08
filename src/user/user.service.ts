import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { HttpService } from '@nestjs/axios';


@Injectable()
export class UserService {
  constructor( 
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly httpService: HttpService
    ) {}
  async create(createUser: User) {
     var user = await this.userModel.findOne({cellphone: createUser.cellphone});
    console.log(user);
    if(user && user.status == "true"){
        return {
            success: false,
            message: "El número de celular ya se encuentra registrado"
        }
    } 

    if(user && user.status == "false"){
      console.log("enviando SMS");
      var _code = Math.floor(1000 + Math.random() * 9000);
      console.log(_code);
      console.log(user.cellphone);

      this.sendSMS(user.cellphone, _code.toString()); 
      return {
          success: true,
          message: "Se ha enviado un SMS al celular con el token de activacion"
      }
    }

    if(!user){
      console.log("creando usuario");
      return this.userModel.create(createUser);
    }
  }
// 
  async getToken(activateUser: any) {
    const user = await this.userModel.findOne({cellphone: activateUser.cellphone});
    if(user) { 
      var _code = Math.floor(1000 + Math.random() * 9000);
      console.log(_code);
      //console.log(user.cellphone);
      
      var update_user =   await this.userModel.findByIdAndUpdate(user._id, { code: _code }, {returnDocument: 'after' });
      console.log(update_user);
      this.sendSMS(user.cellphone, _code.toString());      
      return {
        success: true,
        message: "Se ha enviado un SMS al celular con el token de activacion",
        data: update_user
      }
    } else {  
      return {
        success: false,
        message: "El usuario no existe"
     }
    }
  }

  async login(loginUser: any) {
    console.log(loginUser.cellphone, loginUser.code);
    const user = await this.userModel.findOne({cellphone: loginUser.cellphone, code: loginUser.code});
    console.log(user);  
    if(user) {
      return {
        success: true,
        message: "Login exitoso",
        data: user
      }
    } else {
      return {
        success: false,
        message: "Credenciales incorrectas"
      }
    }
    
  }

  // findAll() {
  //   return `This action returns all user`;
  // }

  findOne(id: string) {
    return this.userModel.findById(id);
  }

  async findByCellphone(cellphone: string) {
    return this.userModel.findOne({cellphone: cellphone});
  }

  update(id: string, updateUser: any) {
    return this.userModel.findByIdAndUpdate(id, updateUser);
  }

  // activate(id: string) {
  //   return this.userModel.findByIdAndUpdate(id, {status: "true"});
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} user`;
  // }

  sendSMS( number: string, code: string ) {
 
    const data = {
       "message": "Codigo de verificacion: " + code,
       "numbers": number,
       "country_code": "52"
     }
     const headers = {
       "apikey": "9a2332e43183a74fc1259ba5762f108dd2b45fde"
     }
 
     this.httpService.post('https://api.smsmasivos.com.mx/sms/send', data, { headers: headers } ).subscribe(res => {
       // console.log(res);
     })
 }

}
