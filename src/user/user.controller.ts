import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUser: any) {
    var data = createUser
    data.status = "false"
    data.code = 0;
    return this.userService.create(data);
  }

  @Post('getToken')
  activate(@Body() activateUser: any) {
    return this.userService.getToken(activateUser);
  }

  @Post('login')
  login(@Body() loginUser: any) {
    return this.userService.login(loginUser);
  }

  // @Get()
  // findAll() {
  //   return this.userService.findAll();
  // }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Get('cellphone/:cellphone')
  findByCellphone(@Param('cellphone') cellphone: string) {
    return this.userService.findByCellphone(cellphone);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUser: any) {
    return this.userService.update(id, updateUser);
  }



  // @Get('activate/:id')
  // activate(@Param('id') id: string) {
  //   return this.userService.activate(id);
  // } 

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.userService.remove(+id);
  // }
}
