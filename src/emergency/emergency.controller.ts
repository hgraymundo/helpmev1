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
  async create(@Body() createEmergency: any) {

    //validate user exists
    const emergency = await this.emergencyService.create(createEmergency); 
 
    if(emergency && emergency["success"] == true) {
      console.log("enviando SMS");
      const _contacts = await this.contactService.findbyUser(createEmergency.user);
      var __contacts = "";
      _contacts.forEach(contact => { 
             __contacts += contact.cellphone + ",";
      })
      console.log(__contacts.substring(0, __contacts.length - 1))
      console.log(emergency["data"]["user"].name);

      this.sendSMS(emergency["data"]["user"].name + " " + emergency["data"]["user"].lastname, emergency["data"]["user"].cellphone, __contacts.substring(0, __contacts.length - 1), createEmergency.lat, createEmergency.lon);

      this.getTokenTelegram(emergency["data"]["user"].name + " " + emergency["data"]["user"].lastname, emergency["data"]["user"].cellphone, createEmergency.lat, createEmergency.lon);

      this.sendTelegram(emergency["data"]["user"].name, "https://easyconference.uibk.ac.at/PruebaEmergencias");

    }
   return emergency;
  }


  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.emergencyService.findOne(id);
  }

  @Get('user/:id')
  findEmergenciesByUser(@Param('id') id: string) {

    return this.emergencyService.findEmergenciesByUser(id);
  }
  
  @Get('inactive/:id')
  inactive(@Param('id') id: string) {
    return this.emergencyService.inactive(id);
  }

  sendSMS( name: string, number: string, numbers: string, lat: string, lon: string) {
      const data = {
        "message": "Emergencia:" +  name + " numero:" + number + " ubicado: https://www.google.com/maps/search/?api=1&query=" + lat + "," + lon+ "&z=16",
        "numbers": numbers,
        "country_code": "52" 
      }
      const headers = {
        "apikey": "9a2332e43183a74fc1259ba5762f108dd2b45fde"
      }
  
      this.httpService.post('https://api.smsmasivos.com.mx/sms/send', data, { headers: headers } ).subscribe(res => {
         console.log(res);
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
        const message = "Emergencia de:" +  name + " con el numero de telefono: " + number + " - localizado en: https://www.google.com/maps/search/?api=1&query=" + lat + "," + lon+ "&z=16"

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

        })
        
    })
    
  }

  sendTelegram( name: string, meeting: string) {
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

      const message = " Meet de emergencia de: " +  name + " meeting: " + meeting;

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

      })
  })
      
  }

}


