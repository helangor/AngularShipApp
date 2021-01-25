import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ShipExtraDataService {

  constructor(private http: HttpClient) { }
  
  getLatest() {
    return this.http.get('https://localhost:44317/weatherforecast');
  }
  getExtraData(mmsi: number) {
    return this.http.get('https://localhost:44317/shipextradata?' + mmsi);
  }
}
