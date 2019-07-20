import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


const apiUrl = 'http://201.184.75.194:3000/';
// const apiUrl = 'http://localhost:3000/';



@Injectable({
  providedIn: 'root'
})
export class LedService {

  constructor(
    public http: HttpClient) {

    console.log('Hello LedProvider Provider');
  }

  postLedOnOff(led) {

    return this.http.put(apiUrl + 'led/1', { status: led }, { observe: 'response' }).toPromise()
      .then(res => {
        return res;
      });
  }

  postToken(token) {

    return this.http.post(apiUrl + 'subscribeToTopic', { token: token }, { observe: 'response' }).toPromise()
      .then(res => {
        return res;
      });
  }

  getTemperatura() {
    return this.http.get<any>(apiUrl + 'temperatura/1').toPromise()
    .then(res => {
      return res;
    });
  }
}
