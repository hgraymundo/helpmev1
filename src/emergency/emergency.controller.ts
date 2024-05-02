import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EmergencyService } from './emergency.service';
import { CreateEmergencyDto } from './dto/create-emergency.dto';
import { UpdateEmergencyDto } from './dto/update-emergency.dto';

@Controller('emergency')
export class EmergencyController {
  constructor(private readonly emergencyService: EmergencyService) {}

  @Post()
  create(@Body() createEmergency: any) {
    return this.emergencyService.create(createEmergency);
  }

  // @Get()
  // findAll() {
  //   return this.emergencyService.findAll();
  // }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.emergencyService.findOne(id);
  }

  @Get('user/:id')
  findEmergenciesByUser(@Param('id') id: string) {
    return this.emergencyService.findEmergenciesByUser(id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateEmergencyDto: UpdateEmergencyDto) {
  //   return this.emergencyService.update(+id, updateEmergencyDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.emergencyService.remove(+id);
  // }
}
