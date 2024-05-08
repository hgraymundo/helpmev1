import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TrackingService } from './tracking.service';
import { CreateTrackingDto } from './dto/create-tracking.dto';
import { UpdateTrackingDto } from './dto/update-tracking.dto';
import { EmergencyService } from 'src/emergency/emergency.service';
import { ContactService } from 'src/contact/contact.service';
import { HttpService } from '@nestjs/axios';


@Controller('tracking')
export class TrackingController {
  constructor(
    private readonly trackingService: TrackingService,
    private readonly emergencyService: EmergencyService,
    private readonly contactService: ContactService,
    private readonly httpService: HttpService


    ) {}

  @Post()
  async create(@Body() createTracking: any) {
    const _tracking = await this.trackingService.create(createTracking);
    
    if(_tracking) {
      const emergency = await this.emergencyService.findOne(createTracking.emergency);
      //console.log(emergency["user"]);
      if(emergency) {
        const user = emergency["user"]["_id"];  
        console.log(user);
        const _contacts = await this.contactService.findbyUser(user);
        var __contacts = "";
        _contacts.forEach(contact => { 
               __contacts += contact.cellphone + ",";
        })
        console.log(__contacts.substring(0, __contacts.length - 1))
        this.sendSMS(emergency["user"]["name"] + " " + emergency["user"]["lastname"], emergency["user"]["cellphone"], __contacts.substring(0, __contacts.length - 1), createTracking.lat, createTracking.lon);
        this.getTokenTelegram(emergency["user"]["name"] + " " + emergency["user"]["lastname"], emergency["user"]["cellphone"], createTracking.lat, createTracking.lon);
        this.sendTelegram(emergency["user"]["name"] + " " + emergency["user"]["lastname"], "https://easyconference.uibk.ac.at/PruebaEmergencias");
      }
    }
    return _tracking;
  }

  @Get()
  findAll() {
    return this.trackingService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.trackingService.findOne(id);
  }

  @Get('emergency/:id')
  getTrackingByEmergency(@Param('id') id: string) {
    return this.trackingService.getTrackingByEmergency(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTrackingDto: UpdateTrackingDto) {
    return this.trackingService.update(+id, updateTrackingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.trackingService.remove(+id);
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

  const message = " Meet de emergencia de :" +  name + " meeting: " + meeting;

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
    console.log(res);
  })
})
  
}


}
