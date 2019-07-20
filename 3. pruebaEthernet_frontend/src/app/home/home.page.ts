import { Component } from '@angular/core';

import { LedService } from '../services/led/led.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  led: any;
  tittle: any;
  temp: any;

  constructor(
    public ledSvc: LedService) {

      if (this.led === 1) {
        this.tittle = 'Ventilador Encendido';
      } else {
        this.tittle = 'Ventilador Apagado';
      }
  }


  ledOn() {
    this.led = 1;
    this.tittle = 'Ventilador Encendido';

    return this.ledSvc.postLedOnOff(this.led).then(data => {
      console.log(data);
    });
  }

  ledOff() {
    this.led = 0;
    this.tittle = 'Ventilador Apagado';

    return this.ledSvc.postLedOnOff(this.led).then(data => {
      console.log(data);
    });
  }

  getTemp() {
    return this.ledSvc.getTemperatura().then(data => {
      this.temp = data.temperatura;
    });
  }

}
