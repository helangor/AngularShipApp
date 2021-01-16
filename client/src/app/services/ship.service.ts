import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ShipService {

  constructor(private http: HttpClient) { }
  
  getLatest() {
    const timeNow = new Date(Date.now() - 10000).toISOString();
    const coordinates = [60.915, 28.42];
    const radius = 40;
    const apiCall = 'https://meri.digitraffic.fi/api/v1/locations/latitude/' + coordinates[0] + '/longitude/' + coordinates[1] + '/radius/' + radius + '/from/' + timeNow
    console.log("API CALL " + apiCall);
    return this.http.get(apiCall);
  }
}