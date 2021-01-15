import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {

  constructor(private http: HttpClient) { }
  
  getLatest() {
    return this.http.get('https://api.frankfurter.app/latest');
  }
}
