import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EmergencyService } from './emergency.service';
import { HttpService } from '@nestjs/axios';
import { ContactService } from 'src/contact/contact.service';

@Controller('emergency')
export class EmergencyController {
  constructor(
    private readonly emergencyService: EmergencyService,
    private readonly contactService: ContactService,
    private readonly httpService: HttpService) {}

  @Post()
  create(@Body() createEmergency: any) {
    const data = this.emergencyService.create(createEmergency).then(data => {
      
      const _contacts = this.contactService.findbyUser(createEmergency.user).populate('user') .then(contacts => {
        var __contacts = "";
        var name ="";
        var number="";
        contacts.forEach(contact => { 
         __contacts += contact.cellphone + ",";
        name = contact.user.name + " " + contact.user.lastname + " " + contact.user.mlastname;
        number = contact.user.cellphone;
        })
        console.log(number)
        console.log( __contacts.substring(0, __contacts.length - 1)) 
        this.sendSMS(name, number, __contacts.substring(0, __contacts.length - 1), createEmergency.lat, createEmergency.lon);
        this.getTokenTelegram( name, number, createEmergency.lat, createEmergency.lon);
      })
      return data;
    })
   return data;
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

  sendSMS( name: string, number: string, numbers: string, lat: string, lon: string) {
 
     const data = {
        "message": "Emergencia de " +  name + " con el numero de telefono:" + numbers + " - localizado en: https://www.google.com/maps/search/?api=1&query=" + lat + "," + lon+ "&z=16",
        "numbers": numbers,
        "country_code": "52" 
      }
      const headers = {
        "apikey": "9a2332e43183a74fc1259ba5762f108dd2b45fde"
      }
  
      this.httpService.post('https://api.smsmasivos.com.mx/sms/send', data, { headers: headers } ).subscribe(res => {
         //console.log(res);
      })
  }

  getTokenTelegram( name: string, number: string, lat: string, lon: string) {

    const headers = {
      'Content-Type': 'application/json'
    }

    let data = JSON.stringify({
      "query": "query getTk{ getTk(email:\"db8481d1-aa14-b57a315472a9\", password:\"Qet1P$0!=fs\"){ status message token }}"
    });

    this.httpService.post('https://api2.idconnect.com.mx/graphql', data, { headers: headers } ).subscribe(res => {
      
        console.log(res.data.data.getTk.token);
        const token = res.data.data.getTk.token;

        const headers = { 
          'Authorization': token, 
          'Content-Type': 'application/json'
        }
        const message = "Emergencia de " +  name + " con el numero de telefono: " + number + " - localizado en: https://www.google.com/maps/search/?api=1&query=" + lat + "," + lon+ "&z=16"

        let data = JSON.stringify({
          query: `mutation setMensajeTelegram($Remitente:String!, $Mensaje:String!) {
          setMensajeTelegram(Remitente:$Remitente, Mensaje:$Mensaje) {
            status
            message
        
          }
        }`,
          variables: { "Remitente":name, "Mensaje": message} 
        });

        this.httpService.post('https://api2.idconnect.com.mx/graphql', data, { headers: headers } ).subscribe(res => {
          //console.log(res.data);
        })
        
    })
    
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


