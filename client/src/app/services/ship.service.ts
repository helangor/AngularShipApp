import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ShipService {

  constructor(private http: HttpClient) { }
  
  getLatest() {
    return this.http.get('https://meri.digitraffic.fi/api/v1/locations/latitude/61.058983/longitude/28.320951/radius/40/from/2020-01-15T16:18:00.000Z');
  }
}
  // API kutsu mikä pitää tehdä.
//https://meri.digitraffic.fi/api/v1/locations/latitude/61.058983/longitude/28.320951/radius/40/from/2020-01-15T16:18:00.000Z
